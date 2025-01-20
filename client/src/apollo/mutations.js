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
export const signupUser = ` mutation SignupUser($username: String, $password: String, $email: String, $bio: String) {
  signupUser(username: $username, password: $password, email: $email, bio: $bio) {
    _id
    username
    email
    bio
  }
}
`
export const loginUser = ` mutation LoginUser($username: String!, $password: String!) {
  loginUser(username: $username, password: $password) {
    _id
    username
    email
    bio
    wallet_address
    jwtToken
    profilePic
    type
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
    followers {
      followId
      startDate
    }
    following {
      followId
      startDate
    }
  
  }
}`
export const freezeAccount = `mutation Mutation {
  freezeAccount
}`

export const Update_User = `mutation UpdateUser($email: String, $password: String, $profilePic: String, $bio: String, $wallet_address: String) {
  updateUser(email: $email, password: $password, profilePic: $profilePic, bio: $bio wallet_address: $wallet_address) {
    _id
    username
    email
    bio
    password
    jwtToken
    followers {
      followId
      startDate
    }
    following {
      followId
      startDate
    }
    profilePic
    wallet_address
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

export const Update_Star_Count = `mutation UpdateStarCount($postId: String!) {
  updateStarCount(postId: $postId)
}`


export const Delete_User = `mutation DeleteUser($userName: String!) {
  deleteUser(userName: $userName)
}`


export const Delete_Post_BY_ADMIN = `mutation DeletePostByAdmin($postId: String) {
  deletePostByAdmin(postId: $postId)
}`


export const CREATE_ADMIN = `mutation CreateAdmin($username: String, $password: String, $email: String) {
  createAdmin(username: $username, password: $password, email: $email) {
    _id
    email
    username
  }
}`


