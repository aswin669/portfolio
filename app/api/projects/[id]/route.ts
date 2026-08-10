export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getProject, updateProject, deleteProject } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const project = await getProject(params.id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = await updateProject(Number(params.id), body);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  createLog({ type: 'admin', action: 'project_updated', severity: 'info', message: `Updated project: ${updated.name || updated.slug}`, details: { id: params.id } }).catch(() => {});
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const project = await getProject(params.id);
  const deleted = await deleteProject(Number(params.id));
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  createLog({ type: 'admin', action: 'project_deleted', severity: 'warning', message: `Deleted project: ${project?.name || project?.slug || params.id}` }).catch(() => {});
  return NextResponse.json({ success: true });
}
