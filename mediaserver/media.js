
const config = require('./config.js')
const http = require('http');
const { connectDB_ } = require('../server/db/connectDB.js')
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = "/media";
const { authenticate } = require('./middleware/is-auth.js')
const mongoose = require('mongoose')
// const fileUpload = require('express-fileupload');
async function startServers() {
  //await connectDB_();

  app.use(cors({
    credentials: true,
    origin: `http://${config.HOST}:${config.PORT}`
  }));
  const httpServer = http.createServer(app)
  app.use(cookieParser());
  app.use(express.json());
  app.set('trust proxy', true);
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors())
  // app.use(fileUpload()); 
  app.use(express.static('public'))
  const mediaUploadRouter = require("./routes/Upload.js");
  app.use(path+"/upload",authenticate, mediaUploadRouter);
  const conn = await mongoose.connect(config.CONNECTION_STRING, {
    // authSource: config.AUTH_SOURCE,
    // user: config.DB_USER,
    // pass: config.DB_PASS,    
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  mongoose.pluralize(null);

  mongoose.set('debug', true);
  await new Promise(resolve => httpServer.listen(config.PORT, resolve))
  console.log(
    `🚀 Media Server ready at http://${config.HOST}:${config.PORT}`
  )
}
startServers()

