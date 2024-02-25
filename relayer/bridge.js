require('dotenv').config();
const { ethers } = require('ethers');
const { Connection, PublicKey, Keypair, clusterApiUrl, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { transfer } = require('@solana/spl-token');

// Ethereum setup
const ethereumProvider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const ethereumWallet = new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY, ethereumProvider);
const erc20LockContractAddress = 'YOUR_ERC20LOCK_CONTRACT_ADDRESS';
const erc20LockAbi = [];
const erc20LockContract = new ethers.Contract(erc20LockContractAddress, erc20LockAbi, ethereumWallet);

// Solana setup
const solanaConnection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const solanaWallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY)));
const recipientPublicKey = new PublicKey('RECIPIENT_PUBLIC_KEY_ON_SOLANA');

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