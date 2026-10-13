import { NextRequest, NextResponse } from 'next/server';
import { createInquiry } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const inquiry = createInquiry(name, email, message);
    return NextResponse.json({ success: true, inquiry });
  } catch (err: any) {
    console.error('Inquiry error:', err);
    return NextResponse.json({ error: err.message || 'Failed saving inquiry.' }, { status: 500 });
  }
}
