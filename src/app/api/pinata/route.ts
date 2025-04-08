import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

const PINATA_JWT = process.env.PINATA_JWT;

/**
 * POST: Upload file to Pinata IPFS
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!PINATA_JWT) {
      return NextResponse.json({ error: 'Pinata JWT not configured' }, { status: 500 });
    }

    // Create a Node.js FormData instance for Pinata
    const pinataFormData = new FormData();

    // Convert the file to buffer and append to FormData
    const buffer = Buffer.from(await (file as File).arrayBuffer());
    pinataFormData.append('file', buffer, {
      filename: (file as File).name,
      contentType: (file as File).type,
    });

    // Set basic metadata
    const pinataMetadata = JSON.stringify({
      name: (file as File).name
    });
    pinataFormData.append('pinataMetadata', pinataMetadata);

    // Use CIDv1 for better compatibility
    const pinataOptions = JSON.stringify({
      cidVersion: 1
    });
    pinataFormData.append('pinataOptions', pinataOptions);

    console.log(`📤 Uploading file to Pinata: ${(file as File).name}`);
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      pinataFormData,
      {
        maxBodyLength: Infinity,
        headers: {
          ...pinataFormData.getHeaders(),
          Authorization: `Bearer ${PINATA_JWT}`
        }
      }
    );

    if (!response.data.IpfsHash) {
      return NextResponse.json({ error: 'No IPFS hash received' }, { status: 500 });
    }

    console.log(`✅ File uploaded successfully to IPFS with CID: ${response.data.IpfsHash}`);
    return NextResponse.json({
      success: true,
      ipfsHash: response.data.IpfsHash,
      size: (file as File).size,
      name: (file as File).name
    });
  } catch (error: any) {
    console.error('Error uploading to Pinata:', error);
    return NextResponse.json({
      error: error.message || 'Error uploading file',
      status: error.response?.status || 500
    }, { status: error.response?.status || 500 });
  }
}

/**
 * GET: Fetch file from Pinata IPFS
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ipfsHash = searchParams.get('ipfsHash');

    if (!ipfsHash) {
      return NextResponse.json({ error: 'IPFS hash is required' }, { status: 400 });
    }

    if (!PINATA_JWT) {
      return NextResponse.json({ error: 'Pinata JWT not configured' }, { status: 500 });
    }

    const response = await axios.get(
      `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      {
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`
        },
        responseType: 'arraybuffer' // Important for handling binary files
      }
    );

    // Check if the response is JSON by trying to parse it
    try {
      const textContent = Buffer.from(response.data).toString('utf-8');
      const jsonData = JSON.parse(textContent);
      
      // If it's our metadata JSON with a file URI, redirect to it
      if (jsonData?.properties?.files?.[0]?.uri) {
        return NextResponse.redirect(jsonData.properties.files[0].uri);
      }
    } catch (e) {
      // Not JSON, continue with binary response
    }

    // If not JSON or no URI to redirect to, return the binary data with proper content type
    const buffer = Buffer.from(response.data);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': response.headers['content-type'] || 'application/octet-stream',
        'Content-Length': buffer.length.toString()
      }
    });

  } catch (error: any) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({
      error: error.message || 'Error processing request',
      status: error.response?.status || 500
    }, { status: error.response?.status || 500 });
  }
}