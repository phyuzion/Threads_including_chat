import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Button,
  Text,
  VStack,
  useToast,
  Icon,
  Avatar,
} from '@chakra-ui/react';
import { FaUserPlus, FaLink } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom.js';
import useHandleFollowUnFollow from '../hooks/useHandleFollowUnFollow.js';
import getUserProfile from '../hooks/useGetUserProfile';
import UpdateProfilePage from '../pages/UpdateProfilePage'; // UpdateProfilePage 컴포넌트를 가져옵니다.
import { useDisclosure } from '@chakra-ui/react';

function UserHeader({ user }) {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isFollowing, setIsFollowing] = useState(false);

  const { user: updatedUser } = getUserProfile(user.username);

  useEffect(() => {
    if (updatedUser && currentUser) {
      const isUserFollowing = updatedUser?.followers.some(follower => follower.followId === currentUser?.loginUser?._id);
      setIsFollowing(isUserFollowing);
    }
  }, [updatedUser, currentUser]);

  const CopyUrl = async () => {
    const currentURL = window.location.href;
    await navigator.clipboard.writeText(currentURL);
    toast({ title: 'Link copied!', status: 'success' });
  };

  const { isFlwBtnLoading, handleFollowUnFollow } = useHandleFollowUnFollow(user);

  const handleFollowButtonClick = async () => {
    await handleFollowUnFollow();
    setIsFollowing(!isFollowing);
  };

  const followerCount = updatedUser?.followers.length || user.followers.length;

  return (
    <Box textAlign="center" mb={6}>
      {/* Profile Background with Username */}
      <Box
        position="relative"
        bgImage={user.profilePic ? `url(${user.profilePic})` : 'url(/path/to/anonymous_image.png)'}
        bgSize="cover"
        bgPosition="center"
        borderRadius="lg"
        overflow="hidden"
        width="80%"
        height="auto"
        aspectRatio="4/3"
        mx="auto"
        mb={4}
      >
        <Flex
          position="absolute"
          bottom={4}
          width="100%"
          justify="center"
          bg="rgba(0, 0, 0, 0.6)"
          py={2}
        >
          <Text fontSize="xl" fontWeight="bold" color="white">
            {user.username}
          </Text>
        </Flex>
      </Box>

      {/* Bio and Follower Count */}
      <VStack spacing={1} mb={4}>
        <Text fontSize="sm" color="#333333">
          {user.bio || 'This user has no bio.'}
        </Text>
        <Text fontSize="xs" color="#666666">
          {followerCount} Followers
        </Text>
      </VStack>

      {/* Follow/Edit Profile and Share Buttons */}
      <Flex gap={2} justify="center">
        {currentUser?.loginUser?._id === user._id ? (
          <>
            <Button
              onClick={onOpen}
              size="sm"
              bg="#48639D"
              color="white"
              borderRadius="full"
              px={4}
              _hover={{ bg: '#3E5377' }}
            >
              Edit Profile
            </Button>
            <UpdateProfilePage isOpen={isOpen} onClose={onClose} />
          </>
        ) : (
          <>
            <Button
              onClick={handleFollowButtonClick}
              isLoading={isFlwBtnLoading}
              leftIcon={<Icon as={FaUserPlus} />}
              size="sm"
              bg="#48639D"
              color="white"
              borderRadius="full"
              px={4}
              _hover={{ bg: '#3E5377' }}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          </>
        )}

        <Button
          leftIcon={<FaLink />}
          size="sm"
          color="#333333"
          variant="outline"
          borderColor="#333333"
          onClick={CopyUrl}
          borderRadius="full"
          px={4}
        >
          Share Profile
        </Button>
      </Flex>
    </Box>
  );
}

export default UserHeader;
