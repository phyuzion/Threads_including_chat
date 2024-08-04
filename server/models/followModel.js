const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.pluralize(null);

const followSchema = new Schema(
  {
    followId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    startDate: {
        type: Date
    }
  },
  {
    timestamps: true,
  }
);


const threadModule = (module.exports = mongoose.model('Follow', followSchema))
threadModule.followSchema = followSchema

