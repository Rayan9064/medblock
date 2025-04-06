// solanaService.ts  
// Solana connection, NFT minting, smart contract methods
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import { Connection, clusterApiUrl, Keypair, PublicKey } from '@solana/web3.js';
import axios from "axios";
import { uploadJSONToPinata } from './pinataService';

// NOTE: We're uploading NFT metadata manually to Pinata (IPFS) using axios
// and not using metaplex.nfts().uploadMetadata() because we want full control
// over CID and storage backend. The resulting CID from Pinata is used to form
// the metadata URI, which is then passed directly into metaplex.nfts().create()

// 🔗 Connect to Solana Devnet
const rpcUrl = clusterApiUrl('devnet');
// Increase timeout and commitment level for more reliable transaction confirmations
const connection = new Connection(rpcUrl, {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000, // 60 seconds timeout
});

// Convert secret key string to Uint8Array
// Use a fallback or generate a new keypair for development if the env var is not set
let wallet: Keypair;
if (!process.env.NEXT_PUBLIC_SOLANA_SECRET_KEY) {
  console.warn('NEXT_PUBLIC_SOLANA_SECRET_KEY not defined, generating a new keypair for development');
  wallet = Keypair.generate(); // Generate a new keypair for development
} else {
  try {
    const secretKeyArray = JSON.parse(process.env.NEXT_PUBLIC_SOLANA_SECRET_KEY);
    wallet = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));
  } catch (error) {
    console.error('Failed to parse NEXT_PUBLIC_SOLANA_SECRET_KEY, generating a new keypair for development');
    wallet = Keypair.generate(); // Fallback to generated keypair
  }
}

// 🏗️ Initialize Metaplex
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(wallet));

export interface MedicalNFTMetadata {
  patientName: string;
  doctorName: string;
  date: string;
  reportName: string;
  imageUrl: string;
  reportUrl: string;
  reportType?: string;
  patientAddress?: string;
  doctorAddress?: string;
  // Encryption fields are now deprecated
  // encryptionKey?: string;
  // iv?: string;
  originalFileHash?: string;
  ipfsHash?: string;
  isPrivate?: boolean;
  metadataCID?: string;
  recordId?: string;
  // Add JWT-specific fields
  access?: {
    method: string;
    isPrivate: boolean;
  };
}

interface MetadataAttribute {
  trait_type: string;
  value: string;
}

