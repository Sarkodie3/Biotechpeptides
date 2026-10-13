import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/db';

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
    } = body;

    if (!billing?.firstName || !billing?.lastName || !billing?.email || !billing?.address1) {
      return NextResponse.json({ error: 'Please provide all required billing fields.' }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    const orderNumber = '1000' + Math.floor(10000 + Math.random() * 90000);
    const orderId = 'ord_' + Date.now();

    const order = createOrder({
      id: orderId,
      orderNumber,
      customerName: `${billing.firstName} ${billing.lastName}`,
      customerEmail: billing.email,
      customerPhone: billing.phone || '',
      shippingAddress: shipping || billing,
      items,
      subtotal: parseFloat(subtotal) || 0,
      discount: parseFloat(discount) || 0,
      shippingFee: parseFloat(shippingFee) || 0,
      total: parseFloat(total) || 0,
      paymentMethod: paymentMethod || 'creditcard',
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      total: order.total,
      paymentMethod: order.paymentMethod,
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message || 'Checkout processing failed' }, { status: 500 });
  }
}
