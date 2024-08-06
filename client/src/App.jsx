import { React, useEffect } from 'react';
import { Box, Container, useMediaQuery } from '@chakra-ui/react';
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
import MessageContainer from './components/MessageContainer'; // MessageContainer import

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
    <Box position={'relative'} w={'full'} maxW='1000px' mx='auto'>
      <Box position="fixed" top={0} left={0} right={0} zIndex={10} >
        <Header />
      </Box>
      <Box w={'full'} display='flex' px='5%' pt={['40px', '50px', '60px']}>
        <Box flex={isLargerThan800px ? 8 : 1}>
          <Container maxW={'750px'} mx="auto">
            {(!isLargerThan800px && pathname !== '/auth') && <SideBar />}
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
              <Route path='/chat/:username' element={user ? <MessageContainer /> : <Navigate to={'/auth'} />} /> {/* 추가된 부분 */}
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
