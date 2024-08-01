import { React, useEffect } from 'react';
import {
  Box,
  Container,
  useMediaQuery,
} from '@chakra-ui/react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';
import CreatePost from './components/CreatePost';
import Header from './components/Header';
import LogoutButton from './components/LogoutButton';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import UpdateProfilePage from './pages/UpdateProfilePage';
import UserPage from './pages/UserPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import setupApolloClient from "./apollo/apolloindex.js";
import SideBar from './components/SideBar';
import SuggestedUsers from './components/SuggestedUsers';

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const client = setupApolloClient();
  const [isLargerThan800px] = useMediaQuery('(min-width: 800px)');

  useEffect(() => {
    // after logout, send to auth
    if (!user && pathname !== '/auth') {
      navigate('/auth', { replace: true });
    }
  }, [user, pathname, navigate]);

  return (
    <Box
      position={'relative'}
      w={'full'}
      maxW="1000px"
      mx="auto"
    >
      <Box px={4}>
        <Header />
      </Box>
      <Box w={'full'} display="flex" px="8%">
        <Box flex={isLargerThan800px ? 8 : 1}>
          <Container maxW={'800px'} mx="auto">
            {!isLargerThan800px && <SideBar />}
            <Routes>
              <Route
                path='/'
                element={
                  user ? (
                    <>
                      <HomePage /> <CreatePost />{' '}
                    </>
                  ) : (
                    <Navigate to={'/auth'} />
                  )
                }
              />
              <Route path='/auth' element={!user ? <AuthPage /> : <Navigate to={'/'} />} />
              <Route path='/edit-profile' element={<UpdateProfilePage />} />
              <Route
                path='/:username'
                element={
                  user ? (
                    <>
                      <UserPage />{' '}
                    </>
                  ) : (
                    <Navigate to={'/auth'} />
                  )
                }
              />
              <Route path='/:username/post/:postId' element={<PostPage />} />
              <Route path='/chat' element={user ? <ChatPage /> : <Navigate to={'/auth'} />} />
              <Route path='/settings' element={user ? <SettingsPage /> : <Navigate to={'/auth'} />} />
            </Routes>
          </Container>
        </Box>
        {isLargerThan800px && (
          <Box pl={5} flex={2} display={user && pathname !== '/auth' ? 'block' : 'none'}>
            <SuggestedUsers />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default App;
