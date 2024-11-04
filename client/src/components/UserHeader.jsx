import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  Button,
  VStack,
  useToast,
  useDisclosure,
  Divider,
} from '@chakra-ui/react';
import { CgMoreO } from 'react-icons/cg';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import userAtom from '../atoms/userAtom.js';
import useHandleFollowUnFollow from '../hooks/useHandleFollowUnFollow.js';
import UpdateProfilePage from '../pages/UpdateProfilePage';
import getUserProfile from '../hooks/useGetUserProfile';

function UserHeader({ user }) {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);

  const { user: updatedUser, refetch } = getUserProfile(user.username);

  useEffect(() => {
    if (updatedUser && currentUser) {
      const isUserFollowing = updatedUser?.followers.some(follower => follower.followId === currentUser?.loginUser?._id);
      setIsFollowing(isUserFollowing);
    }
  }, [updatedUser, currentUser]);

  const CopyUrl = async () => {
    const currentURL = window.location.href;
    await navigator.clipboard.writeText(currentURL);
    toast({ title: 'Copied!', status: 'success' });
  };

  const { isFlwBtnLoading, handleFollowUnFollow } = useHandleFollowUnFollow(user);

  const handleFollowButtonClick = async () => {
    await handleFollowUnFollow();
    setIsFollowing(!isFollowing);
    
    // 변경: 상태만 업데이트하고 refetch는 생략하여 불필요한 전체 리렌더링 방지
    // refetch();
  };

  const handleSendMessage = () => {
    navigate(`/chat/${user.username}`);
  };

  const followerCount = updatedUser?.followers.length || user.followers.length;

  return (
    <Flex w="full" p={[2, 4]} flexDirection="column" spacing={[2, 4]}>
      <Flex
        w="full"
        flexDirection={['column', 'row']}
        justifyContent="space-between"
        alignItems="stretch"
      >
        <Flex
          w={['full', '50%']}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          mt={[4, 0]}
        >
          <Avatar name={user?.name} size={{ base: 'xl', md: '2xl' }} src={user?.profilePic} mb={[2, 4]} />
          <Box mt={2} textAlign="center">
            {currentUser?.loginUser?._id === user?._id ? (
              <>
                <Button onClick={onOpen} size="sm">
                  Edit Profile
                </Button>
                <UpdateProfilePage isOpen={isOpen} onClose={onClose} />
              </>
            ) : (
              <>
                <Button onClick={handleFollowButtonClick} isLoading={isFlwBtnLoading} size={["xs","sm"]} margin={1}>
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
                <Button onClick={handleSendMessage} size={["xs","sm"]} margin={1}>
                  Message
                </Button>
              </>
            )}
          </Box>
        </Flex>
        <Flex
          w={['full', '50%']}
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize={['xl', '2xl']} fontWeight="bold">
            {user?.username}
          </Text>
          <Text fontSize={['sm', 'md']}>
            {user?.bio}
          </Text>
        </Flex>
      </Flex>
      <Flex justifyContent="space-between" w="full" alignItems="center" mt={[0, 1]}>
        <Text fontSize={['sm', 'md']} color="gray.light">{followerCount} Followers</Text>
        <Box>
          <Menu>
            <MenuButton>
              <CgMoreO size={24} cursor="pointer" />
            </MenuButton>
            <Portal>
              <MenuList bg="gray.dark">
                <MenuItem onClick={CopyUrl}>Copy Link</MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Box>
      </Flex>
      <Divider />
    </Flex>
  );
}

export default UserHeader;
