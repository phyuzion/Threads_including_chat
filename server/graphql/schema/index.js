const { gql } = require('apollo-server-express')


const typeDefs = gql`

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
    img: String
    video: String
    likes: [String]
    replies: [Reply]
    hashtags: [String]
    createdAt: String
}

type uploadURLs {
    userId: String!,
    imageUrl: String
    videoUrl: String
}
type User {
    _id: String
    username: String!
    email: String!
    password: String
    jwtToken: String
    followers: [String]
    following: [String]
    profilePic: String
}
type LastMessage {
    text: String
    sender: String
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

type Query {
    getPost(postId: String): Post
    getUserPosts(username: String): [Post]
    getFeedPosts: [Post]
    getSuggestedUsers: [User]
    getUserProfile(postedBy: String!): User
    getProfileByName(username: String!): User
    getPostsByHashTag(hashtag: String!, skip: Int! , limit: Int!): [Post]
    getMessages(otherUserId: String): [Message]
    getConversations: [Conversation]

}
type Mutation {

    createPost(text: String,imgUrl: String, videoUrl: String,hashtags: [String]): Post
    generateUrlsForUpload(userId: String, imageUpload: Boolean, videoUpload: Boolean): uploadURLs
    deletePost(postId: String): Boolean!
    likeUnLikePost(postId: String): Boolean!
    replyToPost(postId: String!, text: String!): Reply


    signupUser(username: String, password: String, email: String): User
    loginUser(username: String!, password: String!): User
    logoutUser: Boolean
    followUnFollow(followId: String!): User
    updateUser(email: String,password: String,profilePic: String): User
    freezeAccount: Boolean!

    sendMessage(receiverId: String, text: String , img: String): Message

}

`

module.exports = typeDefs