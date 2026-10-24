'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderRecord {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping?: {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    orderComments?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  payment_method: string;
  created_at: string;
}

export default function OrdersDispatchPage() {
  const [accessKey, setAccessKey] = useState('biotech2026');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchOrders = async (keyToUse: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/checkout?key=${encodeURIComponent(keyToUse)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders || []);
        setIsAuthenticated(true);
      } else {
        setErrorMsg(data.error || 'Invalid Access Key. Access denied.');
        setIsAuthenticated(false);
      }
    } catch (err: any) {
      setErrorMsg('Network error fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const keyParam = params.get('key') || params.get('secret') || 'biotech2026';
    setAccessKey(keyParam);
    fetchOrders(keyParam);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(accessKey);
  };

  const getPaymentBadge = (method: string) => {
    switch (method.toLowerCase()) {
      case 'crypto':
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 text-xs font-bold uppercase rounded">
            CRYPTO (BTC / ETH / USDT)
          </span>
        );
      case 'cashapp':
        return (
          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 text-xs font-bold uppercase rounded">
            CASHAPP ($psci2021)
          </span>
        );
      case 'applepay':
        return (
          <span className="bg-gray-800 text-white border border-gray-900 px-3 py-1 text-xs font-bold uppercase rounded">
            APPLE PAY (+3122862032)
          </span>
        );
      default:
        return (
          <span className="bg-blue-100 text-blue-900 border border-blue-300 px-3 py-1 text-xs font-bold uppercase rounded">
            {method.toUpperCase()}
          </span>
        );
    }
  };

  const handleCopy = (order: OrderRecord) => {
    const summary = `Order #${order.order_number}\nCustomer: ${order.customer_name} (${order.customer_email}, ${order.customer_phone || 'No phone'})\nTotal: $${order.total.toFixed(2)}\nPayment: ${order.payment_method.toUpperCase()}\nAddress: ${order.shipping?.address1 || ''}, ${order.shipping?.city || ''}, ${order.shipping?.state || ''} ${order.shipping?.postcode || ''}`;
    navigator.clipboard.writeText(summary);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (!isAuthenticated && !loading) {
    return (
      <div className="max-w-[480px] mx-auto my-20 p-8 bg-white border border-gray-200 shadow-md">
        <h1 className="text-2xl font-black uppercase text-gray-900 mb-2">Orders Dispatch Hub</h1>
        <p className="text-sm text-gray-600 mb-6">Enter your security key to view client orders and payment requests.</p>

        {errorMsg && (
          <div className="p-3 mb-4 bg-red-50 text-red-700 text-sm border-l-4 border-red-500 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Security Key:</label>
            <input
              type="password"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="Enter security key..."
              className="w-full border border-gray-300 p-2.5 text-sm focus:outline-hidden focus:border-[#0c71c3]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#0c71c3] hover:bg-[#0a5ea3] text-white py-3 font-bold uppercase text-xs tracking-wider transition-colors cursor-pointer"
          >
            Authenticate &amp; View Orders
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-black uppercase text-gray-900 tracking-tight">
              Client Orders Dispatch Hub
            </h1>
            <span className="bg-blue-100 text-[#0c71c3] text-xs font-bold px-2.5 py-0.5 rounded-full">
              {orders.length} Orders
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Review client checkout orders and dispatch preferred payment instructions directly to customers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchOrders(accessKey)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors cursor-pointer"
          >
            {loading ? 'Refreshing...' : '↻ Refresh Orders'}
          </button>
          <Link
            href="/buy-peptides/"
            className="bg-[#0c71c3] hover:bg-[#0a5ea3] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors"
          >
            Return to Store
          </Link>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 border border-gray-200">
          <div className="w-8 h-8 border-4 border-[#0c71c3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-600">Loading orders from server...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 border border-gray-200">
          <p className="text-base font-semibold text-gray-700">No client orders recorded yet.</p>
          <p className="text-xs text-gray-500 mt-1">New customer checkout orders will appear here automatically.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const dateStr = new Date(order.created_at).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            const replySubject = encodeURIComponent(`Payment Instructions for Biotech Peptides Order #${order.order_number}`);
            const replyBody = encodeURIComponent(
              `Hello ${order.customer_name},\n\nThank you for placing Order #${order.order_number} at Biotech Peptides.\n\nTotal Amount Due: $${order.total.toFixed(2)} USD\nSelected Payment Method: ${order.payment_method.toUpperCase()}\n\nPlease follow these instructions to complete your payment:\n\n[Insert your wallet / handle / payment details here]\n\nOnce completed, reply to this email so we can verify and ship your order promptly.\n\nBest regards,\nBiotech Peptides Support`
            );
            const mailtoUrl = `mailto:${order.customer_email}?subject=${replySubject}&body=${replyBody}`;

            return (
              <div
                key={order.id}
                className="bg-white border border-gray-200 shadow-xs rounded-none overflow-hidden hover:border-gray-300 transition-all"
              >
                {/* Order Header */}
                <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-base font-black text-gray-900">
                      Order #{order.order_number}
                    </span>
                    {getPaymentBadge(order.payment_method)}
                    <span className="text-xs text-gray-500">Placed: {dateStr}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-600">Total:</span>
                    <span className="text-lg font-black text-[#0c71c3]">
                      ${order.total.toFixed(2)} USD
                    </span>
                  </div>
                </div>

                {/* Order Details Body */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Customer Info (4 cols) */}
                  <div className="md:col-span-4 space-y-2 border-r md:border-gray-100 pr-4">
                    <h2 className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                      Customer Contact
                    </h2>
                    <p className="text-sm font-bold text-gray-900">{order.customer_name}</p>
                    <p className="text-xs text-gray-600">
                      Email:{' '}
                      <a href={`mailto:${order.customer_email}`} className="text-[#0c71c3] font-semibold hover:underline">
                        {order.customer_email}
                      </a>
                    </p>
                    {order.customer_phone && (
                      <p className="text-xs text-gray-600">
                        Phone:{' '}
                        <a href={`tel:${order.customer_phone}`} className="text-[#0c71c3] font-semibold hover:underline">
                          {order.customer_phone}
                        </a>
                      </p>
                    )}

                    <div className="pt-2">
                      <h2 className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                        Delivery Address
                      </h2>
                      <p className="text-xs text-gray-700 leading-relaxed mt-1">
                        {order.shipping?.address1 || ''}
                        {order.shipping?.address2 ? `, ${order.shipping.address2}` : ''}
                        <br />
                        {order.shipping?.city ? `${order.shipping.city}, ` : ''}
                        {order.shipping?.state || ''} {order.shipping?.postcode || ''}
                        <br />
                        {order.shipping?.country || 'United States'}
                      </p>
                    </div>

                    {order.shipping?.orderComments && (
                      <div className="p-2 bg-amber-50 border-l-2 border-amber-400 text-xs text-amber-900 mt-2">
                        <strong>Client Note:</strong> &ldquo;{order.shipping.orderComments}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Items Ordered (5 cols) */}
                  <div className="md:col-span-5 space-y-2">
                    <h2 className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                      Items Ordered
                    </h2>
                    <div className="border border-gray-100 divide-y divide-gray-100">
                      {(order.items || []).map((it, idx) => (
                        <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-gray-900">{it.name}</span>
                            <span className="text-gray-500 ml-2">× {it.quantity}</span>
                          </div>
                          <span className="font-semibold text-gray-800">
                            ${(it.price * it.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 text-xs text-gray-500 space-y-1 text-right">
                      <div>Subtotal: ${order.subtotal.toFixed(2)}</div>
                      {order.discount > 0 && (
                        <div className="text-emerald-700 font-semibold">
                          Discount: -${order.discount.toFixed(2)}
                        </div>
                      )}
                      <div>Shipping: ${order.shipping_fee.toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Actions (3 cols) */}
                  <div className="md:col-span-3 flex flex-col justify-center space-y-2.5 bg-gray-50 p-4 border border-gray-100">
                    <h2 className="text-xs font-bold uppercase text-gray-700 tracking-wider text-center">
                      Payment Action
                    </h2>

                    <a
                      href={mailtoUrl}
                      className="w-full text-center bg-[#0c71c3] hover:bg-[#0a5ea3] text-white py-2.5 px-3 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                    >
                      ✉ Send Payment Info
                    </a>

                    <button
                      onClick={() => handleCopy(order)}
                      className="w-full text-center bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {copiedId === order.id ? '✓ Copied to Clipboard!' : '📋 Copy Order Summary'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
