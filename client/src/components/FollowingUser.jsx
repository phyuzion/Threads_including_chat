import { Avatar, Button, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import useHandleFollowUnFollow from '../hooks/useHandleFollowUnFollow';

export const FollowingUser = ({ user, onFollow }) => {
//   const { following, isFlwBtnLoading, handelFollowUnFollow } = useHandleFollowUnFollow(user);

//   const handleFollowClick = async () => {
//     await handelFollowUnFollow();
//     if (!following) {
//       onFollow(user._id); // Follow 성공 시, 부모 컴포넌트에 알림
//     }
//   };

  return (
    <Flex gap={2} justifyContent={'space-between'} alignItems={'center'}>
      <Flex as={Link} to={`/${user.username}`} gap={2}>
        <Avatar size={'sm'} src={user.profilePic} />
        <Flex direction={'column'} fontSize="sm">
          <Text fontWeight={400}>{user.username}</Text>
          <Text fontSize="xs">{user.name}</Text>
        </Flex>
      </Flex>
      {/* {!following && (
        <Button
          size={'xs'}
          color={'white'}
          bg={'blue.400'}
          onClick={handleFollowClick}
          isLoading={isFlwBtnLoading}
          _hover={{
            color: 'white',
            opacity: '.8',
          }}
        >
          Follow
        </Button>
      )} */}
    </Flex>
  );
};


export default FollowingUser;
