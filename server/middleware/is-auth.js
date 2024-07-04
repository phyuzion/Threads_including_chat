const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const config = require('../config')
const authenticateUser = async (req,authHeader_) => {
    if(authHeader_) {
      authHeader = authHeader_.trim().split(/[\s,\t,\n]+/).join(' ');
      if(authHeader) {
        const token= authHeader.split(' ')[1]
        //console.log(token)
        if(token) { 
          try {
            const decodedToken = await jwt.verify(token, `${config.SECRET_KEY}` )
            console.log('decodedToken: ',decodedToken)
            if(decodedToken) {
                const user = await User.findById(decodedToken.userId).select('-password');
                req.user = user;
            }
          } catch (err) {
            console.log('ath error: ',err)
          }
          return null
        }
      } 
    }
    return null
  }
const  isAuthenticated = async (req, res, next) => {
    req.user = null
    const authHeader_ = req.get('Authorization')
    console.log('isAuthenticated authHeader_: ',authHeader_)
    return await authenticateUser(req,authHeader_)
}
exports.isAuthenticated = isAuthenticated