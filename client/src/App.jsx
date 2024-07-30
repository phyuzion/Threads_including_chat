import { useEffect } from 'react';
import { Box, Container } from '@chakra-ui/react';
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

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const client = setupApolloClient();

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
      <Box w={'full'}>
        <Container maxW={'800px'} mx="auto">
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
                    <UserPage /> <CreatePost />{' '}
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
    </Box>
  );
}

export default App;
