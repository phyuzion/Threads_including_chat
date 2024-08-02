import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { Connection } from '@solana/web3.js';
import { Box, Flex, Text } from '@chakra-ui/react';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletComponent = () => {
  const endpoint = useMemo(() => 'https://solana-mainnet.g.alchemy.com/v2/m6sEEdz41_7K9bGEZoOIpEwPncqf6kHB', []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <WalletInterface />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const WalletInterface = () => {
  const { connect, publicKey, connected } = useWallet();
  const [balance, setBalance] = useState(null);

  const getBalance = useCallback(async () => {
    if (publicKey) {
      const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/m6sEEdz41_7K9bGEZoOIpEwPncqf6kHB');
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / 1e9); // Convert lamports to SOL
    }
  }, [publicKey]);

  useEffect(() => {
    if (connected) {
      getBalance();
    }
  }, [connected, getBalance]);

  return (
    <Box>
      {connected && (
        <>
          <Flex alignItems="center" gap={[2, 4]}>
            <Text fontSize={['xs', 'sm']}>Address: {publicKey.toBase58()}</Text>
          </Flex>
          <Flex alignItems="center" gap={[2, 4]}>
            <Text fontSize={['xs', 'sm']}>Balance: {balance !== null ? balance : 'Loading...'} SOL</Text>
          </Flex>
        </>
      )}
      <Box transform="scale(0.8)" transformOrigin="top left">
        <WalletMultiButton />
      </Box>
    </Box>
  );
};

export default WalletComponent;
