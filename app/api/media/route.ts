import { NextResponse } from 'next/server';
import { getAllMedia, createMediaItem } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function GET() {
  return NextResponse.json(await getAllMedia());
}

export async function POST(req: Request) {
  const body = await req.json();
  const asset = await createMediaItem(body);
  createLog({ type: 'file_upload', action: 'media_created', severity: 'success', message: `Created media: ${asset.name}`, details: { url: asset.url } }).catch(() => {});
  return NextResponse.json(asset, { status: 201 });
}
