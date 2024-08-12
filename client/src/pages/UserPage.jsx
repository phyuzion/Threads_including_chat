import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToast, Flex, Spinner, Box, Text } from '@chakra-ui/react';
import UserHeader from '../components/UserHeader';
import NotFoundPage from './NotFoundPage';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import Post from '../components/Post';
import getUserProfile from '../hooks/useGetUserProfile';
import { gql, useQuery } from '@apollo/client';
import { GetUserPosts, GetProfileByName } from '../apollo/queries';
import useShowToast from '../hooks/useShowToast';

const GET_USER_POSTS = gql`${GetUserPosts}`;
const GET_PROFILE_BY_NAME = gql`${GetProfileByName}`;

function UserPage() {
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);

  const { user, isLoading: isUserLoading } = getUserProfile();

  const { loading: isPostsLoading, error: postsError, data: postsData } = useQuery(GET_USER_POSTS, {
    variables: { username: username , skip: 0, limit: 10 },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setPosts(data.getUserPosts);
    },
    onError: (error) => {
      showToast('Error', error.message, 'error');
    }
  });

  useEffect(() => {
    if (postsData && postsData.getUserPosts) {
      setPosts(postsData.getUserPosts);
    }
  }, [postsData, setPosts]);

  if (isUserLoading || isPostsLoading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    );
  }

  if (!user) {
    return <NotFoundPage />;
  }

  if (postsError) {
    console.error('Error fetching user posts:', postsError);
    showToast('Error', postsError.message, 'error');
    return <NotFoundPage />;
  }

  return (
    <>
      {user && <UserHeader user={user} />}
      {(!isPostsLoading && posts.length === 0) && (
        <Flex justifyContent={'center'}>
          <h1>User has not posted anything</h1>
        </Flex>
      )}
      {isPostsLoading && (
        <Flex justifyContent={'center'}>
          <Spinner size={'xl'} />
        </Flex>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </>
  );
}

export default UserPage;
