// metadataService.ts    
// Fetch NFT metadata & report details
import axios from 'axios';
import { Metaplex } from '@metaplex-foundation/js';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

// 🔗 Connect to Solana Devnet
const rpcUrl = clusterApiUrl('devnet');
const connection = new Connection(rpcUrl, 'confirmed');

// 🏗️ Initialize Metaplex (without wallet identity for reading)
const metaplex = Metaplex.make(connection);

/**
 * Fetches metadata from IPFS/Arweave using the NFT mint address.
 * @param mintAddress - The mint address of the NFT.
 * @returns Metadata JSON object.
 */
export const getNFTMetadata = async (mintAddress: string) => {
  try {
    const nft = await metaplex.nfts().findByMint({ 
      mintAddress: new PublicKey(mintAddress) 
    });
    
    if (!nft.uri) {
      throw new Error('NFT metadata URI not found');
    }

    const response = await axios.get(nft.uri);
    return response.data; // Metadata containing file link, name, etc.
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    throw error;
  }
};

/**
 * Directly fetches metadata from a given IPFS/Arweave URL.
 * @param metadataUri - The IPFS/Arweave URL.
 * @returns Metadata JSON object.
 */
export const fetchMetadataFromURI = async (metadataUri: string) => {
  try {
    const response = await axios.get(metadataUri);
    return response.data;
  } catch (error) {
    console.error('Error fetching metadata from URI:', error);
    throw error;
  }
};

/**
 * Fetches a medical report file
 * @param reportUrl - The IPFS URL of the report
 * @returns The file blob
 */
export const fetchMedicalReport = async (reportUrl: string): Promise<Blob> => {
  try {
    console.log('Fetching medical report from:', reportUrl);
    const response = await axios.get(reportUrl, {
      responseType: 'blob'
    });
    console.log('Successfully fetched report, size:', response.data.size);
    return response.data;
  } catch (error) {
    console.error('Error fetching medical report:', error);
    throw error;
  }
};
