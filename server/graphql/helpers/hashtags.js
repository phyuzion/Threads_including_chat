const  Hashtag  = require('../../models/hashTagModel')
const {QUERY_POSTS_BY_HASHTAG } = require('../aggregation/hashtags')

function getUnique(hashtags) {
    return [...new Set(hashtags)];
  }
  
 function extract(string, options = {}) {
    console.log(' string: ',string)
    const { symbol = true, unique = true, caseSensitive = true } = options;
    let hashtags = [];
  
    if (!string || typeof string !== "string") {
      throw new Error("Invalid string");
    }
  
    !caseSensitive && (string = string.toLowerCase());
  
    if (symbol) {
      hashtags = string.match(/(?<=[\s>]|^)[#|＃](\w*[a-zA-Z0-9]+\w*)/gi) || [];
    } else {
      hashtags = string.match(/(?<=[#|＃])[\w]+/gi) || [];
    }
  
    return unique ? getUnique(hashtags) : hashtags;
  }  
const updateHashTags = async(hashtags,postId,postedBy,session) => { 

    //const hastags = extract(text)
    //console.log('tashtags: ',hashtags)
    if(!hashtags || hashtags.length < 1)
        return

    const tags  = await Hashtag.find({ hashtag: {$in : hashtags} , createdBy: { $ne : null}}).session(session)
    console.log(' tags already present : ',tags)
    let toInsert = []
    if(tags && tags.length > 0){

        const bulkOps = tags.map(tag => {
            return {
                hashtag: tag,
                postId: postId,
                postedBy:postedBy,
            }
        })
        const toBeInserted  = hashtags.filter(function(hashtag) {
            return tags.some(function(tag) {
                return !(hashtag == tag);
            });
        });
        console.log(' tags to be inserted  : ',toBeInserted)
        const bulkInserts = toBeInserted.map(tag => {
            return {
                hashtag: tag,
                postId: postId,
                postedBy:postedBy,
                createdBy: postedBy
            }
        })
        toInsert = [...bulkOps,...bulkInserts]
    } else {
        const bulkOps = hashtags.map(tag => {
            return {
                hashtag: tag,
                postId: postId,
                postedBy:postedBy,
                createdBy: postedBy
            }
        })
        toInsert = [...bulkOps]
    }
    console.log(' toInsert hashtags: ', toInsert)
    if(toInsert.length > 0) {
        return await Hashtag.insertMany(toInsert,{session:session})
    }
    return null


}

const getHashtagPosts = async(hashtag,skip,limit) => { 

    console.log('getHashtagPosts hashtag:  ',hashtag)
    const aggregation  = QUERY_POSTS_BY_HASHTAG(hashtag,skip,limit)
    const posts = await Hashtag.aggregate(aggregation)
    console.log('getHashtagPosts posts:  ',posts)
    return posts

}

exports.updateHashTags = updateHashTags
exports.getHashtagPosts = getHashtagPosts
