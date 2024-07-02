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

            }
        }
    }
}