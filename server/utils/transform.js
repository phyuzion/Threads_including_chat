const User = require('../models/userModel')


const dateToString = date => {

    return  date ? new Date(date).toISOString() : new Date().toISOString()
}
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
        createdAt: dateToString(post._doc.createdAt),
    }
}

const transformPosts =  posts => {
    return posts.map(transformPost)
}

exports.transformUser = transformUser
exports.transformPost = transformPost
exports.transformPosts = transformPosts
exports.transformUserWithToken = transformUserWithToken
exports.transformUsers = transformUserWithToken