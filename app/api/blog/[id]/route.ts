import { NextResponse } from 'next/server';
import { getBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id);
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = await updateBlogPost(Number(params.id), body);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  createLog({ type: 'admin', action: 'blog_updated', severity: 'info', message: `Updated blog: ${updated.title}`, details: { id: params.id } }).catch(() => {});
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id);
  const deleted = await deleteBlogPost(Number(params.id));
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  createLog({ type: 'admin', action: 'blog_deleted', severity: 'warning', message: `Deleted blog: ${post?.title || params.id}` }).catch(() => {});
  return NextResponse.json({ success: true });
}
