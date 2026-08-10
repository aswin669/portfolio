export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { deleteContact } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const ok = await deleteContact(parseInt(params.id));
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  createLog({ type: 'admin', action: 'contact_deleted', severity: 'warning', message: `Deleted contact #${params.id}` }).catch(() => {});
  return NextResponse.json({ ok: true });
}
