import { NextRequest, NextResponse } from 'next/server';
import { createInquiry } from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const formattedMessage = [
      subject ? `Subject: ${subject}` : null,
      phone ? `Phone: ${phone}` : null,
      message,
    ]
      .filter(Boolean)
      .join('\n\n');

    // 1. Persist directly to SQLite so inquiries and complaints are never lost
    const inquiry = createInquiry(name, email, formattedMessage);

    // 2. Dispatch live notification email to Biotechpeptidessupport@gmail.com
    const targetRecipient = 'Biotechpeptidessupport@gmail.com';
    let emailDispatched = false;

    const smtpUser = process.env.SMTP_USER || 'Biotechpeptidessupport@gmail.com';
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const emailSubject = subject
          ? `[Client Complaint/Inquiry] ${subject} - ${name}`
          : `[Client Complaint/Inquiry] New Message from ${name}`;

        await transporter.sendMail({
          from: `"Biotech Peptides Support" <${smtpUser}>`,
          to: targetRecipient,
          replyTo: `"${name}" <${email}>`,
          subject: emailSubject,
          text: `You have received a new client complaint/inquiry from BiotechPeptides.com:

Client Name: ${name}
Client Email: ${email}
Client Phone: ${phone || 'Not provided'}
Subject: ${subject || 'General Inquiry / Complaint'}
Timestamp: ${new Date().toISOString()}
Inquiry Reference: ${inquiry.id}

Message / Complaint:
----------------------------------------------------------------------
${message}
----------------------------------------------------------------------

To respond directly to this client, simply reply to this email.
`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: #ffffff;">
              <div style="background-color: #0c71c3; color: #ffffff; padding: 22px 26px;">
                <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Biotech Peptides</h1>
                <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.95;">Client Complaint &amp; Support Dispatch System</p>
              </div>

              <div style="padding: 26px;">
                <div style="margin-bottom: 20px; padding: 12px 16px; background-color: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 4px; color: #166534; font-size: 13px; font-weight: 600;">
                  New message received via website contact form.
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
                  <tbody>
                    <tr style="border-bottom: 1px solid #f3f4f6;">
                      <td style="padding: 10px 0; color: #6b7280; font-weight: bold; width: 120px;">Client Name:</td>
                      <td style="padding: 10px 0; color: #111827; font-weight: 600;">${name}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f3f4f6;">
                      <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Client Email:</td>
                      <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #0c71c3; text-decoration: none; font-weight: 600;">${email}</a></td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f3f4f6;">
                      <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Client Phone:</td>
                      <td style="padding: 10px 0; color: #111827;">${phone ? `<a href="tel:${phone}" style="color: #0c71c3; text-decoration: none;">${phone}</a>` : '<span style="color: #9ca3af;">Not provided</span>'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f3f4f6;">
                      <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Category:</td>
                      <td style="padding: 10px 0; color: #b91c1c; font-weight: bold;">${subject || 'General Inquiry / Complaint'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Reference ID:</td>
                      <td style="padding: 10px 0; color: #4b5563; font-family: monospace;">${inquiry.id}</td>
                    </tr>
                  </tbody>
                </table>

                <div style="margin-top: 10px;">
                  <h3 style="margin: 0 0 10px; font-size: 13px; color: #374151; text-transform: uppercase; letter-spacing: 0.5px;">Message / Complaint Content:</h3>
                  <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 18px; font-size: 14px; line-height: 1.6; color: #1f2937; white-space: pre-wrap;">${message}</div>
                </div>

                <div style="margin-top: 26px; text-align: center;">
                  <a href="mailto:${email}?subject=${encodeURIComponent(`Re: [Biotech Peptides] ${subject || 'Support Request'}`)}" style="display: inline-block; background-color: #0c71c3; color: #ffffff; padding: 12px 28px; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Reply Directly to ${name}</a>
                </div>
              </div>

              <div style="background-color: #f8fafc; padding: 14px 26px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;">
                Delivered automatically to <strong>${targetRecipient}</strong> &bull; Biotech Peptides Support Portal
              </div>
            </div>
          `,
        });
        emailDispatched = true;
        console.log(`[Email Dispatch] Successfully sent client complaint/inquiry to ${targetRecipient}`);
      } catch (sendErr) {
        console.error('[Email Dispatch Warning] Failed sending email via SMTP:', sendErr);
      }
    } else {
      console.log(`[Email Dispatch] Inquiry recorded in DB for ${targetRecipient}. (Set SMTP_PASS in .env to activate live Gmail SMTP delivery).`);
    }

    return NextResponse.json({
      success: true,
      inquiry,
      emailDispatched,
      recipient: targetRecipient,
    });
  } catch (err: any) {
    console.error('Inquiry error:', err);
    return NextResponse.json({ error: err.message || 'Failed saving inquiry.' }, { status: 500 });
  }
}
