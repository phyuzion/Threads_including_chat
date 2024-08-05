export const GetLatestPost = `query GetLatestPosts($skip: Int!, $limit: Int!) {
  getLatestPosts(skip: $skip, limit: $limit) {
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
}`

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

export const GetFeedPosts = ` query GetFeedPosts($skip: Int!, $limit: Int!) {
  getFeedPosts(skip: $skip, limit: $limit) {
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
    profilePic
    bio
    createdAt
    followersCount
    followingCount
  }
}`
export const GetProfileByName = `query GetProfileByName($username: String!) {
  getProfileByName(username: $username) {
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
    followers {
      followId
      startDate
    }
    following {
      followId
      startDate
    }
    profilePic
  }
}

`

export const GetUserPosts = `query GetUserPosts($username: String!) {
  getUserPosts(username: $username) {
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

export const GetMessages = `query GetMessages($otherUserId: String) {
  getMessages(otherUserId: $otherUserId) {
    sender
    conversationId
    text
    seen
    img
  }
}`

export const GetConversations = `query GetConversations {
  getConversations {
    _id
    participants {
      _id
      username
      profilePic
    }
    lastMessage {
      text
      sender
      seen
    }
  }
}`

export const GetFollows = `query GetFollows($skip: Int!, $limit: Int!, $following: Boolean) {
  getFollows(skip: $skip, limit: $limit, following: $following) {
    follows {
      _id
      username
      profilePic
      bio
      followAt
    }
    count
  }
}`