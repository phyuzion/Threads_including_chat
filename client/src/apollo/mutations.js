export const Create_Post = `mutation Mutation($text: String, $imgUrl: String, $videoUrl: String, $hashtags: [String]) {
  createPost(text: $text, imgUrl: $imgUrl, videoUrl: $videoUrl, hashtags: $hashtags) {
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

export const DeletePost = ` mutation DeletePost($postId: String) {
  deletePost(postId: $postId)
}`

export const likeUnLikePost = `mutation LikeUnLikePost($postId: String) {
  likeUnLikePost(postId: $postId)
}`
export const replyToPost = `mutation ReplyToPost($postId: String!, $text: String!) {
  replyToPost(postId: $postId, text: $text) {
    _id
    userId
    text
    userProfilePic
    username
  }
}`
export const signupUser = ` mutation SignupUser($username: String, $password: String, $email: String) {
  signupUser(username: $username, password: $password, email: $email) {
    _id
    username
    email
    
  }
}
`
export const loginUser = ` mutation LoginUser($username: String!, $password: String!) {
  loginUser(username: $username, password: $password) {
    _id
    username
    email
    jwtToken
  }
}
`
export const logoutUser = `mutation Mutation {
  logoutUser
}`
export const followUnFollow = `mutation FollowUnFollow($followId: String!) {
  followUnFollow(followId: $followId) {
    _id
    username
    email
    followers
    following
  
  }
}`
export const freezeAccount = `mutation Mutation {
  freezeAccount
}`

export const Update_User = `mutation Mutation($email: String, $password: String, $profilePic: String) {
  updateUser(email: $email, password: $password, profilePic: $profilePic) {
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
export const Send_Message = `mutation Mutation($receiverId: String, $text: String, $img: String) {
  sendMessage(receiverId: $receiverId, text: $text, img: $img) {
    sender
    conversationId
    text
    seen
    img
  }
}`

