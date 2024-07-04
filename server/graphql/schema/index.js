const { gql } = require('apollo-server-express')


const typeDefs = gql`

type Reply {
    _id: String!
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
    likes: [String]
    replies: [Reply]
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
}
type Query {
    getPost(postId: String): Post
    getUserPosts(username: String): [Post]
    getFeedPosts: [Post]
    getSuggestedUsers: [User]
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
    followUnFollow(followId: String!): Boolean
    
    freezeAccount: Boolean!
    

}

`

module.exports = typeDefs