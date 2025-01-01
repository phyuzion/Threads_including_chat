import React, { useCallback, useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Box, Flex, Text, Spacer } from '@chakra-ui/react';
import '@solana/wallet-adapter-react-ui/styles.css';

import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

const ELX_MINT_ADDRESS = 'BQahSAUsvEkMS46WX2qktMTP3qutuECxNT2uWxRjZTF2'; // ELX 민트 주소

const SolanaWallet = () => {
  return <WalletInterface />;
};

const WalletInterface = () => {
  const { publicKey, connected } = useWallet();
  const [solBalance, setSolBalance] = useState(null);
  const [elxBalance, setElxBalance] = useState(null);

  const getBalances = useCallback(async () => {
    if (publicKey) {
      const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/m6sEEdz41_7K9bGEZoOIpEwPncqf6kHB');

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

  // 주소를 짧게 표시하는 함수
  const shortenAddress = (address) => {
    if (!address) return '';
    return address.length > 8 ? `${address.slice(0, 8)}...` : address;
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      p={4}
      border="1px solid #e2e8f0"
      borderRadius="md"
      boxShadow="sm"
      gap={4} // Flex 항목 간의 간격
    >
      <Box>
        {connected ? (
          <Flex direction="column" gap={1}>
            <Text fontSize="xs" fontWeight="bold">SOL: {solBalance !== null ? `${solBalance} SOL` : 'Loading...'}</Text>
            <Text fontSize="xs" fontWeight="bold">ELX: {elxBalance !== null ? `${elxBalance} ELX` : 'Loading...'}</Text>
          </Flex>
        ) : (
          <Text fontSize="xs" color="gray.500">
            Connect your wallet to see details
          </Text>
        )}
      </Box>
      <Spacer />
      <Box>
        <WalletMultiButton />
      </Box>
    </Flex>
  );
};

export default SolanaWallet;
