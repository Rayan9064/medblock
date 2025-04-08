# Metadata Service Documentation

## Overview

The Metadata Service (`metadataService.ts`) is responsible for handling NFT metadata operations in the MedBlock system. It provides functionality to fetch, manage, and retrieve metadata for medical record NFTs from both the Solana blockchain and IPFS/Arweave storage.

## Configuration

### Solana Connection
```typescript
const rpcUrl = clusterApiUrl('devnet');
const connection = new Connection(rpcUrl, 'confirmed');
```

### Metaplex Integration
```typescript
const metaplex = Metaplex.make(connection);
// Note: No wallet identity needed for read operations
```

## Core Functions

### 1. getNFTMetadata

```typescript
export const getNFTMetadata = async (mintAddress: string)
```

Retrieves metadata for a specific NFT using its mint address.

#### Process:
1. Converts mint address to PublicKey
2. Fetches NFT data using Metaplex
3. Retrieves metadata from URI
4. Returns parsed metadata

#### Error Handling:
- Validates NFT existence
- Checks for valid metadata URI
- Handles network failures

#### Usage:
```typescript
const metadata = await getNFTMetadata("NFT_MINT_ADDRESS");
console.log(metadata);
```

### 2. fetchMetadataFromURI

```typescript
export const fetchMetadataFromURI = async (metadataUri: string)
```

Directly fetches metadata from an IPFS/Arweave URL.

#### Process:
1. Validates URI format
2. Fetches JSON data
3. Returns parsed metadata

#### Error Handling:
- Handles invalid URIs
- Manages network timeouts
- Validates JSON response

#### Usage:
```typescript
const metadata = await fetchMetadataFromURI("https://gateway.pinata.cloud/ipfs/CID");
```

### 3. fetchMedicalReport

```typescript
export const fetchMedicalReport = async (reportUrl: string): Promise<Blob>
```

Retrieves the actual medical report file from IPFS.

#### Process:
1. Validates report URL
2. Fetches file as blob
3. Returns file data

#### Error Handling:
- Handles download failures
- Validates file size
- Monitors download progress

#### Usage:
```typescript
const reportBlob = await fetchMedicalReport("https://gateway.pinata.cloud/ipfs/CID");
```

## Metadata Structure

### NFT Metadata Format
```typescript
interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  properties: {
    files: Array<{
      uri: string;
      type: string;
    }>;
  };
}
```

### Medical Report Metadata
```typescript
interface MedicalReportMetadata {
  patient: string;
  doctor: string;
  date: string;
  reportType: string;
  fileUrl: string;
  thumbnailUrl: string;
  additional?: Record<string, any>;
}
```

## Error Handling Strategy

### Network Errors
```typescript
try {
  const response = await axios.get(nft.uri);
  return response.data;
} catch (error) {
  console.error('Error fetching NFT metadata:', error);
  throw error;
}
```

### Data Validation
```typescript
if (!nft.uri) {
  throw new Error('NFT metadata URI not found');
}
```

## Best Practices

1. **URI Management**
   - Use gateway URLs for IPFS content
   - Implement URI validation
   - Handle various URI formats

2. **Data Fetching**
   - Implement request timeouts
   - Use appropriate response types
   - Cache frequently accessed data

3. **Error Recovery**
   - Log detailed error information
   - Provide meaningful error messages
   - Implement fallback options

4. **Performance**
   - Optimize request patterns
   - Implement caching where appropriate
   - Use batch operations when possible

## Common Issues and Solutions

1. **Metadata Not Found**
   - Verify mint address validity
   - Check URI accessibility
   - Validate network connection

2. **Invalid Metadata Format**
   - Implement schema validation
   - Handle missing fields gracefully
   - Provide default values

3. **Network Timeouts**
   - Implement retry logic
   - Use multiple IPFS gateways
   - Monitor response times

## Security Considerations

1. **Data Privacy**
   - Only fetch authorized metadata
   - Validate request sources
   - Protect sensitive information

2. **URI Safety**
   - Validate URI formats
   - Use trusted gateways
   - Implement URI sanitization

3. **Error Messages**
   - Avoid exposing sensitive details
   - Log securely
   - Use appropriate error codes

## Integration Examples

### Fetching Complete Medical Record
```typescript
async function fetchCompleteRecord(mintAddress: string) {
  // Get NFT metadata
  const metadata = await getNFTMetadata(mintAddress);
  
  // Get the actual medical report
  const reportUrl = metadata.properties.files[0].uri;
  const report = await fetchMedicalReport(reportUrl);
  
  return {
    metadata,
    report
  };
}
```

### Batch Metadata Retrieval
```typescript
async function fetchMultipleRecords(mintAddresses: string[]) {
  const records = await Promise.all(
    mintAddresses.map(async (address) => {
      try {
        return await getNFTMetadata(address);
      } catch (error) {
        console.error(`Failed to fetch metadata for ${address}:`, error);
        return null;
      }
    })
  );
  
  return records.filter(Boolean);
}
```