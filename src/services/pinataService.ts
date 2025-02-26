
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

export const uploadToPinata = async (file: File | string) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  // Use the browser's FormData
  const formData = new FormData();
  
  if (file instanceof File) {
    formData.append('file', file);
  } else {
    // If it's a string (assuming it's JSON content)
    const blob = new Blob([file], { type: 'application/json' });
    formData.append('file', blob, 'metadata.json');
  }

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
    console.error('❌ Error uploading to Pinata:', error.response?.data || error.message);
    throw error;
  }
};
