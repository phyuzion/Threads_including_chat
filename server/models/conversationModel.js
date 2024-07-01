const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.pluralize(null);

const conversationSchema = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    lastMessage: {
      text: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      seen: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);
const threadModule = (module.exports = mongoose.model('Conversation', conversationSchema))
threadModule.conversationSchema = conversationSchema


// const Conversation = mongoose.model('Conversation', conversationSchema);
// export default Conversation;
