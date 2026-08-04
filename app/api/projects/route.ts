import { NextResponse } from 'next/server';
import { getAllProjects, createProject } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function GET() {
  return NextResponse.json(await getAllProjects());
}

export async function POST(req: Request) {
  const body = await req.json();
  const project = await createProject(body);
  createLog({ type: 'admin', action: 'project_created', severity: 'success', message: `Created project: ${project.name || project.slug}`, details: { slug: project.slug } }).catch(() => {});
  return NextResponse.json(project, { status: 201 });
}
