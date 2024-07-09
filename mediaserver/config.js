const dotenv = require('dotenv')
const path = require('path')
dotenv.config({
  path: path.join(__dirname, `.env.${process.env.NODE_ENV}`)
})
module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  SERVER_URL: process.env.SERVER_URL,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  CONNECTION_STRING: process.env.CONNECTION_STRING,
  DEBUG_DB: process.env.DEBUG_DB,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  SECRET_KEY: "Thread clone secret Key 213213231",
  SPACES_ENDPOINT: process.env.SPACES_ENDPOINT,
  SPACES_KEY: process.env.SPACES_KEY,
  SPACES_SECRET: process.env.SPACES_SECRET,
  SPACES_BUCKET: process.env.SPACES_BUCKET,
  SPACES_CDN: process.env.SPACES_CDN
  
}