const { ApolloServer } = require('apollo-server-express')
const typeDefs = require('../graphql/schema/index')
const resolvers = require('../graphql/resolvers/index')
const graphql = require('graphql')
const config = require('../config')
const graphqlTools = require('@graphql-tools/schema')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const path = require('path')
const express = require('express')
const { Server } = require('socket.io')
const http = require('http');
const Message = require('../models/messageModel')
const Conversation = require('../models/conversationModel')
const app = express();
const cors = require('cors');

async function startIOServer(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
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


const userSocketMap = {};


async function startApolloServer() {

  const app = express() 
  const httpServer = http.createServer(app)
  const schema = graphqlTools.makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  // const serverCleanup = useServer({
  //   schema ,
  //   context: (ctx, msg, args) => {
  //     console.log(' ctx , msg : ', msg)
  //      return getDynamicContext(ctx, msg, args);
  //   },    
  //   onConnect: async (ctx) => {
  //     console.log(' Ws Connected ctx : ', ctx)
  //   },
  //   onDisconnect(ctx, code, reason) {
  //     //console.log('Disconnected! : ', code, ' reason: ',reason);
  //   },
  // }
// );



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
      // const result = await isAuthenticated(req)
      // setCurrentUserType(req,result)
      return { req, res }
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
          async serverWillStart() {
            console.log(' serverWillStart ')
              return {
                  async drainServer() {
                      await serverCleanup.dispose();
                  },
              }
          }
      },
     
    ],

  })

  await server.start()
  const io = await startIOServer(httpServer)
  return { io, server, app, httpServer }
}

const getUserSocketId = (userId) => userSocketMap[userId];
module.exports = {
  startApolloServer,
  getUserSocketId
}

//export { io, app, server };
