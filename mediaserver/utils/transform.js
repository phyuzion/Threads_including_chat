const User = require('../models/userModel')
//const sha256 = require('sha256');
const sha1 = require('sha1');

const transformUserWithToken = (user) => {
    return {
        ...user._doc,
        _id: user._id,
        password: null,
    }
}

const transformUser = (user) => {
    return {
        ...user._doc,
        _id: user._id,
        password: null,
        jwtToken: null
    }
}
const transformUsers =  users => {
    return users.map(transformUser)
}
const transformPost = (post) => {
    return {
        ...post._doc,
        _id: post._id,
    }
}

const transformPosts =  posts => {
    return posts.map(transformPost)
}

const generateHash = (userName) => {
    return sha1(userName)
}

exports.transformUser = transformUser
exports.transformPost = transformPost
exports.transformPosts = transformPosts
exports.transformUserWithToken = transformUserWithToken
exports.transformUsers = transformUserWithToken

exports.generateHash = generateHash