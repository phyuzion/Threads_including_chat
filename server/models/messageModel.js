const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.pluralize(null);

const messageSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
    },
    text: {
      type: String,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    img: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const threadModule = (module.exports = mongoose.model('Message', messageSchema))
threadModule.messageSchema = messageSchema

// const Message = mongoose.model('Message', messageSchema);
// export default Message;
