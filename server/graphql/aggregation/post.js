


const PROJECT_POST_IMAGE = {
    $project:
    {
      _id: 0,
      img: 1,
    }, 
 }

const SAMPLE_RANDOM = {
    $sample:
    {
        size: 1
    }, 
 }

 const MATCH_IMG_URL_NOT_NULL = {
    $match:
    {
        'img' : { $exists: true, $ne: "" } 
    }
 }


const QUERY_RANDOM_POST_IMAGE = () => {
    return [
        MATCH_IMG_URL_NOT_NULL,
        SAMPLE_RANDOM,   
        PROJECT_POST_IMAGE
    ]
}




exports.QUERY_RANDOM_POST_IMAGE = QUERY_RANDOM_POST_IMAGE