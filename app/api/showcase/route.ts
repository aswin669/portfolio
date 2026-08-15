export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAllShowcaseItems, createShowcaseItem } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function GET() {
  const items = await getAllShowcaseItems();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.image_url) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    const item = await createShowcaseItem(body);
    createLog({
      type: 'admin',
      action: 'showcase_created',
      severity: 'success',
      message: `Created showcase item: ${item.title || item.id}`,
    }).catch(() => {});
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create showcase item' }, { status: 500 });
  }
}
