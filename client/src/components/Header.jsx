import { Box, Button, Flex, Image, Input, useColorMode, IconButton, Menu, MenuButton, MenuList, MenuItem, InputGroup, InputRightElement } from '@chakra-ui/react';
import React, { useState, useRef } from 'react';
import { RxAvatar } from 'react-icons/rx';
import { AiFillHome, AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import { GiHamburgerMenu } from 'react-icons/gi';
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  const handleSearch = () => {
    console.log(searchQuery);
    // iss.song searchQuery value is search value
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleOpenSearch = () => {
    setSearchOpen(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100); 
  };

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
          {!searchOpen ? (
            <IconButton
              aria-label='Search'
              icon={<AiOutlineSearch size={30} />}
              onClick={handleOpenSearch}
              variant='ghost'
            />
          ) : (
            <Flex alignItems={'center'} gap={2}>
              <InputGroup size='lg'>
                <Input
                  ref={inputRef}
                  placeholder='Search...'
                  size='lg'
                  height='40px'
                  borderColor='white'
                  borderWidth='2px'
                  borderRadius='md'
                  _placeholder={{ color: 'gray.500' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  fontSize='lg'
                />
                <InputRightElement
                  width='3rem'
                  height='100%'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  pointerEvents='none'
                >
                  <AiOutlineSearch size={24} />
                </InputRightElement>
              </InputGroup>
              <IconButton
                aria-label='Close'
                icon={<AiOutlineClose size={30} />}
                onClick={() => setSearchOpen(false)}
                variant='ghost'
              />
            </Flex>
          )}
          <NavLink to={`/${user?.loginUser?.username}`}>
            <RxAvatar size={30} />
          </NavLink>
          <NavLink to={`/chat`}>
            <BsFillChatDotsFill size={30} />
          </NavLink>
          <Menu>
            <MenuButton as={IconButton} aria-label='Menu' icon={<GiHamburgerMenu size={30} />} variant='ghost' />
            <MenuList>
              <NavLink to='/settings'>
                <MenuItem icon={<MdOutlineSettings size={20} />}>Settings</MenuItem>
              </NavLink>
              <MenuItem icon={<FiLogOut size={20} />} onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      )}
    </Flex>
  );
}

export default Header;
