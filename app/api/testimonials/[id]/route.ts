import { NextResponse } from 'next/server';
import { deleteTestimonial, updateTestimonial } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = await updateTestimonial(Number(params.id), body);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  createLog({ type: 'admin', action: 'testimonial_updated', severity: 'info', message: `Updated testimonial: ${updated.name}` }).catch(() => {});
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const deleted = await deleteTestimonial(Number(params.id));
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  createLog({ type: 'admin', action: 'testimonial_deleted', severity: 'warning', message: `Deleted testimonial #${params.id}` }).catch(() => {});
  return NextResponse.json({ success: true });
}
