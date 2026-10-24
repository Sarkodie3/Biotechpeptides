import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      billing,
      shipping,
      items,
      subtotal,
      discount,
      shippingFee,
      total,
      paymentMethod,
      orderComments,
    } = body;

    if (!billing?.firstName || !billing?.lastName || !billing?.email || !billing?.address1) {
      return NextResponse.json({ error: 'Please provide all required billing fields.' }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    const orderNumber = '1000' + Math.floor(10000 + Math.random() * 90000);
    const orderId = 'ord_' + Date.now();

    const shippingInfo = {
      ...(shipping || billing),
      orderComments: orderComments || '',
    };

    const order = createOrder({
      id: orderId,
      orderNumber,
      customerName: `${billing.firstName} ${billing.lastName}`,
      customerEmail: billing.email,
      customerPhone: billing.phone || '',
      shippingAddress: shippingInfo,
      items,
      subtotal: parseFloat(subtotal) || 0,
      discount: parseFloat(discount) || 0,
      shippingFee: parseFloat(shippingFee) || 0,
      total: parseFloat(total) || 0,
      paymentMethod: paymentMethod || 'crypto',
    });

    // Determine readable label for the preferred payment method
    let paymentMethodLabel = 'CRYPTO (BTC / ETH / USDT)';
    let paymentInstructionsNote = 'Customer selected Cryptocurrency. Please reply with your receiving BTC / ETH / USDT wallet address and payment instructions.';

    if (order.paymentMethod === 'cashapp') {
      paymentMethodLabel = 'CASHAPP ($psci2021)';
      paymentInstructionsNote = 'Customer selected Cash App. Cashtag provided on site: $psci2021. Please review and confirm receipt with the customer.';
    } else if (order.paymentMethod === 'applepay') {
      paymentMethodLabel = 'APPLE PAY (+3122862032)';
      paymentInstructionsNote = 'Customer selected Apple Pay (+3122862032). Please reply with your Apple Pay request or payment confirmation instructions.';
    }

    // Format item lines for plain text & HTML
    const plainItemsList = (items || [])
      .map(
        (it: any, idx: number) =>
          `  ${idx + 1}. ${it.name} (Qty: ${it.quantity}) — $${parseFloat(it.price).toFixed(2)} each (Subtotal: $${(parseFloat(it.price) * it.quantity).toFixed(2)})`
      )
      .join('\n');

    const htmlItemsRows = (items || [])
      .map(
        (it: any) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px 10px; font-weight: 600; color: #111827;">${it.name}</td>
          <td style="padding: 12px 10px; text-align: center; color: #4b5563;">${it.quantity}</td>
          <td style="padding: 12px 10px; text-align: right; color: #4b5563;">$${parseFloat(it.price).toFixed(2)}</td>
          <td style="padding: 12px 10px; text-align: right; font-weight: 600; color: #111827;">$${(parseFloat(it.price) * it.quantity).toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    const formattedAddress = [
      billing.address1,
      billing.address2,
      `${billing.city}, ${billing.state || ''} ${billing.postcode || ''}`,
      billing.country,
    ]
      .filter(Boolean)
      .join(', ');

    // 2. Dispatch Live Email Notification to Biotechpeptidessupport@gmail.com
    const targetRecipient = process.env.ORDER_NOTIFICATION_EMAIL || 'Biotechpeptidessupport@gmail.com';
    const smtpUser = process.env.SMTP_USER || 'Biotechpeptidessupport@gmail.com';
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
    let emailDispatched = false;

    const emailSubject = `[New Order #${orderNumber}] ${billing.firstName} ${billing.lastName} — $${order.total.toFixed(2)} (${paymentMethodLabel})`;

    const emailText = `BIOTECH PEPTIDES — NEW CLIENT ORDER RECEIVED

Order Number: #${orderNumber}
Order Reference ID: ${order.id}
Date & Time: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST

============================================================
PREFERRED PAYMENT METHOD (ACTION REQUIRED)
============================================================
Method Selected: ${paymentMethodLabel}
Note: ${paymentInstructionsNote}

============================================================
CUSTOMER INFORMATION
============================================================
Name: ${billing.firstName} ${billing.lastName}
Email: ${billing.email}
Phone: ${billing.phone || 'Not provided'}
Company: ${billing.company || 'Not provided'}
Shipping Address: ${formattedAddress}

Customer Order Notes / Special Instructions:
${orderComments || 'None provided'}

============================================================
ORDERED ITEMS
============================================================
${plainItemsList}

------------------------------------------------------------
Subtotal:     $${order.subtotal.toFixed(2)}
Discount:     -$${order.discount.toFixed(2)}
Shipping Fee: $${order.shippingFee.toFixed(2)}
------------------------------------------------------------
TOTAL DUE:    $${order.total.toFixed(2)} USD
============================================================

ACTION:
Reply directly to this email to contact ${billing.firstName} ${billing.lastName} (${billing.email}) with your payment instructions for ${paymentMethodLabel}.
`;

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: #ffffff;">
        <!-- Header -->
        <div style="background-color: #0c71c3; color: #ffffff; padding: 24px; text-align: left;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Biotech Peptides</h1>
          <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.95;">New Client Order Notification — Action Required</p>
        </div>

        <div style="padding: 24px;">
          <!-- Action Banner -->
          <div style="margin-bottom: 24px; padding: 14px 18px; background-color: #fefce8; border-left: 4px solid #eab308; border-radius: 4px; color: #854d0e; font-size: 14px; line-height: 1.5;">
            <strong>Action Required:</strong> Customer placed order <strong>#${orderNumber}</strong> and selected <strong>${paymentMethodLabel}</strong>. Review details below and reply to send payment instructions.
          </div>

          <!-- Order Summary Card -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background: #f9fafb; border-radius: 6px; padding: 14px; font-size: 14px;">
            <tbody>
              <tr>
                <td style="padding: 10px 14px; color: #6b7280; font-weight: bold; width: 140px;">Order Number:</td>
                <td style="padding: 10px 14px; color: #111827; font-weight: 800; font-size: 16px;">#${orderNumber}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; color: #6b7280; font-weight: bold;">Payment Method:</td>
                <td style="padding: 10px 14px; color: #0c71c3; font-weight: 800; font-size: 15px;">${paymentMethodLabel}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; color: #6b7280; font-weight: bold;">Total Amount:</td>
                <td style="padding: 10px 14px; color: #16a34a; font-weight: 800; font-size: 16px;">$${order.total.toFixed(2)} USD</td>
              </tr>
            </tbody>
          </table>

          <!-- Customer Details -->
          <h2 style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; margin: 24px 0 12px;">Customer Details</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tbody>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold; width: 140px;">Customer Name:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600;">${billing.firstName} ${billing.lastName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Customer Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${billing.email}" style="color: #0c71c3; text-decoration: none; font-weight: 600;">${billing.email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Customer Phone:</td>
                <td style="padding: 8px 0;">${billing.phone ? `<a href="tel:${billing.phone}" style="color: #0c71c3; text-decoration: none;">${billing.phone}</a>` : '<span style="color: #9ca3af;">Not provided</span>'}</td>
              </tr>
              ${billing.company ? `
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Company:</td>
                <td style="padding: 8px 0; color: #111827;">${billing.company}</td>
              </tr>` : ''}
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Shipping Address:</td>
                <td style="padding: 8px 0; color: #111827; line-height: 1.4;">${formattedAddress}</td>
              </tr>
              ${orderComments ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: bold; vertical-align: top;">Customer Notes:</td>
                <td style="padding: 8px 0; color: #4b5563; font-style: italic;">&ldquo;${orderComments}&rdquo;</td>
              </tr>` : ''}
            </tbody>
          </table>

          <!-- Ordered Items Table -->
          <h2 style="font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; margin: 28px 0 12px;">Order Items</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <thead>
              <tr style="background: #f9fafb; text-align: left; font-size: 12px; text-transform: uppercase; color: #6b7280; border-bottom: 1px solid #e5e7eb;">
                <th style="padding: 10px;">Item</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${htmlItemsRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px 10px 4px; text-align: right; color: #6b7280;">Subtotal:</td>
                <td style="padding: 10px 10px 4px; text-align: right; font-weight: 600;">$${order.subtotal.toFixed(2)}</td>
              </tr>
              ${order.discount > 0 ? `
              <tr>
                <td colspan="3" style="padding: 4px 10px; text-align: right; color: #16a34a;">Discount / Savings:</td>
                <td style="padding: 4px 10px; text-align: right; font-weight: 600; color: #16a34a;">-$${order.discount.toFixed(2)}</td>
              </tr>` : ''}
              <tr>
                <td colspan="3" style="padding: 4px 10px; text-align: right; color: #6b7280;">Shipping:</td>
                <td style="padding: 4px 10px; text-align: right; font-weight: 600;">$${order.shippingFee.toFixed(2)}</td>
              </tr>
              <tr style="border-top: 2px solid #e5e7eb;">
                <td colspan="3" style="padding: 12px 10px; text-align: right; font-weight: 800; font-size: 16px; color: #111827;">Total Due:</td>
                <td style="padding: 12px 10px; text-align: right; font-weight: 800; font-size: 17px; color: #0c71c3;">$${order.total.toFixed(2)} USD</td>
              </tr>
            </tfoot>
          </table>

          <!-- Action Button: Click to Reply -->
          <div style="margin: 32px 0 20px; text-align: center;">
            <a href="mailto:${billing.email}?subject=Payment%20Instructions%20for%20Biotech%20Peptides%20Order%20%23${orderNumber}&body=Hello%20${encodeURIComponent(billing.firstName)}%2C%0A%0AThank%20you%20for%20your%20order%20%23${orderNumber}%20at%20Biotech%20Peptides.%0A%0ATotal%20Amount%20Due%3A%20%24${order.total.toFixed(2)}%20USD%0APreferred%20Payment%20Method%3A%20${encodeURIComponent(paymentMethodLabel)}%0A%0APlease%20follow%20these%20instructions%20to%20complete%20your%20payment%3A%0A%0A%5BInsert%20your%20payment%20details%2Fhandle%2Fwallet%20here%5D%0A%0AOnce%20sent%2C%20please%20reply%20to%20confirm%20so%20we%20can%20dispatch%20your%20order.%0A%0ABest%20regards%2C%0ABiotech%20Peptides%20Support"
               style="display: inline-block; background-color: #0c71c3; color: #ffffff; text-decoration: none; padding: 14px 28px; font-weight: bold; font-size: 14px; border-radius: 6px; letter-spacing: 0.5px;">
              Reply to Customer with Payment Instructions &rarr;
            </a>
            <p style="margin-top: 8px; font-size: 12px; color: #6b7280;">Or simply click &ldquo;Reply&rdquo; in your email client to respond to this customer directly.</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; color: #6b7280; padding: 14px; text-align: center; font-size: 12px; border-top: 1px solid #e5e7eb;">
          Biotech Peptides E-Commerce Dispatch System &bull; <a href="https://biotechpeptidesonline.com" style="color: #0c71c3; text-decoration: none;">biotechpeptidesonline.com</a>
        </div>
      </div>
    `;

    if (smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"Biotech Peptides Orders" <${smtpUser}>`,
          to: targetRecipient,
          replyTo: `"${billing.firstName} ${billing.lastName}" <${billing.email}>`,
          subject: emailSubject,
          text: emailText,
          html: emailHtml,
        });

        emailDispatched = true;
        console.log(`[Checkout] Live order notification email sent to ${targetRecipient} for Order #${orderNumber}`);
      } catch (mailErr: any) {
        console.error(`[Checkout] Email sending failed for Order #${orderNumber}:`, mailErr.message);
      }
    } else {
      console.log(`[Checkout] Live SMTP credentials (SMTP_PASS / GMAIL_APP_PASSWORD) not configured in environment. Order #${orderNumber} persisted to database for ${targetRecipient}.`);
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      total: order.total,
      paymentMethod: order.paymentMethod,
      emailDispatched,
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message || 'Checkout processing failed' }, { status: 500 });
  }
}
