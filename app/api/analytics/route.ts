import { NextRequest, NextResponse } from 'next/server';
import { recordVisit, getAnalytics } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { path } = await req.json();
  await recordVisit(path);
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const daysParam = req.nextUrl.searchParams.get('days') || '7';
  const days = Math.min(Math.max(parseInt(daysParam) || 7, 1), 365);
  const data = await getAnalytics(days);
  return NextResponse.json(data);
}
