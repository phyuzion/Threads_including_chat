import React from 'react';
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
import WalletComponent from './WalletComponent.jsx';

function UserHeader({ user }) {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const CopyUrl = async () => {
    const currentURL = window.location.href;
    await navigator.clipboard.writeText(currentURL);
    toast({ title: 'Copied!', status: 'success' });
  };

  const { following, isFlwBtnLoading, handleFollowUnFollow } = useHandleFollowUnFollow(user);

  const handleSendMessage = () => {
    navigate(`/chat/${user.username}`);
  };

  return (
    <VStack alignItems={'start'} w="full" p={[2, 4]} spacing={[2, 4]}>
      <Flex justifyContent={'space-between'} w="full" alignItems="center" flexDirection={['column', 'row']}>
        <Box mb={[4, 0]}>
          <Text fontSize={['xl', '2xl']} fontWeight="bold">
            {user?.username}
          </Text>
          <Text fontSize={['sm', 'md']}>{user?.bio}</Text>
          <WalletComponent />
        </Box>
        <Box textAlign="center">
          <Avatar name={user?.name} size={{ base: 'xl', md: '2xl' }} src={user?.profilePic} mb={[2, 4]} />
          <Box mt={2}>
            {currentUser?.loginUser?._id === user?._id ? (
              <>
                <Button onClick={onOpen} size="sm">
                  Edit Profile
                </Button>
                <UpdateProfilePage isOpen={isOpen} onClose={onClose} />
              </>
            ) : (
              <>
                <Button onClick={handleFollowUnFollow} isLoading={isFlwBtnLoading} size="sm">
                  {following ? 'Unfollow' : 'Follow'}
                </Button>
                <Button onClick={handleSendMessage} size="sm" ml={2}>
                  Message
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Flex>
      <Flex justifyContent="space-between" w="full" alignItems="center">
        <Text fontSize={['sm', 'md']} color="gray.light">{user?.followers.length} Followers</Text>
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
    </VStack>
  );
}

export default UserHeader;
