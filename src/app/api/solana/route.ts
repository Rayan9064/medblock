import { NextRequest, NextResponse } from 'next/server';
import { mintMedicalNFT } from '../../services/solanaService';

/**
 * POST: Mint Medical NFT (Medical Record)
 */
export async function POST(req: NextRequest) {
  console.log("🚀 Starting NFT minting process for medical report");
  try {
    const metadata = await req.json();
    console.log("📋 Received metadata for NFT minting:", {
      reportName: metadata.reportName,
      patientName: metadata.patientName,
      doctorName: metadata.doctorName,
      reportType: metadata.reportType || "General",
      date: metadata.date
    });

    // Validate required fields
    const requiredFields = ['patientName', 'doctorName', 'date', 'reportName', 'imageUrl', 'reportUrl', 'patientAddress'];
    const missingFields = requiredFields.filter(field => !metadata[field]);
    
    if (missingFields.length > 0) {
      console.error("❌ Missing required fields:", missingFields.join(', '));
      return NextResponse.json({ error: 'Missing required fields', field: missingFields.join(', ') }, { status: 400 });
    }
    console.log("✅ All required fields present in metadata");

    // Mint the NFT
    console.log("🔐 Minting medical report NFT with transaction retry logic");
    const { nftAddress, explorerUrl, metadataUri } = await mintMedicalNFT(metadata);
    
    console.log("🎉 Medical Report NFT Minted Successfully!");
    console.log("🔗 NFT Mint Address:", nftAddress);
    console.log("🌐 NFT Explorer URL:", explorerUrl);
    console.log("📄 Metadata URI:", metadataUri);

    return NextResponse.json({
      success: true,
      nftAddress,
      explorerUrl,
      metadataUri
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("❌ Error minting NFT:", error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error("❌ Error details:", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
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

    const medicalReports = await import('../../services/solanaService')
      .then(module => module.fetchMedicalReports(walletAddress));

    return NextResponse.json({ 
      success: true, 
      medicalReports 
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("❌ Error fetching NFTs:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}