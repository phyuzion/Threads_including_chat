const { ApolloServer } = require('apollo-server-express')
// const typeDefs = require('../graphql/schema/index')
// const resolvers = require('../graphql/resolvers/index')
const config = require('../config')
// const graphqlTools = require('@graphql-tools/schema')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const express = require('express')
const { Server } = require('socket.io')
const http = require('http');
const Message = require('../models/messageModel')
const Conversation = require('../models/conversationModel')
const { isAuthenticated } = require('../middleware/is-auth')

let io
const userSocketMap = {};

async function startIOServer(server) {
  console.log(' origin : ', `${config.CORS_ORIGIN}`)
  const io = new Server(server, {
    cors: {
      origin: `${config.CORS_ORIGIN}`,
      methods: ['GET', 'POST'],
    },
  });
  io.on('connection', (socket) => {
    console.log('user connected', socket.id);
    const userId = socket.handshake.query.userId;
  
    if (userId) userSocketMap[userId] = socket.id;
    io.emit('getOnlineUsers', Object.keys(userSocketMap)); // sending event to everyone to get online users
  
    socket.on('markMessagesAsSeen', async ({ conversationId, userId }) => {
      try {
        console.log(' markMessagesAsSeen conversationId: ',conversationId)
        await Message.updateMany({ conversationId: conversationId, seen: false }, { $set: { seen: true } });
        await Conversation.updateOne({ _id: conversationId }, { $set: { 'lastMessage.seen': true } });
  
        socket.to(userSocketMap[userId]).emit('messagesSeen', { conversationId });
      } catch (error) {
        console.log(error);
      }
    });
  
    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
      delete userSocketMap[userId];
      io.emit('getOnlineUsers', Object.keys(userSocketMap)); // sending event to everyone to get online users
    });
  });  
  return io
}

async function startApolloServer(schema) {
  const app = express() 
  const httpServer = http.createServer(app)
  io = await startIOServer(httpServer)
  // const schema = graphqlTools.makeExecutableSchema({
  //   typeDefs,
  //   resolvers,
  // });
  const server = new ApolloServer({
    schema,
    introspection: true,
    playground: true,
    context: async ({ req, res }) => {
      //console.log(req)
      if (!req)  {
        console.log("No req........")
        return
      }
      await isAuthenticated(req)

      return { req, res }
    },
     plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()

  return { io, server, app, httpServer }
}


function emitSendMessage(userId, message) {
  const socketId = userSocketMap[userId];
  if (socketId) {
    io.to(socketId).emit('newMessage', message);
  } else {
    console.error(`No socket found for userId: ${userId}`);
  }
}

module.exports = {
  emitSendMessage,
  startApolloServer

};
