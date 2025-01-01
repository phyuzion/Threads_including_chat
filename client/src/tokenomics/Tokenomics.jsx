import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Sidebar } from './components/index.jsx';
import { routes } from './RoutesConfig.jsx';
import { ContextProvider, useStateContext } from './contexts/ContextProvider.jsx';
import './Tokenomics.css';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';


import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';


const endpoint = 'https://solana-mainnet.g.alchemy.com/v2/m6sEEdz41_7K9bGEZoOIpEwPncqf6kHB';
const wallets = [new PhantomWalletAdapter()];


const TokenomicsContent = () => {
  const { activeMenu } = useStateContext();
  const [menuInitialized, setMenuInitialized] = useState(false);

  const user = useRecoilValue(userAtom);

  if (!user) {
    // 인증되지 않은 경우 /auth로 리다이렉트
    return <Navigate to="/auth" />;
  }

  // activeMenu가 초기 상태에서 제대로 설정되도록 보장
  useEffect(() => {
    setMenuInitialized(true);
  }, []);

  if (!menuInitialized) return null; // 초기화 전까지는 렌더링하지 않음

  return (
    <div className="flex relative dark:bg-main-dark-bg">
      {/* Sidebar */}
      {activeMenu ? (
        <div className="w-56 fixed sidebar dark:bg-secondary-dark-bg bg-white">
          <Sidebar />
        </div>
      ) : (
        <div className="w-0 dark:bg-secondary-dark-bg">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
          activeMenu ? 'md:ml-56' : 'flex-2'
        }`}
      >
        <Navbar />
        <Routes>
          {/* Default Redirect */}
          <Route path="/tokenomics" element={<Navigate to="/tokenomics/summary" />} />
          {/* Dynamic Routes */}
          {routes.map((category) =>
            category.links.map((route, index) => (
              <Route key={index} path={'tokenomics/'+route.path} element={route.component} />
            ))
          )}
        </Routes>
      </div>
    </div>
  );
};

const Tokenomics = () => {
  return (
    <ContextProvider>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={false}>
          <WalletModalProvider>
          <TokenomicsContent />

          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ContextProvider>
  );
};

export default Tokenomics;