export const mintMedicalNFT = async (metadata: MedicalNFTMetadata) => {
  try {
    console.log("🔐 Minting medical report NFT with transaction retry logic");
    
    // 🏥 Medical Report Metadata
    // Create an attributes array without null values
    const attributes = [
      { trait_type: "Patient", value: metadata.patientName },
      { trait_type: "Doctor", value: metadata.doctorName },
      { trait_type: "Date", value: metadata.date },
      { trait_type: "Report Type", value: metadata.reportType || "General" },
      { trait_type: "Record ID", value: metadata.recordId || `MED-${Date.now()}` },
      { trait_type: "Created At", value: new Date().toISOString() }
    ];
    
    // Add access control information based on the isPrivate flag
    if (metadata.isPrivate) {
      attributes.push({ trait_type: "Access Control", value: "Private - JWT" });
    }
    
    // Add optional attributes only if they exist
    if (metadata.patientAddress) {
      attributes.push({ trait_type: "Patient Address", value: metadata.patientAddress });
    }
    
    if (metadata.doctorAddress) {
      attributes.push({ trait_type: "Doctor Address", value: metadata.doctorAddress });
    }

    const medicalMetadata = {
      name: metadata.reportName,
      symbol: "MEDNFT",
      description: `Patient: ${metadata.patientName} - Confidential Medical Record`,
      image: metadata.imageUrl,
      attributes,
      properties: {
        files: [{
          uri: metadata.reportUrl,
          type: "application/pdf",
          isPrivate: metadata.isPrivate || false,
          access: metadata.isPrivate ? {
            method: "pinata_authenticated",
            requiresJWT: true
          } : undefined
        }],
        category: "medical",
        originalFileHash: metadata.originalFileHash,
        ipfsHash: metadata.ipfsHash
      }
    };

    console.log("⏳ Uploading Metadata to Pinata IPFS...");
    
    // If we already have a metadata CID, use it directly
    let metadataUri;
    if (metadata.metadataCID) {
      metadataUri = `https://gateway.pinata.cloud/ipfs/${metadata.metadataCID}`;
      console.log("✅ Using existing metadata CID:", metadataUri);
    } else {
      // Otherwise, implement retry logic for metadata upload to handle network issues
      let uploadRetries = 3;
      while (uploadRetries > 0) {
        try {
          // Upload metadata JSON to Pinata 
          const metadataCid = await uploadJSONToPinata(medicalMetadata, `${metadata.reportName}_metadata`);
          
          // Form the complete URI with gateway
          metadataUri = `https://gateway.pinata.cloud/ipfs/${metadataCid}`;
          console.log("✅ Metadata uploaded to Pinata IPFS:", metadataUri);
          break; // Success, exit retry loop
        } catch (uploadError) {
          uploadRetries--;
          console.warn(`⚠️ Metadata upload attempt failed. Retries left: ${uploadRetries}`);
          if (uploadRetries === 0) {
            throw new Error(`Failed to upload metadata after multiple attempts: ${uploadError instanceof Error ? uploadError.message : String(uploadError)}`);
          }
          // Wait before next retry
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    }

    if (!metadataUri) {
      throw new Error("Failed to obtain metadata URI after upload attempts");
    }

    console.log("⏳ Minting Medical Report NFT...");
    console.log("🔄 Connecting to Solana network:", rpcUrl);
    
    // Apply retry logic for NFT minting to handle transaction confirmation issues
    let nft;
    let mintRetries = 3;
    while (mintRetries > 0) {
      try {
        // Create the NFT using our Pinata metadata URI
        const result = await metaplex.nfts().create({
          uri: metadataUri,
          name: medicalMetadata.name,
          sellerFeeBasisPoints: 0, // No royalties
        });
        nft = result.nft;
        
        // Explicitly confirm the transaction using the mint address
        console.log("🔍 Verifying NFT mint on Solana blockchain...");
        const mintAddress = nft.address.toString();
        
        // Add delay to allow transaction to propagate through the network
        console.log("⏳ Waiting for transaction confirmation...");
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Verify the NFT exists on-chain
        const accountInfo = await connection.getAccountInfo(nft.address, "confirmed");
        if (accountInfo) {
          console.log(`✅ NFT mint verified on blockchain: ${mintAddress}`);
          break; // Success, exit retry loop
        } else {
          throw new Error("NFT account not found on blockchain after minting");
        }
      } catch (mintError) {
        mintRetries--;
        console.warn(`⚠️ NFT minting attempt failed. Retries left: ${mintRetries}`);
        if (mintRetries === 0) {
          throw new Error(`Failed to mint NFT after multiple attempts: ${mintError instanceof Error ? mintError.message : String(mintError)}`);
        }
        // Wait longer between mint retries
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    if (!nft) {
      throw new Error("Failed to mint NFT after multiple attempts");
    }

    console.log("🎉 Medical Report NFT Minted Successfully!");
    console.log("🔗 NFT Mint Address:", nft.address.toString());
    console.log(`🔍 View on Solana Explorer: https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`);

    return {
      nftAddress: nft.address.toString(),
      explorerUrl: `https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`,
      metadataUri
    };
  } catch (error) {
    console.error("❌ Error minting NFT:", error);
    throw error;
  }
};

export const fetchMedicalReports = async (walletAddress: string) => {
  try {
    const owner = new PublicKey(walletAddress);
    console.log("🔎 Fetching NFTs for wallet:", walletAddress);

    // Fetch all NFTs owned by the wallet
    const nfts = await metaplex.nfts().findAllByOwner({ owner });
    console.log(`📦 Found ${nfts.length} NFTs for wallet`);

    // Process each NFT to extract metadata
    const medicalReports = await Promise.all(
      nfts.map(async (nft) => {
        if (!('uri' in nft) || !('address' in nft)) {
          console.log("⚠️ Skipping NFT without URI or address");
          return null;
        }
        
        try {
          console.log(`🔄 Processing NFT: ${nft.address.toBase58()}, URI: ${nft.uri}`);
          
          // Some NFTs might not have a URI that points to valid metadata
          if (!nft.uri || !nft.uri.includes('http')) {
            console.log(`⚠️ NFT has invalid URI: ${nft.uri}`);
            // Return a minimal report object instead of null
            return {
              name: `NFT ${nft.address.toBase58().slice(0, 8)}...`,
              description: "NFT without metadata",
              patient: "Unknown",
              doctor: "Unknown",
              date: "Unknown",
              image: "",
              ipfsHash: "",
              fileUrl: "",
              nftAddress: nft.address.toBase58(),
              created_at: Date.now(),
              isPrivate: false
            };
          }

          // Fetch metadata from IPFS or any URI
          const metadataResponse = await axios.get(nft.uri);
          const metadata = metadataResponse.data;
          console.log("📄 Retrieved metadata:", metadata.name || "Unnamed NFT");

          // Check if the file is private (using JWT authentication)
          const isPrivate = metadata.properties?.files?.[0]?.isPrivate || 
                          metadata.properties?.files?.[0]?.access?.method === "pinata_authenticated" ||
                          metadata.attributes?.some((attr: MetadataAttribute) => 
                            attr.trait_type === "Access Control" && attr.value === "Private - JWT"
                          ) || false;

          // Handle different metadata formats gracefully
          return {
            name: metadata.name || "Unknown Report",
            description: metadata.description || "No description",
            patient: metadata.attributes?.find((attr: MetadataAttribute) => attr.trait_type === "Patient")?.value || "Unknown",
            doctor: metadata.attributes?.find((attr: MetadataAttribute) => attr.trait_type === "Doctor")?.value || "Unknown",
            date: metadata.attributes?.find((attr: MetadataAttribute) => attr.trait_type === "Date")?.value || "Unknown",
            image: metadata.image || "",
            ipfsHash: nft.uri.replace("https://gateway.pinata.cloud/ipfs/", ""),
            fileUrl: metadata.properties?.files?.[0]?.uri || "",
            nftAddress: nft.address.toBase58(),
            created_at: Date.now(), // Ensure each NFT has a created_at timestamp
            isPrivate, // Add isPrivate flag for UI to know authentication is needed
            accessMethod: isPrivate ? "pinata_authenticated" : "public"
          };
        } catch (error) {
          console.error(`❌ Error fetching metadata for NFT: ${nft.address.toBase58()}`, error);
          // Return a minimal report object instead of null to avoid filtering it out
          return {
            name: `NFT ${nft.address.toBase58().slice(0, 8)}...`,
            description: "Error fetching metadata",
            patient: "Unknown",
            doctor: "Unknown",
            date: "Unknown",
            image: "",
            ipfsHash: "",
            fileUrl: "",
            nftAddress: nft.address.toBase58(),
            created_at: Date.now(),
            isPrivate: false
          };
        }
      })
    );

    // Include all NFTs, even those with errors (no longer filtering)
    const validReports = medicalReports.filter(Boolean);
    console.log(`✅ Processed ${validReports.length} medical reports`);
    return validReports;
  } catch (error) {
    console.error("❌ Error fetching NFTs:", error);
    return [];
  }
};