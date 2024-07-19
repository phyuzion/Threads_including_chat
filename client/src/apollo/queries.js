

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
    createdAt
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

export const GetSuggestedUsers = `query GetSuggestedUsers {
  getSuggestedUsers {
    _id
    name
    username
    email
    followers
    following
  }
}`
export const GetProfileByName = `query GetProfileByName($username: String!) {
  getProfileByName(username: $username) {
    _id
    name
    username
    email
    followers
    following
  }
}`

export const GetUserProfile = `query GetUserProfile($postedBy: String!) {
  getUserProfile(postedBy: $postedBy) {
    _id
    name
    username
    email
    password
    jwtToken
    followers
    following
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
    replies {
      _id
      userId
      text
      userProfilePic
      username
    }
  }
}`