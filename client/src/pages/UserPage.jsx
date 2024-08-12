import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useToast, Flex, Spinner, Box, Text } from '@chakra-ui/react';
import UserHeader from '../components/UserHeader';
import NotFoundPage from './NotFoundPage';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import Post from '../components/Post';
import getUserProfile from '../hooks/useGetUserProfile';
import { gql, useLazyQuery } from '@apollo/client';
import { GetUserPosts, GetProfileByName } from '../apollo/queries';
import useShowToast from '../hooks/useShowToast';

const GET_USER_POSTS = gql`${GetUserPosts}`;
const GET_PROFILE_BY_NAME = gql`${GetProfileByName}`;

function UserPage() {
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const { user, isLoading: isUserLoading } = getUserProfile();

  const [refetch, { loading: isPostsLoading, data: postsData, error: postsError }] = useLazyQuery(GET_USER_POSTS, {
    variables: { username, skip, limit: 10 },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const newPosts = data.getUserPosts;

      if (newPosts.length < 10) {
        setHasMore(false); // 더 이상 로드할 데이터가 없음을 표시
      }

      // 중복된 포스트를 제거하는 로직
      setPosts((prevPosts) => {
        const allPosts = [...prevPosts, ...newPosts];
        const uniquePosts = Array.from(new Set(allPosts.map(post => post._id)))
          .map(id => allPosts.find(post => post._id === id));
        return uniquePosts;
      });
    },
    onError: (error) => {
      showToast('Error', error.message, 'error');
    }
  });

  const lastPostElementRef = useCallback(
    (node) => {
      if (isPostsLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setSkip((prevSkip) => prevSkip + 10);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isPostsLoading, hasMore]
  );

  useEffect(() => {
    // 페이지가 처음 로드될 때만 초기화
    setSkip(0);
    setPosts([]);
    setHasMore(true);
    refetch();
  }, [username]);

  useEffect(() => {
    if (skip > 0) {
      refetch();
    }
  }, [skip, refetch]);

  if (isUserLoading || (isPostsLoading && skip === 0)) {
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
      {posts.map((post, index) => {
        if (posts.length === index + 1) {
          return <Post ref={lastPostElementRef} key={post._id} post={post} />;
        } else {
          return <Post key={post._id} post={post} />;
        }
      })}
    </>
  );
}

export default UserPage;
