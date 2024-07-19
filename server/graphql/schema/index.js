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
    createdAt: String
}

type uploadURLs {
    userId: String!,
    imageUrl: String
    videoUrl: String
}
type User {
    _id: String
    name: String!
    username: String!
    email: String!
    password: String
    jwtToken: String
    followers: [String]
    following: [String]
}

type Query {
    getPost(postId: String): Post
    getUserPosts(username: String): [Post]
    getFeedPosts: [Post]
    getSuggestedUsers: [User]
    getUserProfile(postedBy: String!): User
    getProfileByName(username: String!): User
}
type Mutation {

    createPost(text: String,imgUrl: String, videoUrl: String): Post
    generateUrlsForUpload(userId: String, imageUpload: Boolean, videoUpload: Boolean): uploadURLs
    deletePost(postId: String): Boolean!
    likeUnLikePost(postId: String): Boolean!
    replyToPost(postId: String!, text: String!): Reply


    signupUser(name: String!, username: String, password: String, email: String): User
    loginUser(username: String!, password: String!): User
    logoutUser: Boolean
    followUnFollow(followId: String!): User
    
    freezeAccount: Boolean!
    

}

`

module.exports = typeDefs