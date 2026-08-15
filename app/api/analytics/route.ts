export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { recordVisit, getAnalytics } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const headers = req.headers;

    const ip = headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || '127.0.0.1';
    const country = headers.get('x-vercel-ip-country') || headers.get('cf-ipcountry') || body.country || 'India';
    const region = headers.get('x-vercel-ip-country-region') || body.region || 'Kerala';
    const city = headers.get('x-vercel-ip-city') || body.city || 'Kochi';

    await recordVisit({
      path: body.path || '/',
      visitorId: body.visitorId || '',
      sessionId: body.sessionId || '',
      referrer: body.referrer || 'Direct / None',
      deviceType: body.deviceType || 'Desktop',
      os: body.os || 'Unknown',
      browser: body.browser || 'Unknown',
      screenRes: body.screenRes || '',
      language: body.language || '',
      country,
      region,
      city,
      ip,
      durationSeconds: body.durationSeconds || 0,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7') || 7;
    const page = parseInt(searchParams.get('page') || '1') || 1;
    const limit = parseInt(searchParams.get('limit') || '15') || 15;
    const search = searchParams.get('search') || '';
    const country = searchParams.get('country') || '';
    const device = searchParams.get('device') || '';

    const data = await getAnalytics({ days, page, limit, search, country, device });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
