const { 
    SKIP_STAGE, 
    LIMIT_STAGE, 
    LOOKUP_STAGE, 
    UNWIND_STAGE
 } = require('./common');

 const PROJECT_FOLLOWS_LIMITED = {
    $project:
    {
        _id: "$follows._id",
        username: "$follows.username",
        profilePic: "$follows.profilePic",
        bio: "$follows.bio",
        followersCount: { $size: "$follows.followers" },
        followingCount: { $size: "$follows.following" }
    }

 }

 const PROJECT_USER_LIMITED = {
    $project:
    {
      _id: 1,
      username: 1,
      profilePic: 1,
      bio: 1,
      createdAt: 1,
      followersCount: { $size: "$followers" },
      followingCount: { $size: "$following" }
    }, 
 }

 const LOOKUP_NON_FOLLOWING_USERS = {
    $lookup:
    {
      from: "User",
      let: {
        following_Ids: "$followingIds"
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $not: {
                $in: ["$_id", "$$following_Ids"]
              }
            }
          }
        }
      ],
      as: "followingusers"
    }  
 }

 const PROJECT_FOLLOWING_USERS= {
    $project:
    {
        followingIds: {
            $concatArrays: [
                "$following.followId",
                ["$_id"]
            ]
        }
    }, 
 }

 const PROJECT_FOLLOWS_RESULT = {
    $project:
    {
      _id: "$followInfo._id",
      username: "$followInfo.username",
      profilePic: "$followInfo.profilePic",
      bio: "$followInfo.bio",
      followAt: {
        $dateToString: {
            date: '$follows.startDate',
            timezone: '+09:00',
        }
      } 
    }, 
 }

 const PROJECT_FOLLOWS = (fieldName, skip , limit) =>{
    const field = "$"+fieldName
    return {
        $project:
        {
          follows: { $slice: [field, skip, limit] }
        }  
    }
 }
 const PROJECT_FOLLOWS_COUNT = (fieldName, skip , limit) =>{
    const field = "$"+fieldName
    return {
        $project:
        {
            count: { $size: field },            
        }  
    }
 }
 
 const MATCH_USER_ID= (userId) => {
    return {
        $match:
        {
            _id: userId,
        },
    }
}

 const QUERY_FOLLOWS = (userId,skip,limit,isFollowing) => {

    const fieldName = (isFollowing) ? "following": "followers"
    return [
        MATCH_USER_ID(userId),                                                                                                                                                             
        PROJECT_FOLLOWS(fieldName,skip,limit),
        UNWIND_STAGE("follows"),
        LOOKUP_STAGE("User","follows.followId","_id","followInfo"),
        UNWIND_STAGE("followInfo"),
        PROJECT_FOLLOWS_RESULT
    ]
}
const QUERY_FOLLOWS_COUNT = (userId,isFollowing) => {

    const fieldName = (isFollowing) ? "following": "followers"
    return [
        MATCH_USER_ID(userId),                                                                                                                                                             
        PROJECT_FOLLOWS_COUNT(fieldName),
    ]
}

const QUERY_USER_LIMITED = (userId) => {

    return [
        MATCH_USER_ID(userId),                                                                                                                                                             
        PROJECT_USER_LIMITED,
    ]
}

const QUERY_SUGGESTED_USERS = (userId,skip,limit) => {
    return [
        MATCH_USER_ID(userId),   
        PROJECT_FOLLOWING_USERS,
        LOOKUP_NON_FOLLOWING_USERS,
        PROJECT_FOLLOWS("followingusers",skip,limit),
        UNWIND_STAGE("follows"),
        PROJECT_FOLLOWS_LIMITED             
    ]
}

exports.QUERY_FOLLOWS = QUERY_FOLLOWS
exports.QUERY_FOLLOWS_COUNT = QUERY_FOLLOWS_COUNT
exports.QUERY_USER_LIMITED = QUERY_USER_LIMITED
exports.QUERY_SUGGESTED_USERS = QUERY_SUGGESTED_USERS