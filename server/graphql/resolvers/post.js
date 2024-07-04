const { throwServerError, throwForbiddenError } = require("../../utils/helpers/genrateTokenAndSetCookie")
const { tranformPost } = require('../../utils/transform')


module.exports = {
    Query: {
        getPost: async (_,args,{req, res}) => {


        },

        getUserPosts: async (_,args,{req, res}) => {


        },
        getFeedPosts: async (_,args,{req, res}) => {


        },

    },
    Mutation: {
        createPost: async (_,args,{req, res}) => {

            if(!req.user) {
                throwForbiddenError()
            }

            const { text, imgUrl , videoUrl } = args
            const userId = req.user._id.toString()
            try {
                if (!text) {
                    throwServerError('text field is required')
                }
                const maxTextLength = 500;
                if (text > maxTextLength) {
                    throwServerError('Text must have maximum 500 letters')
                }
                const newPost = new Post({
                    userId,
                    text,
                    img: imgUrl,
                    video: videoUrl
                  });
                const post_ =   await newPost.save();     
                return tranformPost(post_)           
            
            } catch(error) {
                throwServerError(error)
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

        } ,

        replyToPost: async (_,args,{req, res}) => {


        }
    }
}