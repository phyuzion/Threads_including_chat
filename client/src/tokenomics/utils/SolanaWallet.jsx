import React, { useCallback, useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Box, Flex, Text } from '@chakra-ui/react';
import '@solana/wallet-adapter-react-ui/styles.css';

import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const ELX_MINT_ADDRESS = '32ANuQfyYmsKLoyxcKjBqoBNYGf3u8jZUZdJp761PAH1'; // ELX 민트 주소

const SolanaWallet = () => {

  return (
          <WalletInterface />
  );
};

const WalletInterface = () => {
  const { connect, publicKey, connected } = useWallet();
  const [solBalance, setSolBalance] = useState(null);
  const [elxBalance, setElxBalance] = useState(null);

  const getBalances = useCallback(async () => {
    if (publicKey) {
      const connection = new Connection('https://solana-devnet.g.alchemy.com/v2/m6sEEdz41_7K9bGEZoOIpEwPncqf6kHB');

      // SOL 잔액 조회
      const sol = await connection.getBalance(publicKey);
      setSolBalance(sol / 1e9); // Lamports를 SOL로 변환

      // ELX 토큰 잔액 조회
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        mint: new PublicKey(ELX_MINT_ADDRESS),
      });

      const elxAccount = tokenAccounts.value[0]?.account.data.parsed.info.tokenAmount.uiAmount || 0;
      setElxBalance(elxAccount);
    }
  }, [publicKey]);

  useEffect(() => {
    if (connected) {
      getBalances();
    }
  }, [connected, getBalances]);

  return (
    <Box>
      {connected && (
        <>
          <Flex alignItems="center" gap={[2, 4]}>
            <Text fontSize={['xs', 'sm']}>Address: {publicKey.toBase58()}</Text>
          </Flex>
          <Flex alignItems="center" gap={[2, 4]}>
            <Text fontSize={['xs', 'sm']}>SOL Balance: {solBalance !== null ? solBalance : 'Loading...'} SOL</Text>
          </Flex>
          <Flex alignItems="center" gap={[2, 4]}>
            <Text fontSize={['xs', 'sm']}>ELX Balance: {elxBalance !== null ? elxBalance : 'Loading...'} ELX</Text>
          </Flex>
        </>
      )}
      <Box transform="scale(0.8)" transformOrigin="top left">
        <WalletMultiButton />
      </Box>
    </Box>
  );
};

export default SolanaWallet;
