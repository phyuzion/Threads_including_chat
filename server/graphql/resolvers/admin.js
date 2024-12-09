const User = require('../../models/userModel');
const Post = require('../../models/postModel');
const { throwServerError } = require('../../utils/helpers/genrateTokenAndSetCookie');
const isAdmin = require('../../middleware/is-admin');
const logAdminAction = require('../../utils/logger');

// getAlluser
const getAllUsers = async (_, __, { req }) => {
  isAdmin(req);
  try {
    const users = await User.find().select('-password -jwtToken');
    return users;
  } catch (error) {
    throwServerError(error);
  }
};

// get All Posts
const getAllPosts = async (_, __, { req }) => {
  isAdmin(req);
  try {
    const posts = await Post.find();
    return posts;
  } catch (error) {
    throwServerError(error);
  }
};

// delete user
const deleteUser = async (_, { userId }, { req }) => {
  isAdmin(req);
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throwServerError('User not found');
    logAdminAction('DELETE_USER', { admin: req.user.username, userId });
    return true;
  } catch (error) {
    throwServerError(error);
  }
};

// delete post
const deletePost = async (_, { postId }, { req }) => {
  isAdmin(req);
  try {
    const post = await Post.findByIdAndDelete(postId);
    if (!post) throwServerError('Post not found');
    logAdminAction('DELETE_POST', { admin: req.user.username, postId });
    return true;
  } catch (error) {
    throwServerError(error);
  }
};



module.exports = {
  Query: {
    getAllUsers,
    getAllPosts,
  },
  Mutation: {
    deleteUser,
    deletePost,
  },
};
