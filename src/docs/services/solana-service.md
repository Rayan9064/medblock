# Solana Service Documentation

## Overview

The Solana Service (`solanaService.ts`) handles all interactions with the Solana blockchain, specifically focusing on NFT operations using the Metaplex SDK. This service is responsible for minting medical records as NFTs and retrieving them.

## Configuration

### Network Setup
```typescript
const rpcUrl = clusterApiUrl('devnet');
const connection = new Connection(rpcUrl, {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000
});
```

- Uses Solana's devnet for development
- Configures connection with:
  - 'confirmed' commitment level
  - 60-second transaction timeout

### Wallet Configuration
```typescript
let wallet: Keypair;
if (!process.env.NEXT_PUBLIC_SOLANA_SECRET_KEY) {
  wallet = Keypair.generate(); // Development fallback
} else {
  const secretKeyArray = JSON.parse(process.env.NEXT_PUBLIC_SOLANA_SECRET_KEY);
  wallet = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));
}
```

## Core Interfaces

### MedicalNFTMetadata
```typescript
interface MedicalNFTMetadata {
  patientName: string;
  doctorName: string;
  date: string;
  reportName: string;
  imageUrl: string;
  reportUrl: string;
  reportType?: string;
  patientAddress?: string;
  doctorAddress?: string;
  ipfsHash?: string;
  metadataCID?: string;
  recordId?: string;
}
```

## Main Functions

### 1. mintMedicalNFT

```typescript
export const mintMedicalNFT = async (metadata: MedicalNFTMetadata)
```

Mints a new NFT representing a medical record.

#### Process:
1. Generates NFT attributes from metadata
2. Creates metadata JSON structure
3. Uploads metadata to IPFS via Pinata
4. Mints NFT on Solana blockchain
5. Verifies successful minting

#### Error Handling:
- Implements retry logic for metadata upload (3 attempts)
- Implements retry logic for NFT minting (3 attempts)
- Verifies NFT existence on-chain after minting

#### Returns:
```typescript
{
  nftAddress: string;
  explorerUrl: string;
  metadataUri: string;
}
```

### 2. fetchMedicalReports

```typescript
export const fetchMedicalReports = async (walletAddress: string)
```

Retrieves all medical report NFTs owned by a wallet address.

#### Process:
1. Converts wallet address to PublicKey
2. Fetches all NFTs owned by the wallet
3. Processes each NFT's metadata
4. Returns formatted medical report data

#### Error Handling:
- Handles invalid URIs
- Handles missing metadata
- Returns minimal report objects for invalid NFTs

#### Returns:
```typescript
Array<{
  name: string;
  description: string;
  patient: string;
  doctor: string;
  date: string;
  image: string;
  ipfsHash: string;
  fileUrl: string;
  nftAddress: string;
  created_at: number;
}>
```

## Error Handling Strategy

The service implements a robust error handling strategy:

1. **Metadata Upload Retry Logic**:
   ```typescript
   let uploadRetries = 3;
   while (uploadRetries > 0) {
     try {
       // Upload attempt
     } catch (uploadError) {
       uploadRetries--;
       await new Promise(resolve => setTimeout(resolve, 3000));
     }
   }
   ```

2. **NFT Minting Retry Logic**:
   ```typescript
   let mintRetries = 3;
   while (mintRetries > 0) {
     try {
       // Minting attempt
     } catch (mintError) {
       mintRetries--;
       await new Promise(resolve => setTimeout(resolve, 5000));
     }
   }
   ```

3. **Transaction Verification**:
   - Waits for transaction confirmation
   - Verifies NFT account existence
   - Implements longer timeouts for network issues

## Best Practices

1. **Wallet Management**:
   - Secure private key handling
   - Fallback to development wallet when needed
   - Clear error messages for key parsing issues

2. **Transaction Handling**:
   - Uses 'confirmed' commitment level
   - Implements adequate timeouts
   - Verifies transaction success

3. **Metadata Management**:
   - Validates required fields
   - Handles optional attributes
   - Uses standardized metadata structure

4. **Error Recovery**:
   - Implements progressive retry delays
   - Returns meaningful error messages
   - Provides fallback data when possible

## Common Issues and Solutions

1. **Transaction Timeout**
   - Increase `confirmTransactionInitialTimeout`
   - Implement retry logic with longer intervals
   - Check network congestion

2. **Metadata Upload Failures**
   - Verify Pinata API credentials
   - Check file size limitations
   - Implement upload retries

3. **NFT Minting Failures**
   - Verify wallet balance
   - Check transaction fees
   - Validate metadata URI

## Usage Examples

### Minting a New Medical Record NFT
```typescript
const metadata = {
  patientName: "John Doe",
  doctorName: "Dr. Smith",
  date: new Date().toISOString(),
  reportName: "Annual Checkup Report",
  imageUrl: "ipfs://...",
  reportUrl: "ipfs://...",
  reportType: "Annual Checkup",
  patientAddress: "wallet_address",
  doctorAddress: "doctor_wallet_address"
};

const result = await mintMedicalNFT(metadata);
console.log(`NFT minted at: ${result.nftAddress}`);
```

### Fetching Medical Reports
```typescript
const walletAddress = "patient_wallet_address";
const reports = await fetchMedicalReports(walletAddress);
console.log(`Found ${reports.length} medical reports`);
```