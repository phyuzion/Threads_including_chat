const User = require('../models/userModel')

const tranformUser = (user,token) => {
    return {
        ...user._doc,
        _id: user._id,
        password: null,
        jwtToken: token
    }
}

exports.tranformUser = tranformUser