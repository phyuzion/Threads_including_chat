import { useState } from 'react';
import useShowToast from './useShowToast';

import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { gql, useMutation } from "@apollo/client";
import { followUnFollow } from "../apollo/mutations.js";

const useHandleFollowUnFollow = (user) => {
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(user?.followers.includes(currentUser?._id));
  const [isFlwBtnLoading, SetIsFlwBtnLoading] = useState();
  const FOLLOW_UNFOLLOW = gql` ${followUnFollow}`;

  const showToast = useShowToast();

  const handelFollowUnFollow = async () => {
    if (!currentUser) {
      showToast('Error', 'You must be logged in', 'error');
      return;
    }
    if (isFlwBtnLoading) return;
    SetIsFlwBtnLoading(true);
    const res = await fetch(`/api/users/follow/${user?._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response =  useMutation(FOLLOW_UNFOLLOW, {variables:{ followId:  user?._id },
      onCompleted: (data) => {
        console.log(' FOLLOW_UNFOLLOW onCompleted : ')
      },
      onError: (error) => {
        showToast('Error', error, 'error');
      } 
    })

    if (following) {
      showToast('UnFollowed', `${user?._id}`, 'info');
      user?.followers.pop();
    }
    if (!following) {
      showToast('Followed', `${user?._id}` , 'info');

      user?.followers.push(currentUser?._id);
    }

    setFollowing(!following);
    SetIsFlwBtnLoading(false);
  };

  return { following, isFlwBtnLoading, handelFollowUnFollow };
};

export default useHandleFollowUnFollow;
