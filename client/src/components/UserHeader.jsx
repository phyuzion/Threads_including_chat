import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  Button,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';
import { NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom.js';
import useHandleFollowUnFollow from '../hooks/useHandleFollowUnFollow.js';

function UserHeader({ user }) {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);

  console.log("Current User:", currentUser?.username, "Profile User:", user?.username);
 //current User name can not check here.

  const CopyUrl = async () => {
    const currentURL = window.location.href;
    await navigator.clipboard.writeText(currentURL);
    toast({ title: 'Coppied!', status: 'success' });
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
            <Text size={'sm'}>Address : </Text>
          </Flex>
          <Flex alignItems={'center'} gap={4}>
            <Text size={'sm'}>Star : </Text>
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

      {currentUser?.username === user?.username ? (
        <NavLink to='/edit-profile'>
          <Button>Edit Profile</Button>
        </NavLink>
      ) : (
        <Button onClick={handelFollowUnFollow} isLoading={isFlwBtnLoading}>
          {following ? 'Unfollow' : 'Follow'}
        </Button>
      )}
    </VStack>
  );
}

export default UserHeader;
