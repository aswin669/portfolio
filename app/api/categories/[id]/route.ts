export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { deleteCategory } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const deleted = await deleteCategory(Number(params.id));
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  createLog({ type: 'admin', action: 'category_deleted', severity: 'warning', message: `Deleted category #${params.id}` }).catch(() => {});
  return NextResponse.json({ success: true });
}
