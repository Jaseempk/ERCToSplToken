import {
  Connection,
  PublicKey,
  Keypair,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  mintTo,
  getOrCreateAssociatedTokenAccount,
  createMint,
  transfer,
} from "@solana/spl-token";
import * as fs from "fs";

let globalTokenAccountAddress: PublicKey;
function saveKeypairToFile(keypair: Keypair, filepath: string) {
  try {
    fs.writeFileSync(filepath, JSON.stringify(Array.from(keypair.secretKey)));
  } catch (error) {
    console.error("Failed to save keypair to file:", error);
  }
}

function loadKeypairFromFile(filepath: string): Keypair {
  try {
    const secretKeyString = fs.readFileSync(filepath, { encoding: "utf8" });
    const secretKey = new Uint8Array(JSON.parse(secretKeyString));
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    console.error("Error loading keypair from file:", error);
    throw error; // Re-throw the error or handle it as appropriate
  }
}

async function mintNewTokens(
  connection: Connection,
  payer: Keypair,
  mintAuthority: Keypair,
  amount: number
): Promise<PublicKey> {
  // Create a new mint
  const mint = await createMint(
    connection,
    payer,
    mintAuthority.publicKey,
    null,
    9 // Token decimals
  );

  // Create an associated token account for the mintAuthority
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    mintAuthority.publicKey
  );
  globalTokenAccountAddress = tokenAccount.address;

  // Mint new tokens to the mintAuthority's token account
  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    mintAuthority,
    amount,
    [] // Optionally, multi-signers
  );

  console.log(`Minted ${amount} tokens to ${tokenAccount.address.toBase58()}`);
  return mint; // Return the mint address for further operations
}

async function transferTokens(
  connection: Connection,
  payer: Keypair,
  fromMint: PublicKey,
  fromAuthority: Keypair,
  toPublicKey: PublicKey,
  amount: number
) {
  // Ensure the recipient has an associated token account
  const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    fromMint,
    toPublicKey
  );
  console.log(`Recipient Address: ${recipientTokenAccount.address}`);
  console.log(
    `Transferring from ${globalTokenAccountAddress.toBase58()} to ${toPublicKey.toBase58()}`
  );

  // Transfer tokens
  await transfer(
    connection,
    payer,
    globalTokenAccountAddress,
    recipientTokenAccount.address,
    fromAuthority,
    amount,
    [] // Optionally, multi-signers
  );

  console.log(`Transferred ${amount} tokens to ${toPublicKey.toBase58()}`);
}

async function main() {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  let payer;
  const mintAuthority = Keypair.generate();

  if (fs.existsSync("./payerKeypair.json")) {
    payer = loadKeypairFromFile("./payerKeypair.json");
  } else {
    payer = Keypair.generate();
    saveKeypairToFile(payer, "./payerKeypair.json");
    console.log(`payer-PubKey: ${payer.publicKey}`);
  }

  console.log(`Payer public-key: ${payer.publicKey.toBase58()}`);

  // Updated to use sendAndConfirmTransaction
  await sendAndConfirmTransaction(
    connection,
    new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: payer.publicKey, // Just sending SOL to itself to confirm
        lamports: 1, // Minimal amount, just to confirm the airdrop
      })
    ),
    [payer],
    {
      commitment: "confirmed",
    }
  );

  // Mint new tokens
  const mint = await mintNewTokens(
    connection,
    payer,
    mintAuthority,
    1000 * 10 ** 9 // 1000 tokens, considering decimals
  );

  // Transfer some of the minted tokens
  const recipientPublicKey = new PublicKey(
    "3E3T4xNKRDdnrsbAdX6TWFAMiJkZFQTjWLqvHANPNHaH"
  ); // Replace with actual recipient's public key
  await transferTokens(
    connection,
    payer,
    mint,
    mintAuthority,
    recipientPublicKey,
    500 * 10 ** 9 // Transfer 500 tokens, considering decimals
  );
}

main()
  .then(() => console.log("Finished successfully"))
  .catch((error) => console.error(error));
