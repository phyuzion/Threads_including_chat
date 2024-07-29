const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.pluralize(null);


const hashTagSchema = new Schema(
  {
    hashtag: {
      type: String,
      required: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      required: true,
    },

  },
  {
    timestamps: true,
  }
);


const threadModule = (module.exports = mongoose.model('Hashtag', hashTagSchema))
threadModule.hashTagSchema = hashTagSchema

