// // metadataService.ts    
// // Fetch NFT metadata & report details
// import axios from 'axios';
// import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
// import { Connection, clusterApiUrl, PublicKey, Keypair } from '@solana/web3.js';

// // 🔗 Connect to Solana Devnet
// const rpcUrl = clusterApiUrl('devnet'); // ✅ Define rpcUrl
// const connection = new Connection(rpcUrl, 'confirmed');

// // 🔑 Load Phantom wallet from .env
// if (!process.env.PRIVATE_KEY) {
//     throw new Error('PRIVATE_KEY environment variable is not defined');
// }
// const secretKey = Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY));
// const wallet = Keypair.fromSecretKey(secretKey);

// // 🏗️ Initialize Metaplex
// const metaplex = Metaplex.make(connection)
//   .use(keypairIdentity(wallet));
// /**
//  * Fetches metadata from IPFS/Arweave using the NFT mint address.
//  * @param mintAddress - The mint address of the NFT.
//  * @returns Metadata JSON object.
//  */
// export const getNFTMetadata = async (mintAddress: string) => {
//   try {
//     const nft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(mintAddress) });
//     const metadataUri = nft.uri;

//     const response = await axios.get(metadataUri);
//     return response.data; // Metadata containing file link, name, etc.
//   } catch (error) {
//     console.error('Error fetching NFT metadata:', error);
//     throw error;
//   }
// };

// /**
//  * Directly fetches metadata from a given IPFS/Arweave URL.
//  * Useful for cases where the CID or URL is already known.
//  * @param metadataUri - The IPFS/Arweave URL.
//  * @returns Metadata JSON object.
//  */
// export const fetchMetadataFromURI = async (metadataUri: string) => {
//   try {
//     const response = await axios.get(metadataUri);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching metadata from URI:', error);
//     throw error;
//   }
// };
