const { throwServerError, throwForbiddenError, checkAdmin } = require("../../utils/helpers/genrateTokenAndSetCookie")
const { transformPost,transformPosts } = require('../../utils/transform')
const mongoose = require('mongoose')
const Post = require('../../models/postModel')
const User = require('../../models/userModel')
const { updateHashTags, getHashtagPosts } = require('../helpers/hashtags')
const { QUERY_USER_FOLLOWING_FEEDS } = require('../aggregation/user')
const { QUERY_RANDOM_POST_IMAGE } = require('../aggregation/post')
const config = require('../../config')
module.exports = {
    Query: {

        getRandomPostedImage: async (_,args,{req, res}) => { 
          try {
            const aggregation = QUERY_RANDOM_POST_IMAGE( )
            console.log(('getRandomPostedImage  aggregation: ',JSON.stringify(aggregation,null,2)))
            const results = await Post.aggregate(aggregation)
            console.log('getRandomPostedImage  results: ',results)
            return (results && results.length > 0) ? results[0].img : ""
          } catch (error) {
            console.log('getRandomPostedImage error: ',error)
            throwServerError(error)
          }
        },
        getLatestPosts: async (_,args,{req, res}) => {
          const { skip,limit } = args
          console.log(' getLatestPost : ',args)
          result =  await Post.find({}).sort({
            createdAt: -1,
          }).skip(skip)
          .limit(limit)
              console.log(result)
          return result

        },
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
            checkUser(req)
            const { username , skip , limit } = args;
            try {
                const user = await User.findOne({ username });
            
                if (!user) throwServerError('User not found' );
            
                const posts = await Post.find({ postedBy: user._id }).sort({
                  createdAt: -1,
                }).skip(skip)
                .limit(limit)

                if (!posts) throwServerError('No posts not found' );
                return transformPosts(posts)
              } catch (error) {
                console.log('getUserPost error: ',error)
                throwServerError(error)
              }

        },
        getFeedPosts: async (_,args,{req, res}) => {
            //console.log(' getFeedPosts: ')
            const { skip , limit } = args
            checkUser(req)
            try {
                const aggregation = QUERY_USER_FOLLOWING_FEEDS(req.user._id,skip , limit )
                const results = await User.aggregate(aggregation)
                //console.log('get feed posts : ', results)
                
                return results[0].Posts
              } catch (error) {
                console.log('getFeedPosts error: ',error)
                throwServerError(error)
              }
        },
        getAllPosts: async (_,args,{req, res}) => {
          const { skip , limit } = args
          //checkAdmin(req)

          try {
            const count = await Post.countDocuments({})
            const posts =  await Post.find({}).limit(limit)
                            .skip(skip)
                            .sort({createdAt: -1})
            return {
              posts: posts,
              count: count
            }

          } catch(error) {
            throwServerError(error)
          }

        }

    },
    Mutation: {
      updateStarCount: async (_,args,{req, res}) => { 
        checkUser(req)
        const { postId } = args

        const post = await Post.findOneAndUpdate(
          {_id: postId},
          {
            $inc: { star : 1}
          },
          {
            returnOriginal: false
          }
        )
        if(post) {
          return post.star
        } else {
          return 0
        }
      },
        createPost: async (_,args,{req, res}) => {

          checkUser(req)

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
        deletePostByAdmin: async (_,args,{req, res}) => {
          const { postId } = args
          checkAdmin(req)
          try {
            const post = await Post.findById(postId);
            if (!post) {
              return throwServerError('Post not found')
            }
            await Post.findByIdAndDelete(postId);
            return true

          } catch (error) {
            throwServerError(error)
            //console.log('Error at deleting post: ', error.message);
          }

        },
        deletePost: async (_,args,{req, res}) => {
            const { postId } = args
            checkUser(req)
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
            checkUser(req)
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
          checkUser(req)
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