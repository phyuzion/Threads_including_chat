import { useState } from 'react';
import useShowToast from './useShowToast';

import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { gql, useMutation } from "@apollo/client";
import { followUnFollow } from "../apollo/mutations.js";

const useHandleFollowUnFollow = (user) => {
 // console.log(' useHandleFollowUnFollow user: ',user)
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(user?.followers.includes(currentUser?._id));
  const [isFlwBtnLoading, SetIsFlwBtnLoading] = useState();
  const FOLLOW_UNFOLLOW = gql` ${followUnFollow}`;
  const [FOLLOW_UNFOLLOW_COMMAND] = useMutation(FOLLOW_UNFOLLOW,{fetchPolicy: 'network-only'});
  const showToast = useShowToast();

  const handelFollowUnFollow = async () => {
    if (!currentUser) {
      showToast('Error', 'You must be logged in', 'error');
      return;
    }
    if (isFlwBtnLoading) return;
    // SetIsFlwBtnLoading(true);
    // const res = await fetch(`/api/users/follow/${user?._id}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });

    SetIsFlwBtnLoading(true);
    const response =  await FOLLOW_UNFOLLOW_COMMAND( {variables:{ followId:  user?._id }})
    console.log('response.data:  ',response.data)
    if(response.data) {
      if (following) {
        user = response.data.followUnFollow
        console.log('user : ',user)
        //user?.followers.pop();
      }
      if (!following) {
        user = response.data.followUnFollow
        console.log('user: ',response.data)
        //user?.followers.push(currentUser?._id);
        // if(user) {
        //   const followers = [currentUser?._id]
        //   user.followers = [...user?.followers, followers];
        // }


      }
      setFollowing(!following);
      SetIsFlwBtnLoading(false);
    } else {
      console.log(' SERVER ERROR')
    }

  };

  return { following, isFlwBtnLoading, handelFollowUnFollow };
};

export default useHandleFollowUnFollow;
