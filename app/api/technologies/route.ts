export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAllTechnologies, createTechnology } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function GET() {
  return NextResponse.json(await getAllTechnologies());
}

export async function POST(req: Request) {
  const body = await req.json();
  const tech = await createTechnology(body);
  createLog({ type: 'admin', action: 'technology_created', severity: 'success', message: `Created technology: ${tech.name}` }).catch(() => {});
  return NextResponse.json(tech, { status: 201 });
}
