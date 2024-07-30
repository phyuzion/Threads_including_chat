export const GetPostsByHashtag = `query GetPostsByHashTag($hashtag: String!, $skip: Int!, $limit: Int!) {
  getPostsByHashTag(hashtag: $hashtag, skip: $skip, limit: $limit) {
    _id
    postedBy
    text
    img
    video
    likes
    replies {
      _id
      userId
      text
      userProfilePic
      username
    }
    hashtags
    createdAt
  }
}
`

export const GetFeedPosts = ` query GetFeedPosts {
getFeedPosts {
    _id
    postedBy
    text
    img
    video
    likes
    hashtags
    replies {
      _id
      userId
      text
      userProfilePic
      username
    }
    createdAt
  }
}`

export const GetPost = `query GetPost($postId: String) {
  getPost(postId: $postId) {
    _id
    postedBy
    text
    img
    video
    createdAt
    likes
    hashtags
    replies {
      _id
      userId
      text
      userProfilePic
      username      
    }
  }
}`

export const GetSuggestedUsers = `query GetSuggestedUsers {
  getSuggestedUsers {
    _id
    username
    email
    followers
    following
    profilePic
  }
}`
export const GetProfileByName = `query GetProfileByName($username: String!) {
  getProfileByName(username: $username) {
    _id
    username
    email
    followers
    following
    profilePic
  }
}`

export const GetUserProfile = `query GetUserProfile($postedBy: String!) {
  getUserProfile(postedBy: $postedBy) {
    _id
    username
    email
    password
    jwtToken
    followers
    following
    profilePic
  }
}
`

export const GetUserPosts = `query GetUserPosts {
  getUserPosts {
    _id
    postedBy
    text
    img
    video
    likes
    hashtags
    replies {
      _id
      userId
      text
      userProfilePic
      username
    }
  }
}`