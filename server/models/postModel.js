const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.pluralize(null);

const postSchema = new Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      maxLength: 500,
    },
    hashtags: {
      type: [String],
    },
    img: {
      type: String,
    },
    video: {
      type: String,
    },
    likes: {
      // array of user ids
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    replies: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        userProfilePic: {
          type: String,
        },
        username: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const threadModule = (module.exports = mongoose.model('Post', postSchema))
threadModule.postSchema = postSchema

// const Post = mongoose.model('Post', postSchema);
// export default Post;
