import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  useColorMode,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  InputRightElement,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
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

  const iconSize = useBreakpointValue({ base: 25, md: 30, lg: 30 });

  console.log('Header user -> ', user);
  return (
    <Flex alignItems={'center'} justifyContent={user ? 'space-between' : 'center'} mt={[2, 3, 4]} px={['2%', '3%', '5%']} mb={[2, 4, 6]} width="100%">
      {user && (
        <NavLink to={'/'} onClick={handleHomeClick}>
          <Image alt='Home' w={[6, 8, 10]} h={[6, 8, 10]} src={'/ess-logo.png'} />
        </NavLink>
      )}

      {user && (
        <Flex alignItems={'center'} gap={0} flex={1} justifyContent="flex-end">
          {searchOpen ? (
            <Flex alignItems={'center'} pl={2} gap={1} flex={1} maxW="300px">
              <InputGroup size='md' flex={1}>
                <Input
                  ref={inputRef}
                  placeholder='Search hashtag'
                  size='md'
                  height={['30px', '35px', '40px']}
                  borderColor='white'
                  borderWidth='2px'
                  borderRadius='md'
                  _placeholder={{ color: 'gray.500' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  fontSize={['sm', 'md', 'lg']}
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
                  <AiOutlineClose size={iconSize} />
                </InputRightElement>
              </InputGroup>
            </Flex>
          ) : searchActive ? (
            <Flex alignItems={'center'} gap={3} bg='gray.dark' borderRadius='md' height={['25px', '30px', '35px']} px={2}>
              <Flex alignItems='center' flex={1} pl={[2, 3, 4]}>
                <Text fontSize={['sm', 'md', 'lg']} color='white' isTruncated>{'#'+searchQuery}</Text>
              </Flex>
              <IconButton
                aria-label='Clear search'
                icon={<AiOutlineClose size={iconSize} />}
                onClick={handleClearSearch}
                variant='ghost'
                color='white'
              />
            </Flex>
          ) : null}
          <IconButton
            aria-label='Search'
            icon={<AiOutlineSearch size={iconSize} />}
            onClick={searchOpen ? handleSearch : handleOpenSearch}
            variant='ghost'
            size='sm'
            mx={[0.5, 1, 1.5]}
          />
          <NavLink to={`/${user?.loginUser?.username}`}>
            <IconButton
              aria-label='User Profile'
              icon={<RxAvatar size={iconSize} />}
              variant='ghost'
              size='sm'
              mx={[0.5, 1, 1.5]}
            />
          </NavLink>
          <NavLink to={`/chat`}>
            <IconButton
              aria-label='Chat'
              icon={<BsFillChatDotsFill size={iconSize} />}
              variant='ghost'
              size='sm'
              mx={[0.5, 1, 1.5]}
            />
          </NavLink>
          <Menu>
            <MenuButton as={IconButton} aria-label='Menu' icon={<GiHamburgerMenu size={iconSize} />} variant='ghost' size='sm' mx={1} />
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
