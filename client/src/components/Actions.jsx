import {
  Box,
  Button,
  Flex,
  Text,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { FaHeart, FaRegCommentDots, FaStar } from 'react-icons/fa';
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/postsAtom';
import { gql, useMutation } from "@apollo/client";
import { likeUnLikePost, replyToPost, Update_Star_Count } from "../apollo/mutations.js";

const Actions = ({ post }) => {
  const user = useRecoilValue(userAtom);
  const [liked, setLiked] = useState(post.likes.includes(user?.loginUser?._id));
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isLiking, setIsLiking] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [reply, setReply] = useState('');
  const [stars, setStars] = useState(post.star || 0);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const LIKE_UNLIKE_POST = gql`${likeUnLikePost}`;
  const REPLY_TO_POST = gql`${replyToPost}`;
  const UPATE_STAR_COUNT = gql`${Update_Star_Count}`;
  const [LIKE_UNLIKE_POST_COMMAND] = useMutation(LIKE_UNLIKE_POST, { fetchPolicy: 'network-only' });
  const [REPLY_POST_COMMAND] = useMutation(REPLY_TO_POST, { fetchPolicy: 'network-only' });
  const [UPATE_STAR_COUNT_COMMAND] = useMutation(UPATE_STAR_COUNT, { fetchPolicy: 'network-only' });

  const handleLikeAndUnlike = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to like a post',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (isLiking) return;
    setIsLiking(true);

    const response = await LIKE_UNLIKE_POST_COMMAND({ variables: { postId: post._id } });
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

  const handleStarClick = async () => {
    const response = await UPATE_STAR_COUNT_COMMAND({ variables: { postId: post._id } });
    setStars(response?.data?.updateStarCount);
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
    <Flex w='full' gap={4} alignItems='center' mt={1} mb={1}>
      <Icon
        as={FaHeart}
        color={liked ? '#ED4956' : '#A0AEC0'}
        boxSize={6}
        cursor='pointer'
        onClick={handleLikeAndUnlike}
      />
      <Icon
        as={FaRegCommentDots}
        color='#A0AEC0'
        boxSize={6}
        cursor='pointer'
        onClick={onOpen}
      />
      <Flex alignItems='center' ml='auto'>
        <Text mr={1} color='#4A5568' fontSize='md' fontWeight="bold">
          {formatNumber(stars)}
        </Text>
        <Button
          onClick={handleStarClick}
          bg='transparent'
          p={0}
          minW='auto'
          _hover={{ bg: 'transparent' }}
        >
          <Icon as={FaStar} color='#FFD700' boxSize={6} />
        </Button>
      </Flex>

      {/* 댓글 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg='#FFFFFF' borderRadius='md' boxShadow='lg' p={4}>
          <ModalCloseButton color="#718096" />
          <ModalBody>
            <Input
              placeholder='Write a comment...'
              value={reply}
              onChange={(e) => setReply(e.target.value.slice(0, 100))}
              maxLength={100}
              bg='#F7FAFC'
              color='#2D3748'
              border='1px solid #E2E8F0'
              borderRadius='md'
              _placeholder={{ color: '#A0AEC0' }}
            />
            <Flex justifyContent='flex-end' mt={2}>
              <Text color='#718096' fontSize='sm'>
                {reply.length}/100
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter display="flex" justifyContent="center">
            <Button
              bg='#3182CE'
              color='white'
              _hover={{
                bg: '#2B6CB0',
              }}
              size='sm'
              isLoading={isReplying}
              onClick={handleReply}
              width="full"
              borderRadius="md"
            >
              Post Comment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Actions;
