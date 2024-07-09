const jwt = require('jsonwebtoken')
const config = require('../../config')

const generateToken = (userId, name , email) => {
  const token = jwt.sign(
    { 
      userId : userId,
      name: name,
      email: email
    },
    `${config.SECRET_KEY}`, {
    expiresIn: '15d',
  });

  return token;
};

exports.generateToken = generateToken

