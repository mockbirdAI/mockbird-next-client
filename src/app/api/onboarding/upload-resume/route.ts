import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { url } from 'inspector';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') ?? '';

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(String(process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY));
    const containerClient = blobServiceClient.getContainerClient("resumes");
    const blockBlobClient = containerClient.getBlockBlobClient(filename);

    const stream = request.body;
    if (stream === null) {
      console.error("Stream is null");
      return NextResponse.json({ success: false, error: "No data to upload" });
    }

    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    let result: ReadableStreamReadResult<Uint8Array>;
    while (!(result = await reader.read()).done) {
      chunks.push(result.value);
    }
    const buffer = Buffer.concat(chunks);
    const streamLength = request.headers.get('content-length');

    await blockBlobClient.upload(buffer, Number(streamLength));
    
    return NextResponse.json({ success: true, url: blockBlobClient.url });
  } catch (error) {
    console.error(error);
    throw error
  }
}
