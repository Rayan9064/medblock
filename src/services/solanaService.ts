// solanaService.ts  
// Solana connection, NFT minting, smart contract methods
import { Metaplex, keypairIdentity, bundlrStorage } from '@metaplex-foundation/js';
import { Connection, clusterApiUrl, Keypair, PublicKey } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config();


// 🔗 Connect to Solana Devnet
const rpcUrl = clusterApiUrl('devnet'); // ✅ Define rpcUrl
const connection = new Connection(rpcUrl, 'confirmed');

// 🔑 Load Phantom wallet from .env
const secretKey = Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY));
const wallet = Keypair.fromSecretKey(secretKey);

// 🏗️ Initialize Metaplex
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(wallet))
  .use(bundlrStorage({
    address: 'https://devnet.bundlr.network',
    providerUrl: rpcUrl, // ✅ Now it has a value
    timeout: 60000,
  }));

export interface MedicalNFTMetadata {
  patientName: string;
  doctorName: string;
  date: string;
  reportName: string;
  imageUrl: string;
  reportUrl: string;
}

export const mintMedicalNFT = async (metadata: MedicalNFTMetadata) => {
  try {
    // 🏥 Medical Report Metadata
    const medicalMetadata = {
      name: metadata.reportName,
      symbol: "MEDNFT",
      description: `Patient: ${metadata.patientName} - Confidential Medical Record`,
      image: metadata.imageUrl,
      attributes: [
        { trait_type: "Patient", value: metadata.patientName },
        { trait_type: "Doctor", value: metadata.doctorName },
        { trait_type: "Date", value: metadata.date }
      ],
      properties: {
        files: [{
          uri: metadata.reportUrl,
          type: "application/pdf"
        }]
      }
    };

    console.log("⏳ Uploading Metadata to IPFS...");
    const { uri } = await metaplex.nfts().uploadMetadata(medicalMetadata);
    console.log("✅ Metadata uploaded to IPFS:", uri);

    console.log("⏳ Minting Medical Report NFT...");
    const { nft } = await metaplex.nfts().create({
      uri: uri,
      name: medicalMetadata.name,
      sellerFeeBasisPoints: 0,
    });

    console.log("🎉 Medical Report NFT Minted Successfully!");
    console.log("🔗 NFT Mint Address:", nft.address.toString());
    console.log(`🔍 View on Solana Explorer: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`);

    return nft.address.toString();
  } catch (error) {
    console.error("❌ Error minting NFT:", error);
    throw error;
  }
};

export const getNFTMetadata = async (mintAddress: string) => {
  try {
    const nft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(mintAddress) });
    return nft.json;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    throw error;
  }
};

// 🚀 Run the minting function
// mintMedicalNFT();