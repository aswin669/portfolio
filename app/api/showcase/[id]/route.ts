export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { updateShowcaseItem, deleteShowcaseItem } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    const body = await req.json();
    const item = await updateShowcaseItem(id, body);
    createLog({
      type: 'admin',
      action: 'showcase_updated',
      severity: 'info',
      message: `Updated showcase item: ${id}`,
    }).catch(() => {});
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update showcase item' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    await deleteShowcaseItem(id);
    createLog({
      type: 'admin',
      action: 'showcase_deleted',
      severity: 'warning',
      message: `Deleted showcase item: ${id}`,
    }).catch(() => {});
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete showcase item' }, { status: 500 });
  }
}
