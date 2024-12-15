const { gql } = require('apollo-server-express')


const typeDefs = gql`
scalar DateTime
type Reply {
    _id: String
    userId: String,
    text: String,
    userProfilePic: String
    username: String

}

type Post {
    _id: String!
    postedBy: String!
    text: String!
    star: Int
    img: String
    video: String
    likes: [String]
    replies: [Reply]
    hashtags: [String]
    createdAt: DateTime
}

type uploadURLs {
    userId: String!,
    imageUrl: String
    videoUrl: String
}

type Follow {
    followId: String
    startDate: DateTime
}
type User {
    _id: String
    username: String!
    email: String!
    bio: String
    password: String
    jwtToken: String
    followers: [Follow]
    following: [Follow]
    profilePic: String
    wallet_address: String
}
type LastMessage {
    text: String
    sender: String
    img: String
    seen: Boolean
}

type Participant {
    _id: String
    username: String
    profilePic: String
}
type Conversation {
    _id: String
    participants: [Participant]
    lastMessage: LastMessage
}

type Message {
    sender: String
    conversationId: String
    text: String
    seen: Boolean
    img: String
}
type UserLimited {
    _id: String
    username: String
    profilePic: String
    bio: String
    createdAt: DateTime
    followersCount: Int
    followingCount: Int
}
type Follows {
    _id: String
    username: String
    profilePic: String
    bio: String
    followAt: DateTime
}
type UserFollow {
    follows: [Follows]
    count: Int
}
type AllUsers {
    users: [User]
    count: Int
}
type AllPosts {
    posts: [Post]
    count: Int
}

type Query {
    getSuggestedUsers: [UserLimited]
    getFollows(skip: Int! , limit: Int!, following: Boolean): UserFollow
    getUserProfile(postedBy: String!): User
    getProfileByName(username: String!): User

    getLatestPosts(skip: Int! , limit: Int!): [Post]
    getPost(postId: String): Post
    getUserPosts(username: String,skip: Int! , limit: Int!): [Post]
    getFeedPosts(skip: Int! , limit: Int!): [Post]
    getPostsByHashTag(hashtag: String!, skip: Int! , limit: Int!): [Post]


    getMessages(otherUserId: String): [Message]
    getConversations: [Conversation]

    getRandomPostedImage: String
    
    getAllUsers: [User]
    getAllPosts: [Post]

    getAllUsers(skip: Int!, limit: Int!): AllUsers
    getAllPosts(skip: Int!, limit: Int!): AllPosts
    
}
type Mutation {

    createPost(text: String,imgUrl: String, videoUrl: String,hashtags: [String]): Post
    generateUrlsForUpload(userId: String, imageUpload: Boolean, videoUpload: Boolean): uploadURLs
    deletePost(postId: String): Boolean!
    deletePostByAdmin(postId: String): Boolean!
    likeUnLikePost(postId: String): Boolean!
    replyToPost(postId: String!, text: String!): Reply
    updateStarCount(postId: String!): Int!


    signupUser(username: String, password: String, email: String , bio: String): User
    loginUser(username: String!, password: String!): User
    logoutUser: Boolean
    followUnFollow(followId: String!): User
    updateUser(email: String,password: String,profilePic: String, bio: String, wallet_address: String): User
    freezeAccount: Boolean!

    sendMessage(receiverId: String, text: String , img: String): Message\
    
    deleteUser(userId: String!): Boolean!
    deletePost(postId: String!): Boolean!

    deleteUser(userName: String): Boolean
    createAdmin(username: String, password: String, email: String ): User

}

`

module.exports = typeDefs