import { NextResponse } from 'next/server';
import { getAllContacts, createContact } from '@/lib/db';
import { sendContactNotification } from '@/lib/email';
import { createLog } from '@/lib/logs';

export async function GET() {
  return NextResponse.json(await getAllContacts());
}

export async function POST(req: Request) {
  const body = await req.json();
  const message = await createContact(body);
  sendContactNotification(body).catch((e) => console.error('Email send error:', e));
  createLog({ type: 'user', action: 'contact_submitted', severity: 'info', message: `Contact form submitted by ${body.name}`, email: body.email, details: { subject: body.subject } }).catch(() => {});
  return NextResponse.json(message, { status: 201 });
}
