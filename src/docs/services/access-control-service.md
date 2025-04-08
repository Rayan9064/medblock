# Access Control Service Documentation

## Overview

The Access Control Service (`accessControl.ts`) manages permissions and access rights for medical records in the MedBlock system. It implements a secure key management system that controls which doctors can access specific patient records.

## Core Components

### Encryption Key Record Structure
```typescript
interface EncryptionKeyRecord {
  reportId: string;             // Unique identifier for the medical report
  encryptionKey: string;        // Base64 encoded encryption key
  iv: string;                   // Base64 encoded initialization vector
  patientAddress: string;       // Patient's wallet address (owner)
  authorizedDoctors: string[];  // Array of authorized doctor wallet addresses
  createdAt: number;           // Timestamp when the record was created
}
```

## Main Functions

### 1. storeEncryptionKey

```typescript
export const storeEncryptionKey = async (
  reportId: string,
  encryptionKey: string,
  iv: string,
  patientAddress: string
): Promise<boolean>
```

Stores encryption key with access controls for a medical report.

#### Process:
1. Creates new encryption key record
2. Associates it with patient's wallet
3. Initializes empty authorized doctors list
4. Stores in secure storage

#### Security Measures:
- Only stores encrypted keys
- Validates patient ownership
- Timestamps record creation

#### Usage:
```typescript
const stored = await storeEncryptionKey(
  "report_123",
  "base64_encrypted_key",
  "base64_iv",
  "patient_wallet_address"
);
```

### 2. getEncryptionKey

```typescript
export const getEncryptionKey = async (
  reportId: string,
  requestorAddress: string
): Promise<{ key: string; iv: string } | null>
```

Retrieves encryption key if requestor has access rights.

#### Process:
1. Retrieves key record
2. Verifies requestor authorization
3. Returns key data if authorized

#### Access Validation:
- Checks if requestor is patient
- Verifies doctor authorization
- Validates record existence

#### Usage:
```typescript
const keyData = await getEncryptionKey(
  "report_123",
  "doctor_wallet_address"
);
```

### 3. grantAccess

```typescript
export const grantAccess = async (
  reportId: string,
  patientAddress: string,
  doctorAddress: string
): Promise<boolean>
```

Grants a doctor access to a medical report.

#### Process:
1. Verifies patient ownership
2. Adds doctor to authorized list
3. Updates access record

#### Security Checks:
- Validates patient ownership
- Prevents duplicate authorizations
- Logs access changes

#### Usage:
```typescript
const granted = await grantAccess(
  "report_123",
  "patient_wallet_address",
  "doctor_wallet_address"
);
```

### 4. revokeAccess

```typescript
export const revokeAccess = async (
  reportId: string,
  patientAddress: string,
  doctorAddress: string
): Promise<boolean>
```

Removes a doctor's access to a medical report.

#### Process:
1. Verifies patient ownership
2. Removes doctor from authorized list
3. Updates access record

#### Security Measures:
- Validates patient ownership
- Immediate access removal
- Logs access changes

#### Usage:
```typescript
const revoked = await revokeAccess(
  "report_123",
  "patient_wallet_address",
  "doctor_wallet_address"
);
```

### 5. checkAccess

```typescript
export const checkAccess = async (
  reportId: string,
  doctorAddress: string
): Promise<boolean>
```

Verifies if a doctor has access to a specific report.

#### Process:
1. Retrieves access record
2. Checks authorization list
3. Returns access status

#### Usage:
```typescript
const hasAccess = await checkAccess(
  "report_123",
  "doctor_wallet_address"
);
```

### 6. listAccessibleReports

```typescript
export const listAccessibleReports = async (
  doctorAddress: string
): Promise<string[]>
```

Lists all reports a doctor has access to.

#### Process:
1. Scans all access records
2. Filters for doctor's access
3. Returns list of report IDs

#### Usage:
```typescript
const reports = await listAccessibleReports("doctor_wallet_address");
```

## Security Features

1. **Access Control**
   - Wallet-based authentication
   - Role-based permissions
   - Granular access control

2. **Data Protection**
   - Encrypted key storage
   - Secure access records
   - Audit trail support

3. **Authorization Flow**
   - Patient-controlled access
   - Immediate access updates
   - Access verification

## Best Practices

1. **Access Management**
   - Regular access reviews
   - Access logging
   - Clear revocation process

2. **Key Management**
   - Secure key storage
   - Key rotation support
   - Encryption at rest

3. **Error Handling**
   - Clear error messages
   - Access denial logging
   - Security event tracking

4. **Data Integrity**
   - Transaction validation
   - State consistency
   - Audit trails

## Common Issues and Solutions

1. **Access Denied**
   - Verify wallet ownership
   - Check authorization status
   - Review access logs

2. **Key Retrieval Failures**
   - Validate record existence
   - Check access permissions
   - Verify key format

3. **Permission Updates**
   - Confirm patient ownership
   - Verify doctor's address
   - Check record status

## Integration Examples

### Managing Doctor Access
```typescript
// Grant access to a new doctor
async function addNewDoctor(reportId: string, patient: string, doctor: string) {
  // Grant access
  const granted = await grantAccess(reportId, patient, doctor);
  
  // Verify access
  const hasAccess = await checkAccess(reportId, doctor);
  
  return {
    granted,
    verified: hasAccess
  };
}

// Review and update access
async function reviewAccess(doctorAddress: string) {
  const accessibleReports = await listAccessibleReports(doctorAddress);
  
  return {
    reportCount: accessibleReports.length,
    reports: accessibleReports
  };
}
```

### Secure Key Management
```typescript
// Store and retrieve keys securely
async function manageReportAccess(
  reportId: string,
  encryptionKey: string,
  iv: string,
  patient: string
) {
  // Store key
  await storeEncryptionKey(reportId, encryptionKey, iv, patient);
  
  // Retrieve key (as patient)
  const keyData = await getEncryptionKey(reportId, patient);
  
  return keyData !== null;
}
```