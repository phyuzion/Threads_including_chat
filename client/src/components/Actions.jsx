import {
  Box,
  Button,
  Flex,
  Textarea,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/postsAtom';
import { gql, useMutation } from "@apollo/client";
import { likeUnLikePost, replyToPost } from "../apollo/mutations.js";

const Actions = ({ post }) => {
  const user = useRecoilValue(userAtom);
  const [liked, setLiked] = useState(post.likes.includes(user?.loginUser?._id));
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isLiking, setIsLiking] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [reply, setReply] = useState('');
  const [stars, setStars] = useState(post.stars || 0);

  const toast = useToast();
  //here must merge
  const { isOpen, onOpen, onClose } = useDisclosure();
  const LIKE_UNLIKE_POST = gql`${likeUnLikePost}`;
  const REPLY_TO_POST = gql`${replyToPost}`;
  const [LIKE_UNLIKE_POST_COMMAND] = useMutation(LIKE_UNLIKE_POST, { fetchPolicy: 'network-only' });
  const [REPLY_POST_COMMAND] = useMutation(REPLY_TO_POST, { fetchPolicy: 'network-only' });

  const handleLikeAndUnlike = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to like a post',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    if (isLiking) return;
    setIsLiking(true);

    const response = await LIKE_UNLIKE_POST_COMMAND({ variables: { postId: post._id } });
    console.log(response.data.likeUnLikePost);

    const updatedPosts = posts.map((p) => {
      if (p._id === post._id) {
        return liked
          ? { ...p, likes: p.likes.filter((id) => id !== user.loginUser?._id) }
          : { ...p, likes: [...p.likes, user.loginUser?._id] };
      }
      return p;
    });
    setPosts(updatedPosts);
    setIsLiking(false);
    setLiked(!liked);
  };

  const handleReply = async () => {
    if (!reply.trim()) {
      toast({
        title: 'Reply Required',
        description: 'Please provide text before reply.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to reply to a post',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (isReplying) return;
    setIsReplying(true);

    const response = await REPLY_POST_COMMAND({ variables: { postId: post._id, text: reply } });
    console.log('replies: ', response?.data);
    if (response?.data?.replyToPost) {
      const updatedPosts = posts.map((p) => {
        if (p._id === post._id) {
          return { ...p, replies: [...p.replies, response?.data?.replyToPost] };
        }
        return p;
      });
      setPosts(updatedPosts);
    }

    onClose();
    setReply('');
    setIsReplying(false);
  };

  const handleStarClick = () => {
    setStars(stars + 1);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'm';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    } else {
      return num;
    }
  };

  return (
    <Flex flexDirection='column' w='full' position='relative' >
      <Flex gap={3} my={2} w='full' alignItems='center'>
        <svg
          aria-label='Like'
          color={liked ? 'rgb(237, 73, 86)' : ''}
          fill={liked ? 'rgb(237, 73, 86)' : 'transparent'}
          height='19'
          role='img'
          viewBox='0 0 24 22'
          width='20'
          onClick={handleLikeAndUnlike}
          cursor={'pointer'}
        >
          <path
            d='M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z'
            stroke='currentColor'
            strokeWidth='2'
          ></path>
        </svg>

        <svg
          aria-label='Comment'
          color=''
          fill=''
          height='20'
          role='img'
          viewBox='0 0 24 24'
          width='20'
          onClick={onOpen}
          cursor={'pointer'}
        >
          <title>Comment</title>
          <path
            d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
            fill='none'
            stroke='currentColor'
            strokeLinejoin='round'
            strokeWidth='2'
          ></path>
        </svg>

        <Box marginLeft="auto" display='flex' alignItems='center'>
          <Text mr={1} color={'white'} fontSize='sm'>
            {formatNumber(stars)}
          </Text>
          <Button onClick={handleStarClick} bg='transparent' p={0} minW='auto' _hover={{ bg: 'transparent' }}>
            <svg
              aria-label='Star'
              color='gold'
              fill='gold'
              height='24'
              role='img'
              viewBox='0 0 24 24'
              width='24'
            >
              <title>Star</title>
              <path
                d='M12 .587l3.668 7.431 8.215 1.191-5.941 5.788 1.402 8.192L12 18.897l-7.344 3.86 1.402-8.192-5.941-5.788 8.215-1.191z'
              />
            </svg>
          </Button>
        </Box>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} iscenterd>
        <ModalOverlay />
        <ModalContent bg={'gray.dark'} borderRadius="md" boxShadow="xl">
          <ModalHeader>Write your comment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={0}>
            <Textarea
              placeholder='Reply goes here..'
              value={reply}
              onChange={(e) => setReply(e.target.value.slice(0,100))}
              maxLength={100}
            />
            <Flex justifyContent='flex-end' width='100%'>
              <Text color='gray.400'>{reply.length}/100</Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
              size={'sm'}
              
              isLoading={isReplying}
              onClick={handleReply}
            >
              Reply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Actions;

const RepostSVG = () => {
  return (
    <svg
      aria-label='Repost'
      color='currentColor'
      fill='currentColor'
      height='20'
      role='img'
      viewBox='0 0 24 24'
      width='20'
    >
      <title>Repost</title>
      <path
        fill=''
        d='M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z'
      ></path>
    </svg>
  );
};

const ShareSVG = () => {
  return (
    <svg
      aria-label='Share'
      color=''
      fill='rgb(243, 245, 247)'
      height='20'
      role='img'
      viewBox='0 0 24 24'
      width='20'
    >
      <title>Share</title>
      <line
        fill='none'
        stroke='currentColor'
        strokeLinejoin='round'
        strokeWidth='2'
        x1='22'
        x2='9.218'
        y1='3'
        y2='10.083'
      ></line>
      <polygon
        fill='none'
        points='11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334'
        stroke='currentColor'
        strokeLinejoin='round'
        strokeWidth='2'
      ></polygon>
    </svg>
  );
};
