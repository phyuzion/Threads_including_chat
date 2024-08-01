import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { RecoilRoot } from 'recoil';
import { SocketContextProvider } from './context/SocketContext.jsx';

import { ApolloProvider } from '@apollo/client';
import setupApolloClient from './apollo/apolloindex.js';

const styles = {
  global: (props) => ({
    body: {
      color: mode('gray.800', 'WhiteAlpha.900')(props),
      bg: mode('white', 'transparent')(props),
      backgroundImage: "url('/ess-bg.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      fontSize: ['sm', 'md', 'lg'], // 글자 크기
      padding: [2, 4, 6], // 패딩
    },
  }),
};

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

const colors = {
  gray: {
    light: '#616161',
    dark: '#1e1e1e',
  },
};

const theme = extendTheme({ config, styles, colors });

const ThemeApp = () => {
  return (
    <ApolloProvider client={setupApolloClient()}>
      <RecoilRoot>
        <BrowserRouter>
          <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <App />
          </ChakraProvider>
        </BrowserRouter>
      </RecoilRoot>
    </ApolloProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<ThemeApp />);
