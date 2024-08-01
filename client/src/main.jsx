import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { extendTheme } from '@chakra-ui/theme-utils';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { RecoilRoot } from 'recoil';
import { SocketContextProvider } from './context/SocketContext.jsx';

import { ApolloProvider } from '@apollo/client';
import setupApolloClient from './apollo/apolloindex.js';

const styles = (bgSize) => ({
  global: (props) => ({
    body: {
      color: mode('gray.800', 'WhiteAlpha.900')(props),
      bg: mode('white', 'transparent')(props),
      backgroundImage: "url('/ess-bg.png')",
      backgroundSize: bgSize,
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
    },
  }),
});

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

const ThemeApp = () => {
  const [bgSize, setBgSize] = useState('100% auto');

  useEffect(() => {
    const updateBgSize = () => {
      const ratio = window.innerHeight / window.innerWidth;
      if (ratio > 1) {
        setBgSize(`${ratio * 100}% auto`);
      } else {
        setBgSize('100% auto');
      }
    };

    window.addEventListener('resize', updateBgSize);
    updateBgSize();

    return () => window.removeEventListener('resize', updateBgSize);
  }, []);

  const theme = extendTheme({ config, styles: styles(bgSize), colors });

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
