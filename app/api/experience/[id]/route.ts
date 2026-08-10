export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { updateExperience, deleteExperience } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const item = await updateExperience(parseInt(params.id), body);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  createLog({ type: 'admin', action: 'experience_updated', severity: 'info', message: `Updated experience: ${item.title}` }).catch(() => {});
  return NextResponse.json(item);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const ok = await deleteExperience(parseInt(params.id));
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  createLog({ type: 'admin', action: 'experience_deleted', severity: 'warning', message: `Deleted experience #${params.id}` }).catch(() => {});
  return NextResponse.json({ ok: true });
}
