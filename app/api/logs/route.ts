export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getLogs, getLogSummary, createLog } from '@/lib/logs';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const summary = sp.get('summary');
  if (summary === 'true') {
    return NextResponse.json(await getLogSummary());
  }
  return NextResponse.json(await getLogs({
    type: sp.get('type') || undefined,
    severity: sp.get('severity') || undefined,
    search: sp.get('search') || undefined,
    dateFrom: sp.get('dateFrom') || undefined,
    dateTo: sp.get('dateTo') || undefined,
    page: parseInt(sp.get('page') || '1'),
    limit: parseInt(sp.get('limit') || '50'),
  }));
}
