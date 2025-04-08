// pinataService.ts
// Simple IPFS uploads via Pinata API
import axios from 'axios';

// Logging utility
const logger = {
  info: (message: string, data?: any) => {
    console.info(`🔵 [Pinata Service] ${message}`, data ? data : '');
  },
  success: (message: string, data?: any) => {
    console.log(`✅ [Pinata Service] ${message}`, data ? data : '');
  },
  error: (message: string, error: any) => {
    console.error(`❌ [Pinata Service] ${message}`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
};

// Custom error class for Pinata-specific errors
export class PinataError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'PinataError';
  }
}

/**
 * Upload file to Pinata IPFS via API
 * @param file - File to be uploaded
 * @returns IPFS Hash (CID) of the uploaded file
 */
export const uploadFileToPinata = async (file: File): Promise<string> => {
  logger.info(`Starting file upload: ${file.name} (${file.size} bytes)`);

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/pinata', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new PinataError(
        data.error || 'Upload failed',
        'UPLOAD_ERROR',
        response.status,
        data
      );
    }

    if (!data.ipfsHash) {
      throw new PinataError('No IPFS hash received', 'UPLOAD_ERROR');
    }

    logger.success(`File uploaded successfully with CID: ${data.ipfsHash}`);
    return data.ipfsHash;
  } catch (error: any) {
    logger.error('Upload failed', error);
    throw error;
  }
};

/**
 * Upload medical report and metadata for NFT minting
 * @param file - Medical report file
 * @param metadata - Report metadata
 * @returns Object containing file CID and metadata CID
 */
export const uploadMedicalReportForNFT = async (
  file: File, 
  metadata: {
    patientName: string;
    doctorName: string;
    date: string;
    reportName: string;
    thumbnailUrl: string;
  }
) => {
  logger.info('Starting medical report upload process', { reportName: metadata.reportName });

  try {
    if (!file) {
      throw new PinataError('Must provide a file', 'VALIDATION_ERROR');
    }
    
    logger.info('Uploading medical report file...');
    const fileCID = await uploadFileToPinata(file);
    logger.success('Medical report file uploaded', { fileCID });
    
    const nftMetadata = {
      name: metadata.reportName,
      symbol: "MEDNFT",
      description: `Patient: ${metadata.patientName} - Medical Record`,
      image: metadata.thumbnailUrl,
      attributes: [
        { trait_type: "Patient", value: metadata.patientName },
        { trait_type: "Doctor", value: metadata.doctorName },
        { trait_type: "Date", value: metadata.date }
      ],
      properties: {
        files: [{ 
          uri: `https://gateway.pinata.cloud/ipfs/${fileCID}`,
          type: file.type
        }]
      }
    };
    
    logger.info('Uploading NFT metadata...');
    const metadataCID = await uploadJSONToPinata(nftMetadata, `${metadata.reportName}_metadata`);
    logger.success('NFT metadata uploaded', { metadataCID });
    
    return {
      fileCID,
      metadataCID
    };
  } catch (error: any) {
    logger.error('Medical report upload failed', error);
    throw error;
  }
};

/**
 * Upload JSON metadata to Pinata IPFS
 * @param jsonData - JSON data to upload
 * @param name - Name for the metadata file
 * @returns IPFS Hash
 */
export const uploadJSONToPinata = async (jsonData: any, name: string): Promise<string> => {
  logger.info(`Starting JSON metadata upload: ${name}`);

  try {
    const formData = new FormData();
    const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
    const file = new File([blob], `${name}.json`, { type: 'application/json' });
    formData.append('file', file);

    const response = await fetch('/api/pinata', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new PinataError(
        data.error || 'Upload failed',
        'JSON_UPLOAD_ERROR',
        response.status,
        data
      );
    }

    if (!data.ipfsHash) {
      throw new PinataError('No IPFS hash received', 'JSON_UPLOAD_ERROR');
    }

    logger.success(`JSON metadata uploaded successfully with CID: ${data.ipfsHash}`);
    return data.ipfsHash;
  } catch (error: any) {
    logger.error('JSON upload failed', error);
    throw error;
  }
};