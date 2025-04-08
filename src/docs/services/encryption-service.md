# Encryption Service Documentation (Deprecated)

## Overview

The Encryption Service (`encryptionService.ts`) was originally designed to provide client-side encryption for medical records before storage. This service has been deprecated in favor of Pinata's private file storage with JWT authentication, but the implementation is kept for reference and legacy support.

## Deprecation Notice

This service is no longer actively used in the MedBlock system. All new implementations should use Pinata's private storage features instead. The functions in this service now act as pass-through wrappers to maintain API compatibility during the migration period.

## Original Implementation (Commented Out)

### Core Functions

#### 1. generateEncryptionKey

```typescript
async function generateEncryptionKey(): Promise<CryptoKey>
```

Generated AES-GCM-256 encryption keys for secure file encryption.

#### Process (Historical):
1. Used Web Crypto API
2. Generated AES-GCM keys
3. Supported encrypt/decrypt operations

#### Current Implementation:
```typescript
export async function generateEncryptionKey(): Promise<any> {
  console.log("⚠️ Encryption is deprecated - using Pinata private storage instead");
  return {};
}
```

#### 2. encryptFile

```typescript
async function encryptFile(
  file: File, 
  encryptionKey: CryptoKey
): Promise<Blob>
```

Originally performed client-side file encryption.

#### Historical Process:
1. Generated random IV
2. Encrypted file data
3. Combined IV and encrypted data
4. Returned encrypted blob

#### Current Implementation:
```typescript
export async function encryptFile(
  file: File, 
  encryptionKey: any
): Promise<Blob> {
  console.log("⚠️ Encryption is deprecated - using Pinata private storage instead");
  return new Blob([await file.arrayBuffer()], { type: file.type });
}
```

#### 3. exportKey

```typescript
async function exportKey(key: CryptoKey): Promise<string>
```

Converted encryption keys to Base64 format for storage.

#### Historical Process:
1. Exported raw key data
2. Converted to Base64
3. Prepared for secure storage

#### Current Implementation:
```typescript
export async function exportKey(key: any): Promise<string> {
  console.log("⚠️ Encryption is deprecated - using Pinata private storage instead");
  return "pinata-private-storage";
}
```

#### 4. decryptFile

```typescript
async function decryptFile(
  encryptedBlob: Blob, 
  key: CryptoKey
): Promise<Blob>
```

Handled decryption of encrypted medical records.

#### Historical Process:
1. Extracted IV from blob
2. Separated encrypted data
3. Performed decryption
4. Validated output

#### Current Implementation:
```typescript
export async function decryptFile(
  blob: Blob, 
  key: any
): Promise<Blob> {
  console.log("⚠️ Decryption is deprecated - using Pinata private storage instead");
  return blob;
}
```

## Technical Details (Historical Implementation)

### Encryption Algorithm
- **Type**: AES-GCM
- **Key Length**: 256 bits
- **IV Length**: 12 bytes
- **Implementation**: Web Crypto API

### Security Features
- Cryptographically secure random IV generation
- Authenticated encryption (GCM mode)
- Key export restrictions
- Secure error handling

### Data Format
```typescript
// Encrypted blob structure
[
  IV (12 bytes),
  Encrypted Data (variable length)
]
```

## Migration Guide

### Moving to Pinata Private Storage

1. **Update Storage Calls**
   ```typescript
   // Old approach
   const key = await generateEncryptionKey();
   const encrypted = await encryptFile(file, key);
   
   // New approach
   const response = await fetch('/api/pinata/private', {
     method: 'POST',
     body: file
   });
   ```

2. **Access Control**
   ```typescript
   // Old approach
   const decrypted = await decryptFile(blob, key);
   
   // New approach
   const response = await fetch(`/api/pinata/private/${cid}`, {
     headers: {
       'Authorization': `Bearer ${JWT_TOKEN}`
     }
   });
   ```

3. **Error Handling**
   ```typescript
   // Update error handling for Pinata API responses
   if (!response.ok) {
     const error = await response.json();
     throw new Error(`Pinata API Error: ${error.message}`);
   }
   ```

## Security Considerations

### Historical Implementation
- Client-side encryption
- Key management complexity
- Manual IV handling
- Custom security implementations

### Current Approach (Pinata Private Storage)
- Server-side security
- JWT-based authentication
- Managed access control
- Industry-standard security

## Best Practices

1. **New Implementations**
   - Use Pinata's private storage
   - Implement proper JWT handling
   - Follow Pinata's security guidelines

2. **Legacy Support**
   - Maintain compatibility layer
   - Log deprecation warnings
   - Plan complete migration

3. **Security Awareness**
   - Monitor security updates
   - Follow HIPAA guidelines
   - Regular security audits

## Common Issues and Solutions

### Legacy System Integration
- Use wrapper functions
- Maintain API compatibility
- Log migration notices

### Data Migration
- Implement gradual migration
- Verify data integrity
- Maintain access controls

### Security Compliance
- Follow healthcare regulations
- Document security measures
- Regular security reviews