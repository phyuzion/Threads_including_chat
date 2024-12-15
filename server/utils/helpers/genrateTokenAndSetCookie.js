const jwt = require('jsonwebtoken')
const { GraphQLError } = require('graphql')
const config = require('../../config')
const { USER_TYPES } = require('../../helpers/enum')
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

const generateToken = (userId,  email, userType) => {
  const token = jwt.sign(
    { 
      userId : userId,
      email: email,
      type: userType
    },
    `${config.SECRET_KEY}`, {
    expiresIn: '15d',
  });

  return token;
};

const checkSuperAdmin =  (req) => {
  console.log('checkSuperAdmin')
  if (!req.user || req.user.type > USER_TYPES.SUPER_ADMIN ) {
      throwForbiddenError()
  }
  return true
}

const checkAdmin =  (req) => {
  console.log('checkAdmin')
  if (!req.user || req.user.type > USER_TYPES.ADMIN ) {
      throwForbiddenError()
  }
  return true
}

const checkUser =  (req) => {
  console.log('checkSuperAdmin')
  if (!req.user || req.user.type != USER_TYPES.USER ) {
      throwForbiddenError()
  }
  return true
}

exports.checkUser = checkUser
exports.checkAdmin = checkAdmin
exports.checkSuperAdmin = checkSuperAdmin
exports.generateToken = generateToken
exports.throwServerError = throwServerError
exports.throwForbiddenError = throwForbiddenError
