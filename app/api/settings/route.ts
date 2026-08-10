export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAllSettings, upsertSetting } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function GET() {
  return NextResponse.json(await getAllSettings());
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  for (const [key, value] of Object.entries(body)) {
    await upsertSetting(key, String(value));
  }
  if (body.admin_password) {
    createLog({ type: 'admin', action: 'password_changed', severity: 'warning', message: 'Admin password changed' }).catch(() => {});
  }
  createLog({ type: 'admin', action: 'settings_updated', severity: 'info', message: `Settings updated: ${Object.keys(body).filter(k => k !== 'admin_password').join(', ')}` }).catch(() => {});
  return NextResponse.json(await getAllSettings());
}
