import { NextRequest, NextResponse } from 'next/server';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import { Connection, clusterApiUrl, Keypair, PublicKey } from '@solana/web3.js';
// import axios from 'axios';

// 🔗 Connect to Solana Devnet
const rpcUrl = clusterApiUrl('devnet');
const connection = new Connection(rpcUrl, 'confirmed');

// 🔑 Load Solana wallet from environment variables
if (!process.env.NEXT_PUBLIC_SOLANA_SECRET_KEY) {
  throw new Error('NEXT_PUBLIC_SOLANA_SECRET_KEY environment variable is not defined');
}

const secretKeyArray = JSON.parse(process.env.NEXT_PUBLIC_SOLANA_SECRET_KEY);
const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));

// 🎭 Initialize Metaplex
const metaplex = Metaplex.make(connection).use(keypairIdentity(wallet));

/**
 * POST: Mint Medical NFT (Medical Record)
 */
export async function POST(req: NextRequest) {
  try {
    const metadata = await req.json();

    if (!metadata.patientName || !metadata.doctorName || !metadata.date || !metadata.reportName || !metadata.imageUrl || !metadata.reportUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 🏥 Medical Report Metadata
    const medicalMetadata = {
      name: metadata.reportName,
      symbol: "MEDNFT",
      description: `Patient: ${metadata.patientName} - Confidential Medical Record`,
      image: metadata.imageUrl,
      attributes: [
        { trait_type: "Patient", value: metadata.patientName },
        { trait_type: "Doctor", value: metadata.doctorName },
        { trait_type: "Date", value: metadata.date }
      ],
      properties: {
        files: [{ uri: metadata.reportUrl, type: "application/pdf" }]
      }
    };

    console.log("⏳ Uploading Metadata to IPFS...");
    const { uri } = await metaplex.nfts().uploadMetadata(medicalMetadata);
    console.log("✅ Metadata uploaded to IPFS:", uri);

    console.log("⏳ Minting Medical Report NFT...");
    const { nft } = await metaplex.nfts().create({
      uri: uri,
      name: medicalMetadata.name,
      sellerFeeBasisPoints: 0, // No royalties
    });

    console.log("🎉 Medical Report NFT Minted Successfully!");
    console.log("🔗 NFT Mint Address:", nft.address.toString());

    return NextResponse.json({
      success: true,
      nftAddress: nft.address.toString(),
      explorerUrl: `https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("❌ Error minting NFT:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message: 'Unknown error' }, { status: 500 });
  }
}

/**
 * GET: Fetch Medical NFTs
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    const owner = new PublicKey(walletAddress);
    const nfts = await metaplex.nfts().findAllByOwner({ owner });

    return NextResponse.json({ success: true, nfts }, { status: 200 });
    // const medicalReports = await Promise.all(
    //   nfts.map(async (nft) => {
    //   if (!nft.uri || !nft.address) return null;
    //   try {
    //     const metadataResponse = await axios.get(nft.uri);
    //     const metadata = metadataResponse.data;

    //     return {
    //     name: nft.name || "Unknown Report",
    //     description: metadata.description || "No description",
    //     patient: metadata.attributes?.find((attr: any) => attr.trait_type === "Patient")?.value || "Unknown",
    //     doctor: metadata.attributes?.find((attr: any) => attr.trait_type === "Doctor")?.value || "Unknown",
    //     date: metadata.attributes?.find((attr: any) => attr.trait_type === "Date")?.value || "Unknown",
    //     image: metadata.image || "",
    //     uri: nft.uri,
    //     fileUrl: metadata.properties?.files[0]?.uri || "",
    //     nftAddress: nft.address.toString(),
    //     mintAddress: nft.mintAddress,
    //     creators: nft.creators
    //     };
    //   } catch (error) {
    //     console.error(`❌ Error fetching metadata for NFT: ${nft.address.toString()}`, error);
    //     return null;
    //   }
    //   })
    // );

    // return NextResponse.json({ success: true, medicalReports: medicalReports.filter((report) => report !== null) }, { status: 200 });
  } catch (error: unknown) {
    console.error("❌ Error fetching NFTs:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
