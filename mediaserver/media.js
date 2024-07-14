
const config = require('./config.js')
const http = require('http');
const express = require('express');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = "/media";
const { authenticate } = require('./middleware/is-auth.js')
const mongoose = require('mongoose')
// const fileUpload = require('express-fileupload');
async function startServers() {

  const app = express();
  app.use(cors());
  // app.use((req, res, next) => {
  //   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/')
  //   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  //   res.setHeader('Access-Control-Allow-Headers', 'Accept-Encoding, Content-Length, X-Requested-With,Authorization,Origin, Content-Type, X-Auth-Token, X-VERIFY')
  //   res.setHeader('Access-Control-Allow-Credentials', 'true')
    
  //   if (req.method === 'OPTIONS') {
  //     return res.sendStatus(200)
  //   }
  //   next()
  // })
  const httpServer = http.createServer(app)
  app.use(cookieParser());

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: false }));
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

