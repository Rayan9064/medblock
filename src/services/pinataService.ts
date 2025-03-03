
import axios from 'axios';

// Hard-coded Pinata API keys instead of using dotenv
const PINATA_API_KEY = '12b61e322f676d42261b';
const PINATA_SECRET_API_KEY = '66a2608c228e55046befef17d9a5015cac63fcea6ce4fd0b3fbd007c965d7eb0';

// Modified function to handle File objects from browser instead of file paths
export const uploadToPinata = async (file: File) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  // Create a FormData object using the browser's native FormData
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await axios.post(url, formData, {
      maxBodyLength: Infinity,
      headers: {
        // Don't use formData.getHeaders() as that's for Node.js
        'Content-Type': 'multipart/form-data',
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY
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

// Add a new function to upload JSON metadata
export const uploadJSONToPinata = async (jsonData: any) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  try {
    const res = await axios.post(url, jsonData, {
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY
      },
    });

    const ipfsHash = res.data.IpfsHash;
    console.log(`✅ JSON uploaded to IPFS!`);
    console.log(`🔗 IPFS Hash: ${ipfsHash}`);
    console.log(`🌐 IPFS Gateway URL: https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

    return ipfsHash;
  } catch (error) {
    console.error('❌ Error uploading JSON to Pinata:', error.response?.data || error.message);
    throw error;
  }
};
