# 💊 Decentralized Medical Report Tracking Tool — Backend

This backend handles the minting of medical report NFTs, decentralized storage on IPFS using **Pinata**, and interactions with the **Solana blockchain** using **Metaplex JS SDK**.

---

## 📂 **Project Structure**

```
backend/
├── src/
│   ├── services/
│   │   ├── metadataService.ts     # Handles metadata upload to IPFS
│   │   └── solanaService.ts       # Handles Solana transactions & NFT minting
│   ├── config/
│   │   └── env.ts                 # Environment variable configurations
│   ├── index.ts                   # Entry point
│   └── utils/
│       └── helpers.ts             # Helper functions
├── .env                           # Environment variables
├── package.json                   # Dependencies & scripts
└── README.md                      # This file
```

---

## ⚡ **Tech Stack**

- **Solana** — Blockchain platform  
- **Metaplex JS SDK** — NFT minting and management  
- **Pinata (IPFS)** — Decentralized storage for medical reports  
- **TypeScript** — Type-safe backend development  
- **dotenv** — Environment variable management  

---

## 📦 **Installation**

1. **Clone the Repository:**

```bash
git clone https://github.com/your-username/medblock-backend.git
cd medblock-backend
```

2. **Install Dependencies:**

```bash
npm install
```

3. **Set Up Environment Variables:**

Create a `.env` file in the root directory and add the following:

```env
# Solana Private Key (as JSON array)
PRIVATE_KEY=[your-solana-wallet-private-key]

# Pinata API Keys
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_API_KEY=your-pinata-secret-api-key

# Solana RPC URL (Devnet or Mainnet)
RPC_URL=https://api.devnet.solana.com
```

---

## 🚀 **Usage**

### ✅ **1. Mint Medical Report NFT**

Run the following command to mint a medical report NFT:

```bash
node src/index.js
```

This will:

- Upload the medical report metadata (PDF, thumbnail, etc.) to **IPFS**.
- Mint the **NFT** on **Solana Devnet**.
- Log the mint address and a link to view the NFT on **Solana Explorer**.

### 🛠️ **2. Example Code to Mint NFT**

```typescript
import { mintMedicalNFT } from './services/solanaService';

const metadata = {
  name: "Medical Report #001",
  symbol: "MEDNFT",
  description: "Patient: John Doe - Confidential Medical Record",
  image: "https://gateway.pinata.cloud/ipfs/<imageCID>", // Thumbnail
  properties: {
    files: [{
      uri: "https://gateway.pinata.cloud/ipfs/<pdfCID>", // Medical Report PDF
      type: "application/pdf"
    }]
  }
};

mintMedicalNFT(metadata);
```

---

## 🧠 **Key Functionalities**

- 📁 **Upload Files to IPFS** (using Pinata)  
- 🧾 **Mint NFTs** for medical records on **Solana**  
- 🔑 **Grant/Restrict Access** to specific wallet addresses (using Metadata updates)  
- 🧬 **Fully Decentralized Data Storage**  

---

## 🐛 **Troubleshooting**

- **`Cannot find module '@metaplex-foundation/js'`**  
  → Run: `npm install @metaplex-foundation/js @solana/web3.js`

- **TypeScript Errors?**  
  → Restart TS server: `Ctrl+Shift+P` → **“TypeScript: Restart TS server”**

- **Metadata Not Visible on Solana Explorer?**  
  → Verify that the metadata JSON was correctly uploaded to IPFS.

---

## 💖 **Contributing**

Feel free to open issues, pull requests, or suggest new features!

---

## 📜 **License**

MIT License © 2024 **Your Name**

---

This `README.md` covers everything from setting up to minting NFTs and handling access. Let me know if you'd like any tweaks! 🚀