// Header.jsx

import {
  Box,
  Flex,
  Image,
  Input,
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
import { FiLogOut } from 'react-icons/fi';
import useLogout from '../hooks/useLogout.js';
import useHashtagSearch from '../hooks/useHashtagSearch';

function Header() {
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

  const iconSize = useBreakpointValue({ base: 20, md: 24, lg: 24 }); // 아이콘 크기 조정
  const iconColor = "#4A5568"; // 기본 아이콘 색상

  return (
    <Flex
      alignItems="center"
      justifyContent={user ? 'space-between' : 'center'}
      px={['3%', '5%', '7%']}
      py={3}
      bg="white"
      boxShadow="sm"
    >
      {user && (
        <NavLink to="/" onClick={handleHomeClick}>
          <Image alt="Home" w={[6, 8, 9]} h={[6, 8, 9]} src={'/ess-logo.png'} />
        </NavLink>
      )}

      {user && (
        <Flex alignItems="center" gap={0} flex={1} justifyContent="flex-end">
          {searchOpen ? (
            <Flex alignItems="center" pl={2} gap={2} flex={1} maxW="250px">
              <InputGroup size="md" flex={1}>
                <Input
                  ref={inputRef}
                  placeholder="Search hashtag"
                  size="sm"
                  height="35px"
                  borderColor="gray.300"
                  borderWidth="1px"
                  borderRadius="full"
                  _placeholder={{ color: 'gray.500' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  fontSize="sm"
                />
                <InputRightElement
                  width="2.5rem"
                  height="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  onClick={() => setSearchOpen(false)}
                >
                  <AiOutlineClose size={iconSize} color={iconColor} />
                </InputRightElement>
              </InputGroup>
            </Flex>
          ) : searchActive ? (
            <Flex alignItems="center" gap={3} bg="gray.100" borderRadius="full" height="35px" px={3}>
              <Text fontSize="sm" color="gray.600" isTruncated>{'#' + searchQuery}</Text>
              <IconButton
                aria-label="Clear search"
                icon={<AiOutlineClose size={iconSize} />}
                onClick={handleClearSearch}
                variant="ghost"
                color={iconColor}
                size="sm"
              />
            </Flex>
          ) : null}
          <IconButton
            aria-label="Search"
            icon={<AiOutlineSearch size={iconSize} color={iconColor} />}
            onClick={searchOpen ? handleSearch : handleOpenSearch}
            variant="ghost"
            size="sm"
            mx={[0.5, 1, 1.5]}
          />
          <NavLink to={`/${user?.loginUser?.username}`}>
            <IconButton
              aria-label="User Profile"
              icon={<RxAvatar size={iconSize} color={iconColor} />}
              variant="ghost"
              size="sm"
              mx={[0.5, 1, 1.5]}
            />
          </NavLink>
          <NavLink to="/chat">
            <IconButton
              aria-label="Chat"
              icon={<BsFillChatDotsFill size={iconSize} color={iconColor} />}
              variant="ghost"
              size="sm"
              mx={[0.5, 1, 1.5]}
            />
          </NavLink>
          <Menu>
            <MenuButton as={IconButton} aria-label="Menu" icon={<GiHamburgerMenu size={iconSize} color={iconColor} />} variant="ghost" size="sm" mx={1} />
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
