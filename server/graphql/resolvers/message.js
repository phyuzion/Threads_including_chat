const { throwServerError, throwForbiddenError } = require("../../utils/helpers/genrateTokenAndSetCookie")
const Conversation = require('../../models/conversationModel')
const Message = require('../../models/messageModel')
const { emitSendMessage,startApolloServer } = require('../../socket/socket');

console.log('startApolloServer:', startApolloServer);
console.log('Type of emitSendMessage:', typeof emitSendMessage);
module.exports = {
    Query: {
        getMessages: async (_,args,{req, res}) => { 
            const { otherUserId } = args
            if(!req.user) {
                throwForbiddenError()
            } 
            const userId = req.user._id;
            try {
                const conversation = await Conversation.findOne({
                    participants: { $all: [userId, otherUserId] },
                  });
                if (!conversation) {
                    throwServerError('Conversation not found')
                }
                console.log(' getMessages conv id :',conversation._id)
                const messages = await Message.find({
                    conversationId: conversation._id,
                });
                return messages
            } catch (error) {
                throwServerError(error)
            }
        },
        getConversations: async (_,args,{req, res}) => { 
            if(!req.user) {
                throwForbiddenError()
            } 
            const userId = req.user._id;
            try {
                const conversations = await Conversation.find({
                    participants: userId,
                  })
                    .populate({
                      path: 'participants',
                      select: 'username profilePic',
                    })
                    .sort({
                      createdAt: -1,
                    });
                conversations.forEach((conv) => {
                    conv.participants = conv.participants.filter(
                        (participant) => participant._id.toString() !== userId.toString()
                    );
                    });
                return conversations
            } catch(error){
                throwServerError(error) 
            }



        },
    },
    Mutation:{
        sendMessage: async (_,args,{req, res}) => {
            const { receiverId, text , img } = args
            console.log('sendMessage args: ',args)
            if(!req.user) {
                throwForbiddenError()
            } 
            const senderId = req.user._id;
            console.log(' sendMessage receiverId: ',receiverId, ' text: ',text)
            try {
                let conversation = await Conversation.findOne({
                    participants: { $all: [senderId, receiverId] },
                  });  
                if (!conversation) {
                    conversation = await Conversation.create({
                        participants: [senderId, receiverId],
                        lastMessage: {
                        text,
                        sender: senderId,
                        },
                    });
                } else {
                    conversation.lastMessage = {
                        text,
                        sender: senderId,
                    };
                    conversation.save();
                }   
                console.log(' sendMessage conv id :',conversation._id)
                const message = await Message.create({
                    sender: senderId,
                    conversationId: conversation._id,
                    text,
                    img: img || '',
                });    
                //const userSocketId = getUserSocketIds(receiverId);
                emitSendMessage(receiverId, message)
                // const [ io , userSocketId ] = await getIOAndSocketId(receiverId)
                // io.to(userSocketId).emit('newMessage', message);
                console.log(' sendMessage: ',message)
                return message
            } catch (error) {
                console.log(error)
                throwServerError(error) 
            }


        },
    }
}