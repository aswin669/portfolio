import { NextResponse } from 'next/server';
import { getAllTestimonials, createTestimonial } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function GET() {
  return NextResponse.json(await getAllTestimonials());
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = await createTestimonial(body);
  createLog({ type: 'admin', action: 'testimonial_created', severity: 'success', message: `Created testimonial from: ${item.name}` }).catch(() => {});
  return NextResponse.json(item, { status: 201 });
}
