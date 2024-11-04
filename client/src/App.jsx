import { React, useEffect } from 'react';
import { Box, Container, useMediaQuery } from '@chakra-ui/react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';
import CreatePost from './components/CreatePost';
import Header from './components/Header';
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
import MessageContainer from './components/MessageContainer';

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const client = setupApolloClient();
  const [isLargerThan800px] = useMediaQuery('(min-width: 800px)');

  useEffect(() => {
    // 로그아웃 시 '/auth' 페이지로 이동
    if (!user && pathname !== '/auth') {
      navigate('/auth', { replace: true });
    }
  }, [user, pathname, navigate]);

  return (
    <Box position={'relative'} w={'full'} maxW="100vw" mx="auto" minH="100vh" bg="transparent">
      {/* '/auth' 경로에서는 헤더를 렌더링하지 않음 */}
      {user && pathname !== '/auth' && (
        <Box position="fixed" top={0} left={0} right={0} zIndex={10}>
          <Header />
        </Box>
      )}
      <Box
        w={'full'}
        display="flex"
        px={pathname === '/auth' ? 0 : '5%'} // auth 경로에서는 padding 제거
        pt={pathname === '/auth' ? 0 : ['40px', '50px', '60px']}
        overflow={pathname === '/auth' ? 'hidden' : 'auto'} // auth 경로에서 스크롤 방지
      >
        <Box flex={isLargerThan800px ? 8 : 1}>
          <Container maxW={pathname === '/auth' ? 'full' : '750px'} mx="auto" p={0}>
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
              <Route path='/chat/:username' element={user ? <MessageContainer /> : <Navigate to={'/auth'} />} />
              <Route path='/settings' element={user ? <SettingsPage /> : <Navigate to={'/auth'} />} />
            </Routes>
          </Container>
        </Box>
        {isLargerThan800px && pathname !== '/auth' && (
          <Box pl={5} flex={2} display={user ? 'block' : 'none'}>
            <SuggestedUsers />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default App;
