import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Flex, Spinner, Text, Box, Button, Stack, useColorModeValue } from '@chakra-ui/react';
import Post from '../components/Post';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import { GetFeedPosts, GetLatestPost } from "../apollo/queries.js";

const GET_FEED_POST = gql`
  ${GetFeedPosts}
`;

const GET_LATEST_POST = gql`
  ${GetLatestPost}
`;

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [queryType, setQueryType] = useState('LATEST');
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const [refetch, { loading, data }] = useLazyQuery(
    queryType === 'FEED' ? GET_FEED_POST : GET_LATEST_POST,
    {
      variables: { skip, limit: 10 },
      onCompleted: (data) => {
        const newPosts = queryType === 'FEED' ? data?.getFeedPosts : data?.getLatestPosts;
        
        if (newPosts.length < 10) {
          setHasMore(false); // 더 이상 로드할 데이터가 없음을 표시
        }

        // 여기에 중복 제거 로직 추가
        setPosts((prevPosts) => {
          const allPosts = [...prevPosts, ...newPosts];
          const uniquePosts = Array.from(new Set(allPosts.map(post => post._id)))
            .map(id => allPosts.find(post => post._id === id));
          return uniquePosts;
        });
      },
      onError: (error) => {
        console.error(`Error fetching ${queryType.toLowerCase()} posts:`, error);
      },
    }
  );

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setSkip((prevSkip) => prevSkip + 10);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    setSkip(0); // 쿼리 타입이 변경될 때 skip을 초기화
    setPosts([]); // 포스트 초기화
    setHasMore(true); // 데이터 로드 가능 상태로 변경
    refetch();
  }, [queryType]);

  useEffect(() => {
    if (skip > 0) {
      refetch();
    }
  }, [skip]);

  const handleQueryChange = () => {
    const newQueryType = queryType === 'LATEST' ? 'FEED' : 'LATEST';
    setQueryType(newQueryType);
    setSkip(0); // skip을 초기화하여 첫 페이지부터 새로 가져옴
    setPosts([]); // 기존 포스트 목록을 초기화
    setHasMore(true); // 더 로드할 수 있도록 상태 초기화
    refetch(); // 쿼리 재실행
  };

  return (
    <Box position="relative">
      {loading && skip === 0 ? (
        <Flex justifyContent={'center'} gap={[2, 3, 4]} mt={[4, 6, 8]}>
          <Spinner size={'xl'} />
        </Flex>
      ) : (!posts || posts.length === 0) ? (
        <Flex justifyContent={'center'} gap={[2, 3, 4]} mt={[10, 15, 20]}>
          <Text fontSize={['md', 'lg', 'xl']}>You must follow someone</Text>
        </Flex>
      ) : (
        posts.map((post, index) => {
          if (posts.length === index + 1) {
            return <Post ref={lastPostElementRef} key={post._id} post={post} />;
          } else {
            return <Post key={post._id} post={post} />;
          }
        })
      )}
      <Box mb={20}></Box> {/* Add space at the bottom */}
      <Stack
        direction="row"
        spacing={0}
        position="fixed"
        bottom={[4, 6, 10]}
        left={[4, 6, 10]}
        bg={'gray.dark'}
        borderRadius="md"
        overflow="hidden"
        onClick={handleQueryChange}
      >
        <Box
          flex="1"
          textAlign="center"
          padding="9px"
          fontWeight='bold'
          color={queryType === 'LATEST' ? 'black' : 'gray.500'}
          bg={queryType === 'LATEST' ? 'white' : 'transparent'}
          transition="background-color 0.3s ease"
        >
          LATEST
        </Box>
        <Box
          flex="1"
          textAlign="center"
          padding="9px"
          fontWeight='bold'
          color={queryType === 'FEED' ? 'black' : 'gray.500'}
          bg={queryType === 'FEED' ? 'white' : 'transparent'}
          transition="background-color 0.3s ease"
        >
          FEED
        </Box>
      </Stack>
    </Box>
  );
};

export default HomePage;
