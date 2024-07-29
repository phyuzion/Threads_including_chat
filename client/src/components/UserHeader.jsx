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
} from '@chakra-ui/react';
import { CgMoreO } from 'react-icons/cg';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom.js';
import useHandleFollowUnFollow from '../hooks/useHandleFollowUnFollow.js';
import UpdateProfilePage from '../pages/UpdateProfilePage';

function UserHeader({ user }) {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const CopyUrl = async () => {
    const currentURL = window.location.href;
    await navigator.clipboard.writeText(currentURL);
    toast({ title: 'Copied!', status: 'success' });
  };

  const { following, isFlwBtnLoading, handelFollowUnFollow } = useHandleFollowUnFollow(user);

  return (
    <VStack alignItems={'start'}>
      <Flex justifyContent={'space-between'} w={'full'}>
        <Box>
          <Text fontSize={'2xl'} fontWeight={'bold'}>
            {user?.name}
          </Text>
          <Flex alignItems={'center'} gap={4}>
            <Text size={'sm'}>{user?.username}</Text>
          </Flex>
          <Flex alignItems={'center'} gap={4}>
            <Text size={'sm'}>Address: </Text>
          </Flex>
          <Flex alignItems={'center'} gap={4}>
            <Text size={'sm'}>Star: </Text>
          </Flex>
        </Box>
        <Box>
          <Avatar name={user?.name} size={{ base: 'md', md: 'xl' }} src={user?.profilePic}></Avatar>
        </Box>
      </Flex>
      <Text>{user?.bio}</Text>
      <Flex justifyContent={'space-between'} w={'full'}>
        <Flex gap={2} alignItems={'center'}>
          <Text color={'gray.light'}>{user?.followers.length} Followers</Text>
        </Flex>
        <Flex alignItems={'center'} gap={2}>
          <Box className='icon-container'>
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={'pointer'}></CgMoreO>
              </MenuButton>
              <Portal>
                <MenuList bg={'gray.dark'}>
                  <MenuItem onClick={CopyUrl}>Copy Link</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      {currentUser?.loginUser?._id === user?._id ? (
        <>
          <Button onClick={onOpen}>Edit Profile</Button>
          <UpdateProfilePage isOpen={isOpen} onClose={onClose} />
        </>
      ) : (
        <Button onClick={handelFollowUnFollow} isLoading={isFlwBtnLoading}>
          {following ? 'Unfollow' : 'Follow'}
        </Button>
      )}
    </VStack>
  );
}

export default UserHeader;
