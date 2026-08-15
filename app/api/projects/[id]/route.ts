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
  let targetId = Number(params.id);
  if (isNaN(targetId)) {
    const existing = await getProject(params.id);
    if (existing && existing.id) {
      targetId = existing.id;
    } else {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  }
  const updated = await updateProject(targetId, body);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  createLog({ type: 'admin', action: 'project_updated', severity: 'info', message: `Updated project: ${updated.name || updated.slug}`, details: { id: params.id } }).catch(() => {});
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const project = await getProject(params.id);
  let targetId = Number(params.id);
  if (isNaN(targetId) && project && project.id) {
    targetId = project.id;
  }
  const deleted = await deleteProject(targetId);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  createLog({ type: 'admin', action: 'project_deleted', severity: 'warning', message: `Deleted project: ${project?.name || project?.slug || params.id}` }).catch(() => {});
  return NextResponse.json({ success: true });
}
