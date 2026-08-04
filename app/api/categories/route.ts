import { NextResponse } from 'next/server';
import { getAllCategories, createCategory } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function GET() {
  return NextResponse.json(await getAllCategories());
}

export async function POST(req: Request) {
  const body = await req.json();
  const cat = await createCategory(body);
  createLog({ type: 'admin', action: 'category_created', severity: 'success', message: `Created category: ${cat.name}` }).catch(() => {});
  return NextResponse.json(cat, { status: 201 });
}
