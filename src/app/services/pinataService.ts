// pinataService.ts
// Handle IPFS uploads via API endpoints
import axios from 'axios';

// Logging utility for consistent log formatting
const logger = {
  info: (message: string, data?: any) => {
    console.info(`🔵 [Pinata Service] ${message}`, data ? data : '');
  },
  success: (message: string, data?: any) => {
    console.log(`✅ [Pinata Service] ${message}`, data ? data : '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`⚠️ [Pinata Service] ${message}`, data ? data : '');
  },
  error: (message: string, error: any) => {
    console.error(`❌ [Pinata Service] ${message}`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
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
 * Upload private file to Pinata IPFS via API
 * @param file - File to be uploaded
 * @returns IPFS Hash (CID) of the uploaded file
 */
export const uploadPrivateFileToPinata = async (file: File): Promise<string> => {
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
    const pinataError = new PinataError(
      'Error uploading file to Pinata',
      'UPLOAD_ERROR',
      error.status,
      error.details
    );
    logger.error('Upload failed', pinataError);
    throw pinataError;
  }
};

/**
 * Upload medical report and metadata for NFT minting
 * Uses private file storage with API authentication
 * 
 * @param file - PDF file to upload
 * @param metadata - Report metadata (patient name, doctor, etc)
 * @returns Object containing file CID, metadata CID
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
    const fileCID = await uploadPrivateFileToPinata(file);
    logger.success('Medical report file uploaded', { fileCID });
    
    const nftMetadata = {
      name: metadata.reportName,
      symbol: "MEDNFT",
      description: `Patient: ${metadata.patientName} - Confidential Medical Report`,
      image: metadata.thumbnailUrl,
      attributes: [
        { trait_type: "Patient", value: metadata.patientName },
        { trait_type: "Doctor", value: metadata.doctorName },
        { trait_type: "Date", value: metadata.date }
      ],
      properties: {
        files: [{ uri: fileCID, type: file.type }],
        access: { 
          method: "pinata_authenticated",
          isPrivate: true
        }
      }
    };
    
    logger.info('Uploading NFT metadata...');
    const metadataCID = await uploadJSONToPinata(nftMetadata, `${metadata.reportName}_metadata`);
    logger.success('NFT metadata uploaded', { metadataCID });
    
    return {
      fileCID,
      metadataCID,
      access: {
        method: "pinata_authenticated",
        isPrivate: true
      }
    };
  } catch (error: any) {
    const pinataError = new PinataError(
      'Error uploading medical report for NFT',
      'NFT_UPLOAD_ERROR',
      error.status,
      error.details
    );
    logger.error('Medical report upload failed', pinataError);
    throw pinataError;
  }
};

/**
 * Upload JSON metadata to Pinata IPFS via API
 * @param jsonData - JSON data to upload
 * @param name - Name for the metadata
 * @returns IPFS Hash
 */
export const uploadJSONToPinata = async (jsonData: any, name: string): Promise<string> => {
  logger.info(`Starting JSON metadata upload: ${name}`);

  try {
    const formData = new FormData();
    const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
    const file = new File([blob], `${name}.json`, { type: 'application/json' });
    formData.append('file', file);
    formData.append('metadata', JSON.stringify({ name }));

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
    const pinataError = new PinataError(
      'Error uploading JSON to Pinata',
      'JSON_UPLOAD_ERROR',
      error.status,
      error.details
    );
    logger.error('JSON upload failed', pinataError);
    throw pinataError;
  }
};

/**
 * Fetch a private file from Pinata using API
 * @param ipfsHash - The IPFS hash (CID) of the file to fetch
 * @returns A blob of the file data
 */
export const fetchPrivateFileFromPinata = async (ipfsHash: string): Promise<Blob> => {
  logger.info(`Fetching private file with CID: ${ipfsHash}`);

  try {
    const response = await fetch(`/api/pinata?ipfsHash=${ipfsHash}`);

    if (!response.ok) {
      const error = await response.json();
      throw new PinataError(
        error.error || 'Fetch failed',
        'FETCH_ERROR',
        response.status,
        error
      );
    }

    const blob = await response.blob();
    logger.success('File fetched successfully', { size: blob.size });
    return blob;
  } catch (error: any) {
    const pinataError = new PinataError(
      'Error fetching private file',
      'FETCH_ERROR',
      error.status,
      error.details
    );
    logger.error('File fetch failed', pinataError);
    throw pinataError;
  }
};