const { throwServerError , generateToken, throwForbiddenError} = require("../../utils/helpers/genrateTokenAndSetCookie");
const { transformUser,transformUserWithToken,transformUsers } = require("../../utils/transform");
const bcrypt = require('bcryptjs')
const User = require('../../models/userModel')
const Post = require('../../models/postModel')
const Follow = require('../../models/followModel')
const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId;
const config = require('../../config')
const {
    QUERY_FOLLOWS,
    QUERY_FOLLOWS_COUNT,
    QUERY_SUGGESTED_USERS} = require('../aggregation/user')

const { getFollowUnfollowUpdate } = require('../helpers/user')
module.exports = {
    Query: {
      getFollows: async (_,args,{req, res}) => {
        const {skip, limit , following } = args
        //console.log( ' getFollows skip: ',skip, ' limit: ',limit , ' following: ',following)
        if(!req.user) {
          throwForbiddenError()
        }
        let aggregation 
        try{ 
          aggregation  = QUERY_FOLLOWS(req.user._id,skip,limit,following)
          //console.log(' aggregation: ',aggregation)
          const result = await User.aggregate(aggregation)

          //console.log('getFollows: result ', result)
          aggregation  = QUERY_FOLLOWS_COUNT(req.user._id,following)
          const resultCount =  await User.aggregate(aggregation)
          return  {
            follows: result,
            count : (resultCount[0] ) ? resultCount[0].count : 0
          }
         // return result
        } catch ( error ) {
          console.log(' getFollows error : ',error)
          throwServerError(error)
        }
      },
      getProfileByName: async (_,args,{req, res}) => {
        const {username} = args
        //console.log(' getUserProfileByName userName: ',username)
        try {
          const user = await User.findOne({username }).select('-password').select('-updatedAt').select('-jwtToken');
          //console.log('getUserProfileByName user: ',user)
          if(user) {
            return user
          } else {
            
            throwServerError('User not found')
          }
          
        } catch (error) {
          throwServerError(error)
        }

      },
      getUserProfile: async (_,args,{req, res}) => {
        const {postedBy} = args
       // console.log(' getUserProfile id: ',postedBy)
        try {
          const user = await User.findById(postedBy).select('-password').select('-updatedAt').select('-jwtToken');
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
          //console.log(' getSuggestedUsers: ')
            if(!req.user) {
                throwForbiddenError()
            }
            try {
                const userId = req.user._id;
                const aggregation = QUERY_SUGGESTED_USERS(userId,0,10)
                const result = await User.aggregate(aggregation)
                console.log(result)
                return result

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
        console.log('updateUser args ',args)
        let session
        if (config.DB_TYPE == "ATLAS") {
          session = await mongoose.startSession();
          await session.startTransaction();
        }
        try {

          let user = await User.findById(req.user._id).session(session);
          if (!user)
            throwServerError('User not found')
  
          if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
          }
          user.profilePic = profilePic || user.profilePic
          user.email = email || user.email;
          user = await user.save({ session });
          console.log(' saved user : ',user)
          await Post.updateMany(
            {
              'replies.userId': user._id,
            },
            {
              $set: {
                'replies.$[reply].userProfilePic': user.profilePic,
              },
            },
            { 
              arrayFilters: [{ 'reply.userId': user._id }],
              session: session
  
            }
          );
          if (config.DB_TYPE == "ATLAS") {
            await session.commitTransaction()
          }
          return transformUser(user)
        } catch (error) {
          console.log(error)
          if (config.DB_TYPE == "ATLAS") {
            await session.abortTransaction()
          }
          throwServerError(error)
        } finally {
          if (config.DB_TYPE == "ATLAS") {
            await session.endSession()
          }
        }


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
            //console.log( 'followUnFollow  followId: ',followId)
            if (followId == req.user._id.toString()) {
              throwServerError('You can not follow/un-follow yourself ');
            }
           // console.log('followUnFollow: id: ',followId)
            let session
            if (config.DB_TYPE == "ATLAS") {
              session = await mongoose.startSession();
              await session.startTransaction();
            }
            try {
                const follow_ = await User.findOne({
                  _id: req.user._id,
                  following: { "$elemMatch": { followId: followId}}
                }).session(session)
                const isFollowing = (follow_) ? true : false
              //  console.log(' isFollowing : ',isFollowing)
                const bulkOps = getFollowUnfollowUpdate(isFollowing, req.user._id,  new ObjectId(followId))
              //  console.log(' bulkOps : ',bulkOps)
                result = await User.bulkWrite(bulkOps,{session});
                const user_ = await User.findById(followId).session(session)
                if (config.DB_TYPE == "ATLAS") {
                  await session.commitTransaction()
                }
                return transformUser(user_)
                           
            } catch(error) {
              console.log(' isFollowing : ',error)
              if (config.DB_TYPE == "ATLAS") {
                await session.abortTransaction()
              }
              throwServerError(error)
            } finally {
              if (config.DB_TYPE == "ATLAS") {
                await session.endSession()
              }
            }
        }
    }
}