# Pinata Service Documentation

## Overview

The Pinata Service (`pinataService.ts`) manages all interactions with IPFS through Pinata's API. This service handles the decentralized storage of medical records and their associated metadata, ensuring permanent and reliable storage of medical documents.

## Core Components

### Logging Utility
The service implements a custom logging system for better debugging and monitoring:

```typescript
const logger = {
  info: (message: string, data?: any) => console.info(`🔵 [Pinata Service] ${message}`),
  success: (message: string, data?: any) => console.log(`✅ [Pinata Service] ${message}`),
  error: (message: string, error: any) => console.error(`❌ [Pinata Service] ${message}`)
}
```

### Custom Error Handling
```typescript
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
```

## Main Functions

### 1. uploadFileToPinata

```typescript
export const uploadFileToPinata = async (file: File): Promise<string>
```

Uploads a single file to IPFS through Pinata.

#### Process:
1. Creates FormData with file
2. Sends POST request to Pinata API endpoint
3. Handles response and extracts IPFS hash
4. Returns CID (Content Identifier)

#### Error Handling:
- Validates API response
- Checks for IPFS hash presence
- Throws custom PinataError with details

#### Returns:
- IPFS hash (CID) as string

### 2. uploadMedicalReportForNFT

```typescript
export const uploadMedicalReportForNFT = async (
  file: File, 
  metadata: {
    patientName: string;
    doctorName: string;
    date: string;
    reportName: string;
    thumbnailUrl: string;
  }
): Promise<{ fileCID: string; metadataCID: string; }>
```

Handles the complete process of uploading a medical report and its metadata.

#### Process:
1. Validates input file
2. Uploads medical report file
3. Creates NFT metadata structure
4. Uploads metadata JSON
5. Returns both CIDs

#### Returns:
```typescript
{
  fileCID: string;    // IPFS hash of the medical report
  metadataCID: string // IPFS hash of the NFT metadata
}
```

### 3. uploadJSONToPinata

```typescript
export const uploadJSONToPinata = async (
  jsonData: any, 
  name: string
): Promise<string>
```

Specialized function for uploading JSON metadata to IPFS.

#### Process:
1. Converts JSON to Blob
2. Creates File object from Blob
3. Uploads using FormData
4. Returns metadata CID

## API Integration

### Endpoint Structure
```typescript
const response = await fetch('/api/pinata', {
  method: 'POST',
  body: formData
});
```

### Response Handling
```typescript
const data = await response.json();
if (!response.ok) {
  throw new PinataError(
    data.error || 'Upload failed',
    'UPLOAD_ERROR',
    response.status,
    data
  );
}
```

## Error Handling Strategy

1. **Input Validation**
```typescript
if (!file) {
  throw new PinataError('Must provide a file', 'VALIDATION_ERROR');
}
```

2. **API Response Validation**
```typescript
if (!data.ipfsHash) {
  throw new PinataError('No IPFS hash received', 'UPLOAD_ERROR');
}
```

3. **Custom Error Types**
- VALIDATION_ERROR
- UPLOAD_ERROR
- JSON_UPLOAD_ERROR

## Best Practices

1. **File Handling**
   - Validate file presence
   - Check file size before upload
   - Maintain original file type

2. **Metadata Structure**
   - Include all required NFT fields
   - Add descriptive attributes
   - Maintain consistent format

3. **Error Management**
   - Use custom error classes
   - Implement detailed logging
   - Provide meaningful error messages

4. **Response Processing**
   - Validate IPFS hash format
   - Confirm successful uploads
   - Handle API rate limits

## Common Issues and Solutions

1. **Upload Failures**
   - Check file size limits
   - Verify API credentials
   - Monitor rate limiting

2. **Metadata Issues**
   - Validate JSON structure
   - Check required fields
   - Verify URI formatting

3. **Network Problems**
   - Implement retry logic
   - Handle timeout errors
   - Monitor API status

## Usage Examples

### Uploading a Medical Report
```typescript
const file = new File(['report content'], 'medical-report.pdf', {
  type: 'application/pdf'
});

const metadata = {
  patientName: "John Doe",
  doctorName: "Dr. Smith",
  date: new Date().toISOString(),
  reportName: "Annual Checkup",
  thumbnailUrl: "thumbnail_url"
};

const { fileCID, metadataCID } = await uploadMedicalReportForNFT(file, metadata);
console.log(`File CID: ${fileCID}`);
console.log(`Metadata CID: ${metadataCID}`);
```

### Uploading JSON Metadata
```typescript
const metadata = {
  name: "Medical Report #123",
  description: "Annual checkup results",
  attributes: [/*...*/]
};

const metadataCID = await uploadJSONToPinata(metadata, "report-123-metadata");
console.log(`Metadata uploaded with CID: ${metadataCID}`);
```