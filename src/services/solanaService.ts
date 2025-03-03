
import { Metaplex, keypairIdentity, bundlrStorage } from '@metaplex-foundation/js';
import { Connection, clusterApiUrl, Keypair, PublicKey } from '@solana/web3.js';

// Instead of using dotenv, hardcode the private key from .env
const PRIVATE_KEY = [103,168,11,109,109,224,127,173,7,156,104,125,144,105,81,2,88,194,213,178,188,235,137,237,5,36,59,198,16,33,139,38,226,202,108,112,89,66,42,50,6,50,142,95,78,58,86,84,125,67,130,204,162,31,141,182,26,139,187,34,250,248,214,161];

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const secretKey = Uint8Array.from(PRIVATE_KEY);
const wallet = Keypair.fromSecretKey(secretKey);
const metaplex = Metaplex.make(connection).use(keypairIdentity(wallet)).use(bundlrStorage());

export const mintMedicalNFT = async (metadataUri: string, name: string) => {
  try {
    const { nft } = await metaplex.nfts().create({
      uri: metadataUri,
      name,
      sellerFeeBasisPoints: 0,
    });
    return nft.address.toString();
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
};

export const getNFTMetadata = async (mintAddress: string) => {
  try {
    const nft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(mintAddress) });
    return nft.json;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    throw error;
  }
};
