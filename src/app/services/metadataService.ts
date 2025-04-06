// metadataService.ts    
// Fetch NFT metadata & report details with secure decryption
import axios from 'axios';
import { Metaplex } from '@metaplex-foundation/js';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { getEncryptionKey } from './accessControl';
import { decryptFile } from './encryptionService';

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
 * Fetches and decrypts a medical report file if the user has access
 * @param reportId - The unique identifier for the report (NFT address)
 * @param walletAddress - The wallet address of the user requesting access
 * @returns The decrypted file blob or null if access is denied
 */
export const fetchAndDecryptMedicalReport = async (
  reportId: string,
  walletAddress: string
): Promise<Blob | null> => {
  try {
    // Step 1: Get NFT metadata to find the encrypted file URL
    const metadata = await getNFTMetadata(reportId);
    
    // Step 2: Extract the encrypted file URL from the metadata
    if (!metadata?.properties?.files?.[0]?.uri) {
      throw new Error('Encrypted file URL not found in metadata');
    }
    const encryptedFileUrl = metadata.properties.files[0].uri;
    
    // Step 3: Verify if encryption is used
    const isEncrypted = metadata.properties.files[0].encryption?.algorithm === 'AES-256-GCM';
    
    // If the file is not encrypted, just return it directly
    if (!isEncrypted) {
      const response = await axios.get(encryptedFileUrl, {
        responseType: 'blob'
      });
      return response.data;
    }
    
    // Step 4: Get the encryption key if the user has access
    const keyData = await getEncryptionKey(reportId, walletAddress);
    
    if (!keyData) {
      console.error('Access denied or encryption key not found');
      return null;
    }
    
    // Step 5: Fetch the encrypted file
    const response = await axios.get(encryptedFileUrl, {
      responseType: 'blob'
    });
    const encryptedBlob = response.data;
    
    // Step 6: Convert the base64 key back to a CryptoKey
    const keyBytes = Uint8Array.from(atob(keyData.key), c => c.charCodeAt(0));
    const importedKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    // Step 7: Decrypt the file
    // For this implementation, we need to handle the IV properly
    // Here we assume the IV is properly encoded in the encrypted file
    const decryptedBlob = await decryptFile(encryptedBlob, importedKey);
    
    return decryptedBlob;
  } catch (error) {
    console.error('Error fetching and decrypting medical report:', error);
    throw error;
  }
};
