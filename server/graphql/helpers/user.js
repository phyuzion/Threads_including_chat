const Follow = require('../../models/followModel')



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