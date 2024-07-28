import { Box, Button, Flex, Image, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { RxAvatar } from 'react-icons/rx';
import { AiFillHome } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom.js';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { MdOutlineSettings } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
import useLogout from '../hooks/useLogout.js';

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();

  return (
    <Flex alignItems={'center'} justifyContent={user ? 'space-between' : 'center'} mt={6} mb={12} width="100%">
      {user && (
        <NavLink to={'/'}>
           <Image
            alt='Home'
            w={10}
            h={10}
            src={'/ess-logo.png'}
          />
        </NavLink>
      )}

      {user && (
        <Flex alignItems={'center'} gap={4}>
          <NavLink to={`/${user?.loginUser?.username}`}>
            <RxAvatar size={30} />
          </NavLink>
          <NavLink to={`/chat`}>
            <BsFillChatDotsFill size={30} />
          </NavLink>
          <NavLink to={`/settings`}>
            <MdOutlineSettings size={30} />
          </NavLink>
          <Button
            onClick={logout}
            size={'m'} // Medium 크기
            sx={{
              padding: '8px', // 패딩 조정
              height: '40px', // 높이 조정
              display: 'flex', // Flexbox 사용
              alignItems: 'center', // 아이템 세로 중앙 정렬
              justifyContent: 'center' // 아이템 가로 중앙 정렬
            }}
            >
          <FiLogOut size={24}/>
          </Button>

        </Flex>
      )}
    </Flex>
  );
}

export default Header;
