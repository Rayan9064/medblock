/**
 * ENCRYPTION SERVICE - DEPRECATED
 * 
 * This file contains client-side encryption/decryption methods that are no longer used.
 * The application now uses Pinata's private file storage with JWT authentication instead.
 * 
 * These functions are kept for reference but are commented out to prevent accidental use.
 */

/*
export async function generateEncryptionKey(): Promise<CryptoKey> {
  console.log("🔑 Generating new AES-GCM-256 encryption key");
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  console.log("✅ Encryption key generated successfully");
  return key;
}

export async function encryptFile(file: File, encryptionKey: CryptoKey): Promise<Blob> {
  console.log(`🔒 Encrypting file: ${file.name} (${Math.round(file.size / 1024)} KB)`);
  const fileBuffer = await file.arrayBuffer();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  console.log(`📊 Generated random IV: ${Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('')}`);

  console.log("⏳ Encrypting file data with AES-GCM...");
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    encryptionKey,
    fileBuffer
  );
  console.log(`✅ File encrypted successfully. Original: ${file.size} bytes → Encrypted: ${encryptedBuffer.byteLength} bytes`);

  // Prepare the combined buffer (IV + encrypted data)
  const combinedBuffer = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  combinedBuffer.set(iv, 0);
  combinedBuffer.set(new Uint8Array(encryptedBuffer), iv.length);
  console.log(`📦 Combined buffer created: IV (${iv.length} bytes) + encrypted data (${encryptedBuffer.byteLength} bytes)`);

  return new Blob([combinedBuffer], { type: file.type });
}

export async function exportKey(key: CryptoKey): Promise<string> {
  console.log("🔑 Exporting encryption key to Base64 format");
  const raw = await crypto.subtle.exportKey("raw", key);
  const base64Key = btoa(String.fromCharCode(...new Uint8Array(raw)));
  console.log(`✅ Key exported successfully. Length: ${base64Key.length} chars`);
  return base64Key;
}

export async function decryptFile(encryptedBlob: Blob, key: CryptoKey): Promise<Blob> {
  console.log("🔓 Starting decryption of blob size:", encryptedBlob.size, "bytes");
  
  // Get the combined buffer
  const combinedBuffer = await encryptedBlob.arrayBuffer();
  console.log("📦 Combined buffer size:", combinedBuffer.byteLength, "bytes");
  
  if (combinedBuffer.byteLength < 12) {
    throw new Error("Invalid encrypted data: too small to contain IV");
  }
  
  // Extract the IV (first 12 bytes)
  const iv = new Uint8Array(combinedBuffer.slice(0, 12));
  console.log("🔑 Extracted IV:", Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''));
  
  // Check if IV appears valid
  const hasNonZeroBytes = Array.from(iv).some(byte => byte !== 0);
  if (!hasNonZeroBytes) {
    throw new Error("Invalid IV: contains only zero bytes");
  }
  
  // Extract the encrypted data
  const encryptedData = combinedBuffer.slice(12);
  console.log("🔒 Encrypted data size:", encryptedData.byteLength, "bytes");

  try {
    // Decrypt the data
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedData
    );
    
    console.log("✅ Decryption successful! Decrypted size:", decryptedBuffer.byteLength, "bytes");
    const firstBytes = new Uint8Array(decryptedBuffer.slice(0, Math.min(20, decryptedBuffer.byteLength)));
    console.log("📊 First bytes of decrypted data:", Array.from(firstBytes).map(b => b.toString(16).padStart(2, '0')).join(' '));
    
    // Return the decrypted data as a Blob
    return new Blob([decryptedBuffer]);
  } catch (error) {
    console.error("❌ Decryption failed:", error);
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
*/

// Dummy functions to maintain API compatibility during migration
export async function generateEncryptionKey(): Promise<any> {
  console.log("⚠️ Encryption is deprecated - using Pinata private storage instead");
  return {};
}

export async function encryptFile(file: File, encryptionKey: any): Promise<Blob> {
  console.log("⚠️ Encryption is deprecated - using Pinata private storage instead");
  return new Blob([await file.arrayBuffer()], { type: file.type });
}

export async function exportKey(key: any): Promise<string> {
  console.log("⚠️ Encryption is deprecated - using Pinata private storage instead");
  return "pinata-private-storage";
}

export async function decryptFile(blob: Blob, key: any): Promise<Blob> {
  console.log("⚠️ Decryption is deprecated - using Pinata private storage instead");
  return blob;
}