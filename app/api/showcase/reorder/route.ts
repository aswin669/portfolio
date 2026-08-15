export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { reorderShowcaseItems } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function POST(req: Request) {
  try {
    const { orderedIds } = await req.json();
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds array required' }, { status: 400 });
    }
    await reorderShowcaseItems(orderedIds);
    createLog({
      type: 'admin',
      action: 'showcase_reordered',
      severity: 'info',
      message: `Reordered showcase items`,
    }).catch(() => {});
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to reorder items' }, { status: 500 });
  }
}
