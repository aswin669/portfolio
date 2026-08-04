import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { createMediaItem } from '@/lib/db';
import { createLog } from '@/lib/logs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'portfolio', resource_type: 'auto' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

  const asset = await createMediaItem({
    name: file.name,
    url: result.secure_url,
    type: file.type || 'image/jpeg',
    size: file.size,
  });

  createLog({ type: 'file_upload', action: 'file_uploaded', severity: 'success', message: `Uploaded: ${file.name}`, details: { url: result.secure_url } }).catch(() => {});
  return NextResponse.json(asset, { status: 201 });
}
