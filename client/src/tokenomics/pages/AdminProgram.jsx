import React, { useCallback, useState } from 'react';
import { PublicKey, SystemProgram, Keypair, Connection } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import idl from '../idl/essentiallux.json';
import { useWallet } from '@solana/wallet-adapter-react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';

const ELX_MINT_ADDRESS = '32ANuQfyYmsKLoyxcKjBqoBNYGf3u8jZUZdJp761PAH1';
const PROGRAM_ID = new PublicKey('3cPFHxRsxZLhzG66g4j42fqqh7tzEkENfwFnixcH53di');

const AdminProgram = () => {
  const { publicKey, connected } = useWallet();
  const [status, setStatus] = useState('');
  const connection = new Connection('https://solana-devnet.g.alchemy.com/v2/m6sEEdz41_7K9bGEZoOIpEwPncqf6kHB');

  const initializeAdmin = useCallback(async () => {
    if (!connected || !publicKey) {
      setStatus('Please connect your wallet first.');
      return;
    }

    try {
      console.log('Initializing admin...');

      // Anchor provider 설정
      const provider = new anchor.AnchorProvider(connection, window.solana, anchor.AnchorProvider.defaultOptions());
      anchor.setProvider(provider);

      console.log('Provider and connection set up.');
      console.log("IDL Address:", idl.address);
      console.log("PROGRAM_ID:", PROGRAM_ID.toString());

      console.log("IDL Object:", idl);
      console.log("IDL Address:", idl.address);
      console.log("IDL Instructions:", idl.instructions);
      console.log("IDL Accounts:", idl.accounts);


      // 프로그램 초기화 (권장 방식, 2개의 인자만 사용)
      const program = new anchor.Program<typeof idl>(idl, provider);

      console.log('Program initialized using provider.');

      const feeAccount = Keypair.generate();
      const adminInfo = Keypair.generate();

      console.log('Generated FeeAccount and AdminInfo keys.');

      const tx = await program.methods
        .initializeAdmin(publicKey, new PublicKey(ELX_MINT_ADDRESS))
        .accounts({
          adminInfo: adminInfo.publicKey,
          feeAccount: feeAccount.publicKey,
          user: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([adminInfo, feeAccount])
        .rpc();

      setStatus(`Admin initialized! Transaction: ${tx}`);
      console.log('Admin Info Account:', adminInfo.publicKey.toBase58());
      console.log('Fee Account:', feeAccount.publicKey.toBase58());
    } catch (error) {
      console.error('Error initializing admin:', error);
      setStatus(`Error: ${error.message}`);
    }
  }, [connected, publicKey, connection]);

  return (
    <Box p="4">
      <Box mb="4">
        <Text fontSize="lg" fontWeight="bold">
          Admin Program Interaction
        </Text>
      </Box>

      {connected ? (
        <Box mb="4" p="4" border="1px solid #e0e0e0" borderRadius="8px">
          <Flex direction="column" gap="2">
            <Text fontSize="sm">Wallet Address: {publicKey.toBase58()}</Text>
          </Flex>
        </Box>
      ) : (
        <Text fontSize="sm" color="red.500">
          Please connect your wallet to interact with the program.
        </Text>
      )}

      <Button
        colorScheme="teal"
        onClick={initializeAdmin}
        isDisabled={!connected}
        mb="4"
      >
        Initialize Admin
      </Button>

      {status && <Text fontSize="sm" color="gray.600">{status}</Text>}
    </Box>
  );
};

export default AdminProgram;
