import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { headers } from 'next/headers';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

// Ensure the upload directory exists
const ensureUploadDir = async () => {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
      console.log('Created upload directory:', UPLOAD_DIR);
    }
  } catch (error) {
    console.error('Failed to create upload directory:', error);
    throw new Error(
      `Failed to create upload directory: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

// Get base URL from request
const getBaseUrl = (req: NextRequest) => {
  try {
    const headersList = headers();
    const host =
      headersList.get('host') || req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const url = `${protocol}://${host}`;
    console.log('Generated base URL:', url);
    return url;
  } catch (error) {
    console.error('Error generating base URL:', error);
    // Fallback to localhost if there's an error
    return 'http://localhost:3000';
  }
};

export async function POST(req: NextRequest) {
  try {
    console.log('Upload request received');

    // Make sure upload directory exists
    await ensureUploadDir();

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('File received:', file.name, 'size:', file.size);

    // Generate a unique filename
    const uniqueId = uuidv4();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const newFilename = `${uniqueId}.${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, newFilename);

    // Convert file to ArrayBuffer
    const buffer = await file.arrayBuffer();

    // Save file
    await writeFile(filePath, Buffer.from(buffer));
    console.log('File saved to:', filePath);

    // Get base URL
    const baseUrl = getBaseUrl(req);

    // Return the full URL to the uploaded file
    const imageUrl = `${baseUrl}/uploads/${newFilename}`;
    console.log('Generated imageUrl:', imageUrl);

    return NextResponse.json({
      success: true,
      imageUrl,
      filename: newFilename,
      size: file.size,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
