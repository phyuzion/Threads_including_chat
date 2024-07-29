import { gql, useQuery } from "@apollo/client";
import React, { useState } from 'react';
import { useToast, Flex, Spinner, Box } from '@chakra-ui/react';
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
    <Flex gap={10} alignItems={'flex-start'}>
      <Box flex={70}>
        {loading ? (
          <Flex justifyContent={'center'}>
            <Spinner size={'xl'} />
          </Flex>
        ) : (!posts || posts.length === 0) ? (
          <Flex justifyContent={'center'} mt={20}>
            <h1>You must follow someone to view posts</h1>
          </Flex>
        ) : (
          posts.map((post) => {
            return <Post key={post._id} post={post} />;
          })
        )}
      </Box>
      <Box flex={30}>
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;
