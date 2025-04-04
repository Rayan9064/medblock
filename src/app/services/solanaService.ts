// // solanaService.ts  
// // Solana connection, NFT minting, smart contract methods
// import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
// import { Connection, clusterApiUrl, Keypair, PublicKey } from '@solana/web3.js';
// import axios from "axios";

// // 🔗 Connect to Solana Devnet
// const rpcUrl = clusterApiUrl('devnet'); // ✅ Define rpcUrl
// const connection = new Connection(rpcUrl, 'confirmed');

// // Convert secret key string to Uint8Array
// // Use a fallback or generate a new keypair for development if the env var is not set
// let wallet: Keypair;
// if (!process.env.NEXT_PUBLIC_SOLANA_SECRET_KEY) {
//   console.warn('NEXT_PUBLIC_SOLANA_SECRET_KEY not defined, generating a new keypair for development');
//   wallet = Keypair.generate(); // Generate a new keypair for development
// } else {
//   try {
//     const secretKeyArray = JSON.parse(process.env.NEXT_PUBLIC_SOLANA_SECRET_KEY);
//     wallet = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));
//   } catch (error) {
//     console.error('Failed to parse NEXT_PUBLIC_SOLANA_SECRET_KEY, generating a new keypair for development');
//     wallet = Keypair.generate(); // Fallback to generated keypair
//   }
// }

// // 🏗️ Initialize Metaplex
// const metaplex = Metaplex.make(connection)
//   .use(keypairIdentity(wallet));

// export interface MedicalNFTMetadata {
//   patientName: string;
//   doctorName: string;
//   date: string;
//   reportName: string;
//   imageUrl: string;
//   reportUrl: string;
// }

// interface MetadataAttribute {
//   trait_type: string;
//   value: string;
// }

// export const mintMedicalNFT = async (metadata: MedicalNFTMetadata) => {
//   try {
//     // 🏥 Medical Report Metadata
//     const medicalMetadata = {
//       name: metadata.reportName,
//       symbol: "MEDNFT",
//       description: `Patient: ${metadata.patientName} - Confidential Medical Record`,
//       image: metadata.imageUrl,
//       attributes: [
//         { trait_type: "Patient", value: metadata.patientName },
//         { trait_type: "Doctor", value: metadata.doctorName },
//         { trait_type: "Date", value: metadata.date }
//       ],
//       properties: {
//         files: [{
//           uri: metadata.reportUrl,
//           type: "application/pdf"
//         }]
//       }
//     };

//     console.log("⏳ Uploading Metadata to IPFS...");
//     const { uri } = await metaplex.nfts().uploadMetadata(medicalMetadata);
//     console.log("✅ Metadata uploaded to IPFS:", uri);

//     console.log("⏳ Minting Medical Report NFT...");
//     const { nft } = await metaplex.nfts().create({
//       uri: uri,
//       name: medicalMetadata.name,
//       sellerFeeBasisPoints: 0,
//     });

//     console.log("🎉 Medical Report NFT Minted Successfully!");
//     console.log("🔗 NFT Mint Address:", nft.address.toString());
//     console.log(`🔍 View on Solana Explorer: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`);

//     return nft.address.toString();
//   } catch (error) {
//     console.error("❌ Error minting NFT:", error);
//     throw error;
//   }
// };

// // const walletAddress = "GGJAXBBugajRsrovdqYiDtevoSo9RUwhJHTPUgUvTg3r";

// export const fetchMedicalReports = async (walletAddress: string) => {
//   try {
//     const owner = new PublicKey(walletAddress);

//     // Fetch all NFTs owned by the wallet
//     const nfts = await metaplex.nfts().findAllByOwner({ owner });

//     // Process each NFT to extract metadata
//     const medicalReports = await Promise.all(
//       nfts.map(async (nft) => {
//         if (!('uri' in nft) || !('address' in nft)) return null;
//         try {
//           // Fetch metadata from IPFS
//           const metadataResponse = await axios.get(nft.uri);
//           const metadata = metadataResponse.data;
//           console.log("📄 Metadata:", metadata);

//           return {
//             name: metadata.name || "Unknown Report",
//             description: metadata.description || "No description",
//             patient: metadata.attributes.find((attr: MetadataAttribute) => attr.trait_type === "Patient")?.value || "Unknown",
//             doctor: metadata.attributes.find((attr: MetadataAttribute) => attr.trait_type === "Doctor")?.value || "Unknown",
//             date: metadata.attributes.find((attr: MetadataAttribute) => attr.trait_type === "Date")?.value || "Unknown",
//             image: metadata.image || "",
//             ipfsHash: nft.uri.replace("https://gateway.pinata.cloud/ipfs/", ""),
//             fileUrl: metadata.properties?.files[0]?.uri || "",
//             nftAddress: nft.address.toBase58(),
//           };
//         } catch (error) {
//           console.error(`❌ Error fetching metadata for NFT: ${nft.address.toBase58()}`, error);
//           return null;
//         }
//       })
//     );

//     // Filter out any failed fetches
//     return medicalReports.filter((report) => report !== null);
//   } catch (error) {
//     console.error("❌ Error fetching NFTs:", error);
//     return [];
//   }
// };

// // 🚀 Run the minting function
// // mintMedicalNFT();