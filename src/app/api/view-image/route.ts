// app/api/image/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bucket = searchParams.get('bucket');
  const file = searchParams.get('file');
  console.log("🚀 ~ GET ~ file:", file)

  if (!bucket || !file) {
    return NextResponse.json(
      { message: 'Bucket and file name are required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.URL_SERVER_IMAGE}/upload/view-image?bucket=${bucket}&file=${file}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: 'File not found' },
        { status: response.status }
      );
    }

    // Extract the content type from the response headers
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Create a new NextResponse with the image stream and appropriate headers
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
