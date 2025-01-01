import React, { useState } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';

const PROGRAM_ID = new PublicKey("3cPFHxRsxZLhzG66g4j42fqqh7tzEkENfwFnixcH53di");
const CLUSTER_URL = "https://api.devnet.solana.com";

const AdminProgram = () => {
    const { publicKey, connected, signTransaction } = useWallet();
    const [status, setStatus] = useState('');

    const initializeAdmin = async () => {
        if (!connected || !publicKey) {
            setStatus('Please connect your wallet first.');
            return;
        }

        try {
            setStatus('Initializing admin...');

            const connection = new Connection(CLUSTER_URL);

            // Generate PDA for the admin account
            const [adminPda, adminBump] = await PublicKey.findProgramAddress(
                [Buffer.from('admin')],
                PROGRAM_ID
            );

            console.log('Admin PDA:', adminPda.toBase58());

            // Create transaction to invoke the program
            const transaction = new Transaction().add({
                keys: [
                    { pubkey: adminPda, isSigner: false, isWritable: true },
                    { pubkey: publicKey, isSigner: true, isWritable: true },
                    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
                ],
                programId: PROGRAM_ID,
                data: Buffer.from(Uint8Array.of(0, ...new Uint8Array([10]))) // Instruction data: initializeAdmin with fee 10
            });

            console.log('Transaction prepared:', transaction);

            // Sign and send the transaction
            const signedTransaction = await signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTransaction.serialize());

            await connection.confirmTransaction(signature);

            setStatus(`Admin initialized! Transaction: ${signature}`);
            console.log('Transaction signature:', signature);
        } catch (error) {
            console.error('Error initializing admin:', error);
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <Box p="4">
            <Box mb="4">
                <Text fontSize="lg" fontWeight="bold">
                    Admin Program Interaction (Native Solana)
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
