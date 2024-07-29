

const { SKIP_STAGE, LIMIT_STAGE, LOOKUP_STAGE, UNWIND_STAGE, SORT_CREATED_AT_DESC } = require('./common');



const PROJECT_HASHTAG_POST = {
    $project:
    {
      _id: "$post._id",
      postedBy: "$post.postedBy",
      text: "$post.text",
      hashtags: "$post.hashtags",
      img: "$post.img",
      video: "$post.video", 
      likes: "$post.likes",
      replies: "$post.replies",
      createdAt: {
        $dateToString: {
            date: '$createdAt',
            timezone: '+09:00',
        }
      } 
    },
  }

const MATCH_HASHTAG = (hashtag) => {
    return {
        $match:
        {
            hashtag: hashtag,
        },
    }
}
const QUERY_POSTS_BY_HASHTAG = (hashtag,skip,limit) => {

    return [
        MATCH_HASHTAG(hashtag),
        SORT_CREATED_AT_DESC,
        SKIP_STAGE(skip),
        LIMIT_STAGE(limit),    
        LOOKUP_STAGE("Post","postId","_id","post"),    
        UNWIND_STAGE("post"),
        PROJECT_HASHTAG_POST

    ]
}


exports.QUERY_POSTS_BY_HASHTAG = QUERY_POSTS_BY_HASHTAG