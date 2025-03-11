// pinataService.ts
// Handle IPFS (Pinata) uploads & CIDs
import axios from 'axios';
import FormData from 'form-data';

const PINATA_API_KEY = process.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.VITE_PINATA_SECRET_API_KEY;

/**
 * Upload file to Pinata IPFS
 * @param filePath - Local file path
 * @returns IPFS Hash
 */
export const uploadToPinata = async (file: File) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(url, formData, {
      maxBodyLength: Infinity,
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    const ipfsHash = res.data.IpfsHash;
    console.log(`✅ File uploaded to IPFS!`);
    console.log(`🔗 IPFS Hash: ${ipfsHash}`);
    console.log(`🌐 IPFS Gateway URL: https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

    return ipfsHash;
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error uploading to Pinata:", (error as any).response?.data || error.message);
    } else {
      console.error("❌ Error uploading to Pinata:", error);
    }
    throw error;
  }
};


/**
 * Download file from Pinata using IPFS Hash
 * @param ipfsHash - The IPFS Hash of the file
/**
 * Download file from Pinata using IPFS Hash
 * @param ipfsHash - The IPFS Hash of the file
 * @returns URL to access the file
 */
export const getIPFSUrl = (ipfsHash: string): string => {
  return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
};