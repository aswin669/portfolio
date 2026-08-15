export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { exportAnalyticsCSV } from '@/lib/db';

export async function GET() {
  try {
    const csvData = await exportAnalyticsCSV();
    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="portfolio_analytics_export.csv"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
