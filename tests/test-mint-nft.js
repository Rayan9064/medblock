// Test script to mint a medical NFT using a sample CID and Pinata JWT authentication
// Usage: node tests/test-mint-nft.js

async function testMintNFT() {
  console.log("🧪 Testing Medical NFT Minting with Pinata JWT Authentication...");
  
  // The IPFS CID provided for testing
  const reportCID = "QmZbge4QZaUFeJsfqyrPLRCivvxoZo7s2wzLvsX2zhRfGm";
  
  // Sample test data with required fields - updated for JWT authentication
  const testData = {
    patientName: "Test Patient",
    doctorName: "Dr. Test Doctor",
    date: "2025-04-06", // Current date
    reportName: "COVID-19 Test Results",
    reportType: "Lab Test",
    symbol: "MEDNFT", // Adding the symbol field
    imageUrl: "https://gateway.pinata.cloud/ipfs/QmZbge4QZaUFeJsfqyrPLRCivvxoZo7s2wzLvsX2zhRfGm", // Using same CID for image
    reportUrl: `https://gateway.pinata.cloud/ipfs/${reportCID}`,
    patientAddress: "7XSvJSVJCY9DmD8SFiAKYfwRLxhX8qKNpqzqoJJhUgxv", // Test Solana address
    doctorAddress: "BKXcg1ZshAyCKPg3zxY7xfMNFXhguvXC4f7JEgT83aDW", // Test Solana address
    isPrivate: true, // Flag for Pinata private file access
    originalFileHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", // Sample SHA-256 hash
    
    // Add access control method specific to JWT authentication
    access: {
      method: "pinata_authenticated", 
      isPrivate: true
    },
    
    // Add metadataCID for the JWT-authenticated workflow
    metadataCID: "QmZbge4QZaUFeJsfqyrPLRCivvxoZo7s2wzLvsX2zhRfGm", // Using same CID for quick testing
    
    // Add record ID for better tracking
    recordId: `MED-${Date.now()}`
  };

  try {
    console.log("📤 Sending request to mint NFT with test data:", {
      reportName: testData.reportName,
      patientName: testData.patientName,
      reportUrl: testData.reportUrl,
      isPrivate: testData.isPrivate,
      accessMethod: testData.access.method
    });

    // Make POST request to the API endpoint
    const response = await fetch('http://localhost:3000/api/solana', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    // Parse and log the response
    const responseData = await response.json();
    
    if (response.ok) {
      console.log("✅ NFT Minted Successfully!");
      console.log("🔗 NFT Address:", responseData.nftAddress);
      console.log("🌐 Explorer URL:", responseData.explorerUrl);
      console.log("📄 Metadata URI:", responseData.metadataUri);
      console.log("🔒 Private File:", responseData.isPrivate ? "Yes (JWT Protected)" : "No");
      console.log("🔑 Access Method:", responseData.accessMethod || "N/A");
    } else {
      console.error("❌ Error minting NFT:", responseData.error);
      if (responseData.field) {
        console.error("📋 Missing fields:", responseData.field);
      }
      if (responseData.cause) {
        console.error("🔍 Error cause:", responseData.cause);
      }
    }
    
    return responseData;
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
    throw error;
  }
}

// Execute the test
testMintNFT()
  .then(result => {
    console.log("🏁 Test completed!");
  })
  .catch(err => {
    console.error("💥 Test failed:", err);
  });