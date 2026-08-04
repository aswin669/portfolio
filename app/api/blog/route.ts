import { NextResponse } from 'next/server';
import { getAllBlogPosts, createBlogPost } from '@/lib/db';
import { createLog } from '@/lib/logs';

export async function GET() {
  return NextResponse.json(await getAllBlogPosts());
}

export async function POST(req: Request) {
  const body = await req.json();
  const post = await createBlogPost(body);
  createLog({ type: 'admin', action: 'blog_created', severity: 'success', message: `Created blog: ${post.title}`, details: { slug: post.slug } }).catch(() => {});
  return NextResponse.json(post, { status: 201 });
}
