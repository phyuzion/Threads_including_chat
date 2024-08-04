const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {followSchema} = require('./followModel')
mongoose.pluralize(null);

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLenght: 6,
    },
    profilePic: {
      type: String,
      default: '',
    },
    followers: [followSchema],
    following: [ followSchema],
    bio: {
      type: String,
      default: '',
    },
    isFrozen: {
      type: Boolean,
      default: false,
    },
    jwtToken: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);


const threadModule = (module.exports = mongoose.model('User', userSchema))
threadModule.userSchema = userSchema
// const User = mongoose.model('User', userSchema);
// export default User;
