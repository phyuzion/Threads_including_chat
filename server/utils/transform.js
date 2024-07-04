const User = require('../models/userModel')

const tranformUser = (user,token) => {
    return {
        ...user._doc,
        _id: user._id,
        password: null,
        jwtToken: token
    }
}

const tranformPost = (post) => {
    return {
        ...post._doc,
        _id: post._id,
    }
}

exports.tranformUser = tranformUser
exports.tranformPost = tranformPost