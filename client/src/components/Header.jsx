import { Box, Button, Flex, Image, Input, useColorMode, IconButton, Menu, MenuButton, MenuList, MenuItem, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import React, { useState, useRef } from 'react';
import { RxAvatar } from 'react-icons/rx';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import { GiHamburgerMenu } from 'react-icons/gi';
import { NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom.js';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { MdOutlineSettings } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
import useLogout from '../hooks/useLogout.js';
import useHashtagSearch from '../hooks/useHashtagSearch';

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const inputRef = useRef(null);
  const { searchHashtag } = useHashtagSearch();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchHashtag(searchQuery.trim());
      setSearchOpen(false);
      setSearchActive(true);
    }
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

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchOpen(false);
    setSearchActive(false);
    window.location.href = '/';
  };

  console.log('Header user -> ', user);
  return (
    <Flex alignItems={'center'} justifyContent={user ? 'space-between' : 'center'} mt={6} mb={12} width="100%">
      {user && (
        <NavLink to={'/'} onClick={handleHomeClick}>
          <Image alt='Home' w={10} h={10} src={'/ess-logo.png'} />
        </NavLink>
      )}

      {user && (
        <Flex alignItems={'center'} gap={4}>
          {searchOpen ? (
            <Flex alignItems={'center'} gap={2}>
              <InputGroup size='lg'>
                <Input
                  ref={inputRef}
                  placeholder='Search hashtag'
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
                  cursor='pointer'
                  onClick={() => setSearchOpen(false)}
                >
                  <AiOutlineClose size={24} />
                </InputRightElement>
              </InputGroup>
            </Flex>
          ) : searchActive ? (
            <Flex alignItems={'center'} gap={2} bg='gray.dark' borderRadius='md' height='40px' px={2}>
              <Flex alignItems='center' flex={1} pl={4}>
                <Text fontSize='lg' color='white' isTruncated>{'#'+searchQuery}</Text>
              </Flex>
              <IconButton
                aria-label='Clear search'
                icon={<AiOutlineClose size={24} />}
                onClick={handleClearSearch}
                variant='ghost'
                color='white'
              />
            </Flex>
          ) : null}
          <IconButton
            aria-label='Search'
            icon={<AiOutlineSearch size={30} />}
            onClick={searchOpen ? handleSearch : handleOpenSearch}
            variant='ghost'
          />
          <NavLink to={`/${user?.loginUser?.username}`}>
            <RxAvatar size={30} />
          </NavLink>
          <NavLink to={`/chat`}>
            <BsFillChatDotsFill size={30} />
          </NavLink>
          <Menu>
            <MenuButton as={IconButton} aria-label='Menu' icon={<GiHamburgerMenu size={30} />} variant='ghost' />
            <MenuList>
              <MenuItem icon={<FiLogOut size={20} />} onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      )}
    </Flex>
  );
}

export default Header;
