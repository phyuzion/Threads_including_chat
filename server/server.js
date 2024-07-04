
const config = require('./config.js')
const express = require('express')
const { connectDB_ } = require('../server/db/connectDB')
const cookieParser = require('cookie-parser')
const { startApolloServer } = require('./socket/socket')
require('dotenv').config()
const cors = require('cors');

async function startServers() {
  await connectDB_();
  const {io, server, app, httpServer  } =  await startApolloServer()
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors())
  app.use(express.static('public'))
  server.applyMiddleware({ app, path: "/graphql", })
  await new Promise(resolve => httpServer.listen(config.PORT, resolve))
  console.log(
    `🚀 Server ready at http://${config.HOST}:${config.PORT}${server.graphqlPath}`
  )
}
startServers()

