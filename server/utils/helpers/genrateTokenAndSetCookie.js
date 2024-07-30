const jwt = require('jsonwebtoken')
const { GraphQLError } = require('graphql')
const config = require('../../config')
const throwForbiddenError = () => {
  throw new GraphQLError('You are not authorized to perform this action.', {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
}
const throwServerError = (errorMessage) => {
  console.log('throwServerError errorMessage: ',errorMessage)
  throw new GraphQLError(errorMessage, {
      extensions: {
        code: 'SERVER_ERROR',
      },
    });
}
const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15d',
  });

  res.cookie('jwt', token, {
    httpOnly: true, // more secure
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    sameSite: 'strict', // CSRF
  });

  return token;
};

const generateToken = (userId,  email) => {
  const token = jwt.sign(
    { 
      userId : userId,
      email: email
    },
    `${config.SECRET_KEY}`, {
    expiresIn: '15d',
  });

  return token;
};

exports.generateToken = generateToken
exports.throwServerError = throwServerError
exports.throwForbiddenError = throwForbiddenError
