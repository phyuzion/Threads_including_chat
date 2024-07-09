const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const config = require('../config');
const { throwForbiddenError } = require('../../server/utils/helpers/genrateTokenAndSetCookie');
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
const  authenticate = async (req, res, next) => {
    req.user = null
    const authHeader_ = req.get('Authorization')
    console.log('isAuthenticated authHeader_: ',authHeader_)
    await authenticateUser(req,authHeader_)
    if(req.user) {
      next()
    } else {
      return res.sendStatus(403);
    }
}
exports.authenticate = authenticate