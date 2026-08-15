export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getPublicShowcaseItems } from '@/lib/db';

export async function GET() {
  const items = await getPublicShowcaseItems();
  return NextResponse.json(items);
}
