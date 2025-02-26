
import { Metaplex, keypairIdentity, bundlrStorage } from '@metaplex-foundation/js';
import { Connection, clusterApiUrl, Keypair } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config();

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const secretKey = Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY || '[]'));
const wallet = Keypair.fromSecretKey(secretKey);
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(wallet))
  .use(bundlrStorage());

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
    const nft = await metaplex.nfts().findByMint({ mintAddress });
    return nft.json;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    throw error;
  }
};
