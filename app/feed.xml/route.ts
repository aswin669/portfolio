import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/db';

export async function GET() {
  const allPosts = await getAllBlogPosts();
  const posts = allPosts.filter((p: any) => p.published);
  const base = 'https://aswin.dev';

  const items = posts.map((p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${base}/blog/${p.slug}</link>
      <guid>${base}/blog/${p.slug}</guid>
      <description><![CDATA[${p.excerpt || ''}]]></description>
      <pubDate>${new Date(p.createdAt || Date.now()).toUTCString()}</pubDate>
      ${(p.tags || []).map((t: string) => `<category>${t}</category>`).join('')}
    </item>
  `).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ASWIN S — Blog</title>
    <link>${base}/blog</link>
    <description>Articles on web development, MERN stack, and software engineering.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
