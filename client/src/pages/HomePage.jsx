import { gql, useQuery } from "@apollo/client";
import React, { useState } from 'react';
import { useToast, Flex, Spinner, Box, Text } from '@chakra-ui/react';
import Post from '../components/Post';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import SuggestedUsers from '../components/SuggestedUsers';
import { GetFeedPosts } from "../apollo/queries.js";

const GET_FEED_POST = gql`
  ${GetFeedPosts}
`;

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { loading, error, data } = useQuery(GET_FEED_POST, {
    onCompleted: (data) => {
      setPosts(data.getFeedPosts);
    },
    onError: (error) => {
      console.error('Error fetching feed posts:', error);
    }
  });

  return (
    <>
      {loading ? (
        <Flex justifyContent={'center'} mt={[4, 6, 8]}>
          <Spinner size={'xl'} />
        </Flex>
      ) : (!posts || posts.length === 0) ? (
        <Flex justifyContent={'center'} mt={[10, 15, 20]}>
          <Text fontSize={['md', 'lg', 'xl']}>You must follow someone to view posts</Text>
        </Flex>
      ) : (
        posts.map((post) => {
          return <Post key={post._id} post={post} />;
        })
      )}
    </>
  );
};

export default HomePage;
