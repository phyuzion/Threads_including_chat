const { throwServerError , generateToken, throwForbiddenError} = require("../../utils/helpers/genrateTokenAndSetCookie");
const { transformUser,transformUserWithToken,transformUsers } = require("../../utils/transform");
const bcrypt = require('bcryptjs')
const User = require('../../models/userModel')
const ObjectId = require('mongodb').ObjectId;
module.exports = {
    Query: {
      getProfileByName: async (_,args,{req, res}) => {
        const {username} = args
        console.log(' getUserProfileByName userName: ',username)
        try {
          const user = await User.findOne({username }).select('-password').select('-updatedAt');
          console.log('getUserProfileByName user: ',user)
          if(user) {
            return user
          } else {
            console.log(' getUserProfileByName error: ',error)
            throwServerError('User not found')
          }
          
        } catch (error) {
          throwServerError(error)
        }

      },
      getUserProfile: async (_,args,{req, res}) => {
        const {postedBy} = args
        console.log(' getUserProfile id: ',postedBy)
        try {
          const user = await User.findById(postedBy).select('-password').select('-updatedAt');
          console.log('user: ',user)
          if(user) {
            return user
          } else {
            console.log(' getUserProfile error: ',error)
            throwServerError('User not found')
          }
          
        } catch (error) {
          throwServerError(error)
        }
      },
        getSuggestedUsers: async (_,args,{req, res}) => {
          console.log(' getSuggestedUsers: ')
            if(!req.user) {
                throwForbiddenError()
            }
            try {
                const userId = req.user._id;
                const usersFollowedByClient = await User.findById(userId).select('following');
                
                const users = await User.aggregate([
                  {
                    $match: {
                      _id: { $ne: userId },
                      isFrozen: false,
                    },
                  },
                  {
                    $sample: { size: 10 },
                  },
                ]);
                const filteredUsers = users.filter(
                  (user) => !usersFollowedByClient.following.includes(user._id.toString())
                );
                //console.log(' get Suggested users : ',filteredUsers)
                if(filteredUsers && filteredUsers.length > 0 ) {
                  const sugusers =  transformUsers(filteredUsers)
                  console.log(' sugusers: ',sugusers)
                  return sugusers

                } else {
                  console.log(' suggestedUsers does not exist')
                  return []
                }

              } catch (error) {
                console.log(error.message);
                throwServerError(error)
              }
        }
    },
    Mutation: {
      updateUser: async (_,args,{req, res}) => {
        if(!req.user) {
          throwForbiddenError()
        }        
        const { email, password, profilePic } = args
        let user = await User.findById(req.user._id);
        if (!user)
          throwServerError('User not found')

        if (password) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          user.password = hashedPassword;
        }
        user.profilePic = profilePic || user.profilePic
        user.email = email || user.email;
        user = await user.save();
        await Post.updateMany(
          {
            'replies.userId': user._id,
          },
          {
            $set: {
              'replies.$[reply].userProfilePic': user.profilePic,
            },
          },
          { arrayFilters: [{ 'reply.userId': user._id }] }
        );
        return transformUser(user)

      },
        logoutUser: async (_,args,{req, res}) => {
            if(!req.user) {
                throwForbiddenError()
            }

            try{
                const user = User.findOneAndUpdate(
                    {_id: req.user._id},
                    {
                        $set: { jwtToken: null}
                    },
                    {
                        returnOriginal: false
                    })
                if(user && user.jwtToken == null)
                    return true
                return false
            } catch (error) {
                throwServerError(error)
            }

        },

        signupUser : async (_,args,{req, res}) => {
          console.log('args ; ',args)
            try {
                const { username, password, email } = args;
                const user = await User.findOne({ $or: [{ email }, { username }] });
                if (user) {
                  throwServerError('User already exits')
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const newUser = new User({
                  email,
                  username,
                  password: hashedPassword,
                });
                console.log('signup newUser : ',newUser)
                const user_ = await newUser.save();
                console.log('signup : ',user_)
                return transformUser(user_)
              } catch (error) {
                console.log('Error at Signup: ', error.message);
                throwServerError(error)
              }

        },
        loginUser: async (_,args,{req, res}) => {
            const { username, password } = args;

            try {
                console.log('login username : ',username)
                const user = await User.findOne({ username });
                console.log('login user : ',user)
                const isPasswordsCorrect = await bcrypt.compare(password, user?.password || '');
                console.log('login isPasswordsCorrect : ',isPasswordsCorrect)
                if (!user || !isPasswordsCorrect) {
                  throwForbiddenError()
                }
              
                const token = generateToken(user._id, user.email);
                if (user.isFrozen) {
                    user.isFrozen = false;
                    
                }  
                user.jwtToken = token
                const user_ = await user.save();
                console.log
                return transformUserWithToken(user_)
            } catch(error) {
                throwServerError(error)
            }
        },

        freezeAccount: async (_,args,{req, res}) => {
            if(!req.user) {
                throwForbiddenError()
            }
            try {
                const user = await User.findById(req.user._id);
                if (!user) {
                    throwServerError('User not found')
                }
                user.isFrozen = true;
                await user.save();
                return true
              } catch (error) {
                console.log('Error at Freezing Account: ', error.message);
                return false
              }
        },

        followUnFollow: async (_,args,{req, res}) => {
            const { followId } = args
            if(!req.user) {
                throwForbiddenError()
            }
            console.log('followUnFollow: id: ',followId)
            try {
                const userToModify = await User.findById(followId);
                const currentUser = await User.findById(req.user._id);
                if (followId == req.user._id.toString()) {
                    throwServerError('You can not follow/un-follow yourself ');
                }
                if (!userToModify || !currentUser) {
                    throwServerError(' User not found' );
                }   
                const isFollowing = currentUser.following.includes(followId);
                console.log('followUnFollow: isFollowing: ',isFollowing)
                if (isFollowing) {
                  // Un-Following
                  
                  await User.findByIdAndUpdate(req.user._id, {
                    $pull: { following: followId },
                  });
                  const user_ = await User.findByIdAndUpdate(followId, { $pull: { followers: req.user._id } },{returnOriginal: false});
                  console.log('unfollow: ',user_)
                  return transformUser(user_)
                } else {
                  // Following
                  await User.findByIdAndUpdate(req.user._id, { $push: { following: followId } });
                  const user_ =  await User.findByIdAndUpdate(followId, { $push: { followers: req.user._id } }, {returnOriginal: false});
                  console.log('unfollow: ',user_)
                  return transformUser(user_)
                }                             
            } catch(error) {
              console.log(' isFollowing : ',error)
                throwServerError(error)
            }
        }
    }
}