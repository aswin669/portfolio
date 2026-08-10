export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getMediaItem, updateMediaItem, deleteMediaItem } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const item = await getMediaItem(Number(params.id));
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = await updateMediaItem(Number(params.id), body);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  createLog({ type: 'file_upload', action: 'media_updated', severity: 'info', message: `Updated media: ${updated.name}` }).catch(() => {});
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const item = await getMediaItem(Number(params.id));
  const deleted = await deleteMediaItem(Number(params.id));
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  createLog({ type: 'file_upload', action: 'media_deleted', severity: 'warning', message: `Deleted media: ${item?.name || params.id}` }).catch(() => {});
  return NextResponse.json({ success: true });
}
