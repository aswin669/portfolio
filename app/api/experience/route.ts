import { NextResponse } from 'next/server';
import { getAllExperience, createExperience } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function GET() {
  return NextResponse.json(await getAllExperience());
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = await createExperience(body);
  createLog({ type: 'admin', action: 'experience_created', severity: 'success', message: `Created experience: ${item.title} at ${item.company}` }).catch(() => {});
  return NextResponse.json(item, { status: 201 });
}
