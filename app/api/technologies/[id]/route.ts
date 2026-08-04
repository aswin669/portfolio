import { NextResponse } from 'next/server';
import { deleteTechnology } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const deleted = await deleteTechnology(Number(params.id));
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  createLog({ type: 'admin', action: 'technology_deleted', severity: 'warning', message: `Deleted technology #${params.id}` }).catch(() => {});
  return NextResponse.json({ success: true });
}
