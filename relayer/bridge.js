require('dotenv').config();
const { ethers } = require('ethers');
const { Connection, PublicKey, Keypair, clusterApiUrl, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { transfer } = require('@solana/spl-token');
import { ERC20LockABI } from "./abi";

// Ethereum setup
const ethereumProvider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);
const ethereumWallet = new ethers.Wallet(process.env.ETH_PRIVATE_KEY, ethereumProvider);
const erc20LockContractAddress = '0x70bec38C35b4dD2B89ACD462E42eC5F544acC357';
const erc20LockContract = new ethers.Contract(erc20LockContractAddress, ERC20LockABI, ethereumWallet);

// Solana setup
const solanaConnection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const solanaWallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY)));
const recipientPublicKey = new PublicKey('3E3T4xNKRDdnrsbAdX6TWFAMiJkZFQTjWLqvHANPNHaH');

// Listen for the `tokenBridgeDone` event
erc20LockContract.on('tokenBridgeDone', async (sender, destToken, chainId, ercAmount) => {
    console.log(`Event received: ${ercAmount} tokens from ${sender}`);

    // Assuming `transferTokens` is already correctly implemented to handle the transfer
    try {
        const tx = await transferTokens(solanaConnection, solanaWallet, recipientPublicKey, ercAmount);
        console.log(`Transfer successful: ${tx}`);
    } catch (error) {
        console.error(`Failed to transfer tokens on Solana: ${error}`);
    }
});

// Transfer tokens on Solana
async function transferTokens(connection, payer, recipientPublicKey, amount) {
    // Assuming you have a function `getOrCreateAssociatedTokenAccount` to find or create a token account
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer.publicKey, recipientPublicKey);

    const transaction = new Transaction().add(
        transfer({
            source: globalTokenAccountAddress,
            destination: recipientTokenAccount.address,
            amount: amount,
            owner: payer.publicKey,
        })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);
    return signature;
}