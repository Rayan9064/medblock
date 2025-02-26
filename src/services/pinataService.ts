// pinataService.ts
// Handle IPFS (Pinata) uploads & CIDs
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import FormData from 'form-data';

dotenv.config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

/**
 * Upload file to Pinata IPFS
 * @param filePath - Local file path
 * @returns IPFS Hash
 */
export const uploadToPinata = async (filePath: string) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return null;
  }

  const fileStream = fs.createReadStream(filePath);
  const fileName = path.basename(filePath);
  const fileType = mime.lookup(filePath) || 'application/octet-stream';

  const formData = new FormData();
  formData.append('file', fileStream, {
    filename: fileName,
    contentType: fileType,
  });

  try {
    const res = await axios.post(url, formData, {
      maxBodyLength: Infinity,
      headers: {
        ...formData.getHeaders(),
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

/**
 * Download file from Pinata using IPFS Hash
 * @param ipfsHash - The IPFS Hash of the file
 * @param downloadDir - Local directory to save the downloaded file
 */
export const downloadFromPinata = async (ipfsHash: string, downloadDir: string) => {
  const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

  try {
    const response = await axios.get(gatewayUrl, { responseType: 'stream' });

    // Extract content-type to determine file extension
    const contentType = response.headers['content-type'];
    const extension = mime.extension(contentType) || 'bin';

    const fileName = `${ipfsHash}.${extension}`;
    const outputPath = path.join(downloadDir, fileName);

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    writer.on('finish', () => {
      console.log(`✅ File downloaded to: ${outputPath}`);
    });

    writer.on('error', (err) => {
      console.error('❌ Error writing file:', err);
    });

  } catch (error) {
    console.error('❌ Error downloading from IPFS:', error.response?.data || error.message);
  }
};