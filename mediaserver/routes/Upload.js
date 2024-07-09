
require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/userModel')
const multer  = require('multer');
const { generateHash} = require('../utils/transform')
const path = require('path')
const aws = require('aws-sdk');
const config = require('../config')
const multerS3 = require('multer-s3');
const short = require('short-uuid');

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint('blr1.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: config.SPACES_KEY,
  secretAccessKey: config.SPACES_SECRET,
});

const generateFileNameWithFolder = (req,filename) => {
        const uuid = short.generate(); //v4();
        const ext = path.extname(filename);
        const userNameHash = generateHash(req.user.username)
        console.log(' userNameHash: ',userNameHash)
        return `${userNameHash}/${uuid}${ext}`;
}

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: config.SPACES_BUCKET,
      acl: 'public-read',
      key: function (request, file, cb) {
        console.log('File:', file)
        const fileName = generateFileNameWithFolder(request,file.originalname)
        request.fileName = fileName
        cb(null, request.fileName);
      }
    })
  }).array('file', 1);

router.post("/",async (req, res , next) => { 
    upload(req, res, function (error) {
        if (error) {
          console.log(error);
          return res.status(400);
        }
        console.log('File uploaded successfully.');
        const media_url = `${config.SPACES_CDN}/${req.fileName}`
        res.json({ url: media_url });
      });
});

  


module.exports = router;