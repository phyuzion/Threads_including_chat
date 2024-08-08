import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { Connection } from '@solana/web3.js';
import { Box, Flex, Text, useToast } from '@chakra-ui/react';
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

  const toast = useToast();
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

  const CopyAddress = async () => {
    const curAddress = publicKey?.toBase58();
    await navigator.clipboard.writeText(curAddress);
    toast({ title: 'Address Copied!', status: 'success' });
  };

  return (
    <Box>
      {connected && (
        <>
          <Flex alignItems="center" gap={[2, 4]} mt={[2,4]} >
            <Text fontSize={['xs', 'sm']} cursor="pointer" onClick={CopyAddress}>
              Address: {publicKey?.toBase58()?.substring(0,10) +'...'}
            </Text>
          </Flex>
          <Flex alignItems="center" gap={[2, 4]} mb={[2,4]}>
            <Text fontSize={['xs', 'sm']}>Balance: {balance !== null ? balance : 'Loading...'} SOL</Text>
          </Flex>
        </>
      )}
      <Box transform="scale(0.7)" transformOrigin="center">
        <WalletMultiButton />
      </Box>
    </Box>
  );
};

export default WalletComponent;
