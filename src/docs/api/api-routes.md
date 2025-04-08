 # MedBlock API Routes Documentation

## Overview

MedBlock's backend API routes handle HTTP requests for file storage and blockchain operations. These routes act as intermediaries between the frontend client and the core services.

## API Endpoints

### Pinata API Routes (`/api/pinata`)

#### 1. Upload File to IPFS
- **Method**: `POST`
- **Endpoint**: `/api/pinata`
- **Purpose**: Upload medical records to IPFS via Pinata

##### Request
```typescript
// FormData
{
  file: File,          // The medical record file
  pinataMetadata: {    // Optional metadata
    name: string       // File name
  },
  pinataOptions: {     // IPFS options
    cidVersion: 1      // Using CIDv1 for better compatibility
  }
}
```

##### Response
```typescript
// Success (200)
{
  success: true,
  ipfsHash: string,    // IPFS Content Identifier
  size: number,        // File size
  name: string         // File name
}

// Error (400/500)
{
  error: string,
  status: number
}
```

#### 2. Fetch File from IPFS
- **Method**: `GET`
- **Endpoint**: `/api/pinata?ipfsHash={hash}`
- **Purpose**: Retrieve medical records from IPFS

##### Parameters
- `ipfsHash` (required): The IPFS hash (CID) of the file to retrieve

##### Response
- **Success**: Binary file data with appropriate content type
- **JSON Redirect**: If the content is JSON with a file URI, redirects to the file
- **Error**: JSON error response

```typescript
// Error Response
{
  error: string,
  status: number
}
```

### Solana API Routes (`/api/solana`)

#### 1. Mint Medical NFT
- **Method**: `POST`
- **Endpoint**: `/api/solana`
- **Purpose**: Create NFT for medical records on Solana blockchain

##### Request Body
```typescript
{
  patientName: string,
  doctorName: string,
  date: string,
  reportName: string,
  imageUrl: string,     // Thumbnail IPFS URL
  reportUrl: string,    // Medical report IPFS URL
  reportType?: string,
  patientAddress: string,
  doctorAddress?: string,
  ipfsHash?: string,
  metadataCID?: string
}
```

##### Response
```typescript
// Success (200)
{
  success: true,
  nftAddress: string,    // Solana NFT address
  explorerUrl: string,   // Solana explorer URL
  metadataUri: string    // IPFS metadata URI
}

// Error (400/500)
{
  error: string,
  field?: string        // For validation errors
}
```

#### 2. Fetch Medical NFTs
- **Method**: `GET`
- **Endpoint**: `/api/solana?walletAddress={address}`
- **Purpose**: Retrieve medical NFTs owned by a wallet

##### Parameters
- `walletAddress` (required): The Solana wallet address to query

##### Response
```typescript
// Success (200)
{
  success: true,
  medicalReports: Array<{
    name: string,
    description: string,
    patient: string,
    doctor: string,
    date: string,
    image: string,
    ipfsHash: string,
    fileUrl: string,
    nftAddress: string,
    created_at: number
  }>
}

// Error (400/500)
{
  error: string
}
```

## Error Handling

### Common Error Responses

1. **Validation Errors (400)**
```typescript
{
  error: "Missing required fields",
  field: "patientName, reportUrl" // Comma-separated missing fields
}
```

2. **Configuration Errors (500)**
```typescript
{
  error: "Pinata JWT not configured"
}
```

3. **Service Errors (500)**
```typescript
{
  error: "Error uploading to Pinata",
  status: 500
}
```

### Error Types

1. **Input Validation**
   - Missing required fields
   - Invalid file format
   - Invalid wallet address

2. **Service Configuration**
   - Missing API keys
   - Invalid JWT
   - Network configuration issues

3. **External Service Errors**
   - IPFS upload failures
   - Blockchain transaction errors
   - Network timeouts

## Security Considerations

1. **Authentication**
   - JWT-based authentication for Pinata
   - Wallet signature verification for Solana
   - Rate limiting on all endpoints

2. **File Validation**
   - Size limits
   - Format validation
   - Content type verification

3. **Error Messages**
   - Sanitized error responses
   - No sensitive data exposure
   - Appropriate error codes

## Best Practices

1. **Request Handling**
   - Validate all inputs
   - Implement request timeouts
   - Handle multipart/form-data properly

2. **Response Formatting**
   - Consistent response structure
   - Appropriate status codes
   - Detailed error messages

3. **File Processing**
   - Stream large files
   - Validate before upload
   - Handle binary data properly

## Usage Examples

### Upload Medical Report
```typescript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/pinata', {
  method: 'POST',
  body: formData
});

const { ipfsHash } = await response.json();
```

### Mint Medical NFT
```typescript
const response = await fetch('/api/solana', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    patientName: "John Doe",
    doctorName: "Dr. Smith",
    reportName: "Annual Checkup",
    imageUrl: "ipfs://...",
    reportUrl: "ipfs://...",
    patientAddress: "wallet_address"
  })
});

const { nftAddress, explorerUrl } = await response.json();
```

### Fetch Medical Records
```typescript
const response = await fetch(
  `/api/solana?walletAddress=${walletAddress}`
);

const { medicalReports } = await response.json();
```

## Rate Limiting

- Maximum file size: 100MB
- Rate limit: 100 requests per minute
- Maximum concurrent uploads: 5

## Error Recovery

1. **Upload Retry Strategy**
   - 3 retry attempts
   - Exponential backoff
   - Separate retry for metadata

2. **Transaction Recovery**
   - Transaction confirmation checks
   - Metadata synchronization
   - State reconciliation

3. **Error Reporting**
   - Detailed error logging
   - Error tracking
   - Performance monitoring