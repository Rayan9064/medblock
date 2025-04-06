// accessControl.ts
// Secure encryption key management and access control
import { PublicKey } from '@solana/web3.js';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import axios from 'axios';

// Interface for storing encryption keys with access controls
interface EncryptionKeyRecord {
  reportId: string;             // Unique identifier for the medical report
  encryptionKey: string;        // Base64 encoded encryption key
  iv: string;                   // Base64 encoded initialization vector
  patientAddress: string;       // Patient's wallet address (owner)
  authorizedDoctors: string[];  // Array of authorized doctor wallet addresses
  createdAt: number;            // Timestamp when the record was created
}

// In-memory storage for development (replace with secure database in production)
// This would be replaced by a secure database in production
const encryptionKeyStore: Map<string, EncryptionKeyRecord> = new Map();

/**
 * Store encryption key with access controls
 * @param reportId - Unique identifier for the medical report (can be NFT address)
 * @param encryptionKey - Base64 encoded encryption key
 * @param iv - Base64 encoded initialization vector
 * @param patientAddress - Patient's wallet address
 */
export const storeEncryptionKey = async (
  reportId: string,
  encryptionKey: string,
  iv: string,
  patientAddress: string
): Promise<boolean> => {
  try {
    // Create new encryption key record
    const keyRecord: EncryptionKeyRecord = {
      reportId,
      encryptionKey,
      iv,
      patientAddress,
      authorizedDoctors: [], // Initially empty - only patient has access
      createdAt: Date.now()
    };
    
    // Store in our secure storage
    encryptionKeyStore.set(reportId, keyRecord);
    console.log(`✅ Encryption key stored securely for report: ${reportId}`);
    
    // In production, this would save to a secure database with encryption at rest
    return true;
  } catch (error) {
    console.error("❌ Failed to store encryption key:", error);
    return false;
  }
};

/**
 * Retrieve encryption key if user has access
 * @param reportId - Unique identifier for the medical report
 * @param requestorAddress - Wallet address of the requestor
 * @returns Encryption key data or null if unauthorized
 */
export const getEncryptionKey = async (
  reportId: string,
  requestorAddress: string
): Promise<{ key: string; iv: string } | null> => {
  try {
    // Retrieve key record
    const keyRecord = encryptionKeyStore.get(reportId);
    if (!keyRecord) {
      console.error(`Key record not found for report: ${reportId}`);
      return null;
    }
    
    // Check access permission
    const hasAccess = 
      keyRecord.patientAddress === requestorAddress || 
      keyRecord.authorizedDoctors.includes(requestorAddress);
    
    if (!hasAccess) {
      console.error(`Unauthorized access attempt by ${requestorAddress}`);
      return null;
    }
    
    // Return key data to authorized requestor
    return {
      key: keyRecord.encryptionKey,
      iv: keyRecord.iv
    };
  } catch (error) {
    console.error("❌ Failed to retrieve encryption key:", error);
    return null;
  }
};

/**
 * Grant access to a doctor
 * @param reportId - Unique identifier for the medical report
 * @param patientAddress - Patient's wallet address (must be the owner)
 * @param doctorAddress - Doctor's wallet address to grant access to
 */
export const grantAccess = async (
  reportId: string,
  patientAddress: string,
  doctorAddress: string
): Promise<boolean> => {
  try {
    // Get the key record
    const keyRecord = encryptionKeyStore.get(reportId);
    if (!keyRecord) {
      console.error(`Key record not found for report: ${reportId}`);
      return false;
    }
    
    // Verify the patient is the owner
    if (keyRecord.patientAddress !== patientAddress) {
      console.error(`Only the owner (${keyRecord.patientAddress}) can grant access, not ${patientAddress}`);
      return false;
    }
    
    // Add doctor to authorized list if not already there
    if (!keyRecord.authorizedDoctors.includes(doctorAddress)) {
      keyRecord.authorizedDoctors.push(doctorAddress);
      encryptionKeyStore.set(reportId, keyRecord);
      console.log(`✅ Access granted to ${doctorAddress} for report ${reportId}`);
    } else {
      console.log(`Doctor ${doctorAddress} already has access to report ${reportId}`);
    }
    
    return true;
  } catch (error) {
    console.error("❌ Failed to grant access:", error);
    return false;
  }
};

/**
 * Revoke doctor's access to a medical report
 * @param reportId - Unique identifier for the medical report
 * @param patientAddress - Patient's wallet address (must be the owner)
 * @param doctorAddress - Doctor's wallet address to revoke access from
 */
export const revokeAccess = async (
  reportId: string,
  patientAddress: string,
  doctorAddress: string
): Promise<boolean> => {
  try {
    // Get the key record
    const keyRecord = encryptionKeyStore.get(reportId);
    if (!keyRecord) {
      console.error(`Key record not found for report: ${reportId}`);
      return false;
    }
    
    // Verify the patient is the owner
    if (keyRecord.patientAddress !== patientAddress) {
      console.error(`Only the owner (${keyRecord.patientAddress}) can revoke access, not ${patientAddress}`);
      return false;
    }
    
    // Remove doctor from authorized list
    keyRecord.authorizedDoctors = keyRecord.authorizedDoctors.filter(addr => addr !== doctorAddress);
    encryptionKeyStore.set(reportId, keyRecord);
    console.log(`✅ Access revoked from ${doctorAddress} for report ${reportId}`);
    
    return true;
  } catch (error) {
    console.error("❌ Failed to revoke access:", error);
    return false;
  }
};

/**
 * Check if a doctor has access to a medical report
 * @param reportId - Unique identifier for the medical report
 * @param doctorAddress - Doctor's wallet address to check
 */
export const checkAccess = async (
  reportId: string,
  doctorAddress: string
): Promise<boolean> => {
  try {
    const keyRecord = encryptionKeyStore.get(reportId);
    if (!keyRecord) {
      console.error(`Key record not found for report: ${reportId}`);
      return false;
    }
    
    return keyRecord.authorizedDoctors.includes(doctorAddress);
  } catch (error) {
    console.error("❌ Failed to check access:", error);
    return false;
  }
};

/**
 * List all medical reports a doctor has access to
 * @param doctorAddress - Doctor's wallet address
 */
export const listAccessibleReports = async (doctorAddress: string): Promise<string[]> => {
  try {
    const accessibleReports: string[] = [];
    
    for (const [reportId, keyRecord] of encryptionKeyStore.entries()) {
      if (keyRecord.authorizedDoctors.includes(doctorAddress)) {
        accessibleReports.push(reportId);
      }
    }
    
    return accessibleReports;
  } catch (error) {
    console.error("❌ Failed to list accessible reports:", error);
    return [];
  }
};
