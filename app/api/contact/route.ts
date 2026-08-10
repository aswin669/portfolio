export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAllContacts, createContact } from '@/lib/db';
import { sendContactNotification } from '@/lib/email';
import { createLog } from '@/lib/logs';

export async function GET() {
  return NextResponse.json(await getAllContacts());
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const contact = await createContact(body);

    // Send email asynchronously in background so response returns instantly
    sendContactNotification(body).catch((e) => console.error('Background email notification error:', e));
    createLog({ type: 'user', action: 'contact_submitted', severity: 'info', message: `Contact form submitted by ${body.name}`, email: body.email, details: { subject: body.subject } }).catch(() => {});

    return NextResponse.json({ success: true, contact }, { status: 201 });
  } catch (err: any) {
    console.error('Contact form submission error:', err);
    return NextResponse.json({ error: 'Failed to save contact message' }, { status: 500 });
  }
}
