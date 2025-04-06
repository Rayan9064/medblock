import { NextRequest, NextResponse } from 'next/server';
import { PinataError } from '@/services/pinataService';
import axios from 'axios';
import FormData from 'form-data';

const PINATA_JWT = process.env.PINATA_JWT; // Note: No longer NEXT_PUBLIC_

/**
 * POST: Upload file to Pinata IPFS
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const metadata = formData.get('metadata') ? JSON.parse(formData.get('metadata') as string) : null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!PINATA_JWT) {
      return NextResponse.json({ error: 'Pinata JWT not configured' }, { status: 500 });
    }

    // Create a Node.js FormData instance
    const pinataFormData = new FormData();

    // Convert the file to buffer and append to FormData
    const buffer = Buffer.from(await (file as File).arrayBuffer());
    pinataFormData.append('file', buffer, {
      filename: (file as File).name,
      contentType: (file as File).type,
    });

    const pinataMetadata = JSON.stringify({
      name: (file as File).name,
      keyvalues: {
        access: "private"
      }
    });
    pinataFormData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 1
    });
    pinataFormData.append('pinataOptions', pinataOptions);

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
        responseType: 'arraybuffer',
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`
        }
      }
    );

    // Create response with proper content type
    const buffer = Buffer.from(response.data);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': response.headers['content-type'] || 'application/octet-stream',
        'Content-Length': buffer.length.toString()
      }
    });
  } catch (error: any) {
    console.error('Error fetching from Pinata:', error);
    return NextResponse.json({
      error: error.message || 'Error fetching file',
      status: error.response?.status || 500
    }, { status: error.response?.status || 500 });
  }
}