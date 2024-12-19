const Follow = require('../../models/followModel')
const User = require('../../models/userModel')
const HashTag = require('../../models/hashTagModel')
const Post = require('../../models/postModel')
const { USER_TYPES } = require('../../helpers/enum')

const deleteUserAndPosts = async (userName,session) => {

    const user = await User.findOne({username: userName}).session(session).exec()
    if (!user) {
        throw new Error("User not found");
    }

    const hashtagResult = await HashTag.deleteOne({ createdBy: user._id }).session(session)
    console.log('deleteUserAndPosts  hashtagResult: ',hashtagResult)
    const postResult = await  Post.deleteOne({ postedBy: user._id }).session(session)
    console.log('deleteUserAndPosts  postResult: ',postResult)
    const follow = await User.updateMany(
        {type: USER_TYPES.USER},
        {
            $pull: { 
                following : { followId:  user._id } ,
                followers : { followId:  user._id }
            },
        },
        {
            session: session
        }
    )
    console.log('deleteUserAndPosts  follow: ',follow)

    const user_ = await User.deleteOne({ _id: user._id }).session(session)
    console.log('deleteUserAndPosts  user_: ',user_)

} 
const getFollowUnfollowUpdate = (isFollowing, followingId,  followerId) => {
    const updates = []
    let following, follower
    if(isFollowing) {

        following = {
            updateOne: {
                filter: { _id : followingId },
                update: {
                  $pull: { following : { followId:  followerId } }
                },
            }
        }
        follower = {
            updateOne: {
                filter: { _id : followerId },
                update: {
                  $pull: { followers : { followId:  followingId } }
                },
                
           }
        }
    } else {
        const Following_ = new Follow({
            followId: followerId,
            startDate: Date()
        })
        const Follower_ = new Follow({
            followId: followingId,
            startDate: Date()
        })
        following = {
            updateOne: {
                filter: { _id : followingId },
                update: {
                  //$push: { $each: [ {following :  [Following_]}], $postion: 0 }
                  $push: { following :  Following_} 
                },
            }
        }
        follower = {
            updateOne: {
                filter: { _id : followerId },
                update: {
                  //$push: { $each: [ {followers :  [Follower_]}], $postion: 0  }
                  $push: { followers :  Follower_} 
                },
           }
        }
    }
    console.log('following : ',following)
    console.log('follower : ',follower)
    updates.push(following)
    updates.push(follower)
    return updates

}

exports.getFollowUnfollowUpdate = getFollowUnfollowUpdate
exports.deleteUserAndPosts = deleteUserAndPosts