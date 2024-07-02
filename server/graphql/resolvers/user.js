const { throwServerError , generateToken, throwForbiddenError} = require("../../utils/helpers/genrateTokenAndSetCookie");
const { transformUser } = require("../../utils/transform");
const bcrypt = require('bcryptjs')
const User = require('../../models/userModel')
module.exports = {
    Query: {

    },
    Mutation: {
        signupUser : async (_,args,{req, res}) => {
            try {
                const { name, username, password, email } = args;
                const user = await User.findOne({ $or: [{ email }, { username }] });
                if (user) {
                  throwServerError('User already exits')
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const newUser = new User({
                  name,
                  email,
                  username,
                  password: hashedPassword,
                });
                const user_ = await newUser.save();
                if (user_) {
                    const token = generateToken(newUser._id, name , email);
                    return transformUser(user_,token)
                } else {
                    throwServerError('Invalid user data')
                }
              } catch (error) {
                console.log('Error at Signup: ', error.message);
                throwServerError(error)
              }

        },
        loginUser: async (_,args,{req, res}) => {
            const { username, password } = args;
            try {
                const user = await User.findOne({ username });
                const isPasswordsCorrect = await bcrypt.compare(password, user?.password || '');
                if (!user || !isPasswordsCorrect) {
                  throwForbiddenError()
                }
                if (user.isFrozen) {
                    user.isFrozen = false;
                    user.save();
                }                
                const token = generateToken(user._id, user.name , user.email);
                return transformUser(user,token)
            } catch(error) {
                throwServerError(error)
            }
        },

        freezeAccount: async (_,args,{req, res}) => {
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
            const { id } = args
            try {
                const userToModify = await User.findById(id);
                const currentUser = await User.findById(req.user._id);
                if (id == req.user._id.toString()) {
                    throwServerError('You can not follow/un-follow yourself ');
                }
                if (!userToModify || !currentUser) {
                    throwServerError(' User not found' );
                }   
                const isFollowing = currentUser.following.includes(id);

                if (isFollowing) {
                  // Un-Following
                  await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
                  await User.findByIdAndUpdate(req.user._id, {
                    $pull: { following: id },
                  });
                  return true
                } else {
                  // Following
                  await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
                  await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
                  return true
                }                             
            } catch(error) {
                throwServerError(error)
            }
        }
    }
}