

export const GetFeedPosts = ` query GetFeedPosts {
getFeedPosts {
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
    likes
    replies {
      
    }
  }
}`

export const GetSuggestedUsers = `query GetSuggestedUsers {
  getSuggestedUsers {
    _id
    name
    username
    email
  }
}`

export const GetUserPosts = `query GetUserPosts {
  getUserPosts {
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
  }
}`