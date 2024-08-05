const { throwServerError, throwForbiddenError } = require("../../utils/helpers/genrateTokenAndSetCookie")
const { transformPost,transformPosts } = require('../../utils/transform')
const mongoose = require('mongoose')
const Post = require('../../models/postModel')
const User = require('../../models/userModel')
const { updateHashTags, getHashtagPosts } = require('../helpers/hashtags')
const config = require('../../config')
module.exports = {
    Query: {
        getPostsByHashTag: async (_,args,{req, res}) => {
          const { hashtag,skip,limit } = args
          if(!req.user) {
            throwForbiddenError()
          }     
          try {
              return await getHashtagPosts(hashtag,skip,limit)
          } catch (error) {
                throwServerError(error)
          }    
        },
        getPost: async (_,args,{req, res}) => {
            const { postId } = args
            if(!req.user) {
                throwForbiddenError()
            }
            try {
                const post = await Post.findById(postId);
                if (!post) throwServerError('Post not found');
                return transformPost(post)
            } catch (error) {
                throwServerError(error)
            }

        },

        getUserPosts: async (_,args,{req, res}) => {
            if(!req.user) {
                throwForbiddenError()
            }
            const { username } = args;
            try {
                const user = await User.findOne({ username });
            
                if (!user) throwServerError('User not found' );
            
                const posts = await Post.find({ postedBy: user.id }).sort({
                  createdAt: -1,
                });
                if (!posts) throwServerError('No posts not found' );
                return transformPosts(posts)
              } catch (error) {
                console.log('getUserPost error: ',error)
                throwServerError(error)
              }

        },
        getFeedPosts: async (_,args,{req, res}) => {
            //console.log(' getFeedPosts: ')
            if(!req.user) {
                throwForbiddenError()
            }
            try {
                const userId = req.user._id;
                const user = await User.findById(userId);
                if (!user) throwServerError('User not found' );
            
                const userFollowing = user.following;
                userFollowing.push(userId.toString());
            
                const feedPosts = await Post.find({
                  postedBy: { $in: userFollowing },
                }).sort({
                  createdAt: -1,
                });
                //console.log(' getFeedPosts feedPosts: ',feedPosts)
                const posts_ =  transformPosts(feedPosts)
                //console.log(' getFeedPosts posts_: ',posts_)
                return posts_
              } catch (error) {
                console.log('getFeedPosts error: ',error)
                throwServerError(error)
              }
        },

    },
    Mutation: {
        createPost: async (_,args,{req, res}) => {

            if(!req.user) {
                throwForbiddenError()
            }

            const { text, imgUrl , videoUrl, hashtags } = args
            const userId = req.user._id.toString()
            let session
            if (config.DB_TYPE == "ATLAS") {
              session = await mongoose.startSession();
              await session.startTransaction();
            }

            try {
                if (!text) {
                    throwServerError('text field is required')
                }
                const maxTextLength = 500;
                if (text > maxTextLength) {
                    throwServerError('Text must have maximum 500 letters')
                }
                const newPost = new Post({
                    postedBy: userId,
                    text,
                    img: imgUrl,
                    video: videoUrl,
                    hashtags: hashtags
                  });
                const post_ =   await newPost.save();     

                
                
                const result = await updateHashTags(hashtags,post_._id,post_.postedBy,session)
                //console.log(' hastags inserted: ',result)
                if (config.DB_TYPE == "ATLAS") {
                  await session.commitTransaction()
                }
                
                return transformPost(post_)           
            
            } catch(error) {
              if (config.DB_TYPE == "ATLAS") {
                await session.abortTransaction();
               }
                throwServerError(error)
            } finally {
              if (config.DB_TYPE == "ATLAS") {
                await session.endSession()
              }
              
            }

        },

        deletePost: async (_,args,{req, res}) => {
            const { postId } = args
            if(!req.user) {
                throwForbiddenError()
            }
            try {
                const post = await Post.findById(postId);
                if (!post) {
                    return throwServerError('Post not found')
                }
            
                if (post.postedBy.toString() !== req.user._id.toString())
                  return throwForbiddenError()
            
                if (post.img) {
                  // TBD
                  // delete from Digital Ocean SpaceCloud
                }
                if (post.video) {
                    // TBD
                    // delete from Digital Ocean SpaceCloud
                }
            
                await Post.findByIdAndDelete(postId);
                return true
              } catch (error) {
                throwServerError(error)
                //console.log('Error at deleting post: ', error.message);
              }
        } ,

        likeUnLikePost: async (_,args,{req, res}) => {
            const {postId} = args
            console.log('likeUnLikePost postId: ',postId)
            if(!req.user) {
                throwForbiddenError()
            }
            try{
                const post = await Post.findById(postId);
                //console.log('likeUnLikePost post: ',post)
                if(!post) {
                    throwServerError('Post not found')
                }
                const isUserLikedPost = post.likes.includes(req.user._id);
                let post_
                if (isUserLikedPost) {
                    // Un-Like
                    s  = await Post.findOneAndUpdate(
                      { _id: postId },
                      {
                        $pull: { likes: req.user._id },
                      },
                      {
                        returnOriginal: false
                      }
                    );
              

                  } else {
                    // Like
                    s = await Post.findOneAndUpdate(
                        { _id: postId },
                        {
                          $push: { likes: req.user._id },
                        },
                        {
                          returnOriginal: false
                        }
                      );
                    
                } 
                //console.log('liked Post : ',s)
                return true;
            } catch( error) {
                throwServerError(error)
            }
        } ,

        replyToPost: async (_,args,{req, res}) => {
            //console.log(' replyToPost : ', args)
            const { text, postId } = args;
            if(!req.user) {
                throwForbiddenError()
            }
            const userId = req.user._id;
            const userProfilePic = req.user.profilePic;
            const username = req.user.username;
          
            if (!text) throwServerError('Text required');
            try{
                const post = await Post.findById(postId);
                if (!post) throwServerError('Post not found ');
                const reply = { userId, text, userProfilePic, username };
                post.replies.push(reply);
                await post.save();
                //console.log(' reply : ',reply)
                return reply
            } catch( error) {
                throwServerError(error)
            }
        }
    }
}