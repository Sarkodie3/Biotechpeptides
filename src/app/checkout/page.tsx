'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, calculateTotal } = useCart();

  const [shippingMethod, setShippingMethod] = useState<'usps' | 'ups'>('usps');
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'cashapp' | 'applepay'>('crypto');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    country: 'United States (US)',
    address1: '',
    address2: '',
    city: '',
    state: 'CA',
    postcode: '',
    phone: '',
    email: '',
    orderComments: '',
  });

  const shippingFee = shippingMethod === 'ups' ? 45.0 : 11.25;
  const { subtotal, tierSavings, cashAppDiscount, total } = calculateTotal(
    shippingFee,
    paymentMethod
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!termsAgreed) {
      setErrorMsg('You must agree to the terms, conditions, and 21+ research age declaration.');
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address1 || !formData.city || !formData.postcode) {
      setErrorMsg('Please complete all required billing fields marked with an asterisk (*).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billing: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            company: formData.company,
            country: formData.country,
            address1: formData.address1,
            address2: formData.address2,
            city: formData.city,
            state: formData.state,
            postcode: formData.postcode,
            phone: formData.phone,
            email: formData.email,
          },
          orderComments: formData.orderComments,
          items,
          subtotal,
          discount: tierSavings + cashAppDiscount,
          shippingFee,
          total,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed placing order');
      }

      // Redundant background client-side delivery to FormSubmit
      try {
        const orderSummaryLines = items
          .map((i) => `${i.name} (Qty: ${i.quantity}) - $${(i.price * i.quantity).toFixed(2)}`)
          .join('\n');

        const fullShipping = [
          formData.address1,
          formData.address2,
          `${formData.city}, ${formData.state} ${formData.postcode}`,
          formData.country,
        ]
          .filter(Boolean)
          .join(', ');

        let readablePm = 'CRYPTO';
        if (paymentMethod === 'cashapp') readablePm = 'CASHAPP ($psci2021)';
        else if (paymentMethod === 'applepay') readablePm = 'APPLE PAY (+3122862032)';

        fetch('https://formsubmit.co/ajax/Biotechpeptidessupport@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            _subject: `[Order #${data.orderNumber || ''}] New Order from ${formData.firstName} ${formData.lastName} - $${total.toFixed(2)} USD`,
            _replyto: formData.email,
            _captcha: 'false',
            _template: 'table',
            Order_Number: `#${data.orderNumber || ''}`,
            Payment_Method: readablePm,
            Total_Due: `$${total.toFixed(2)} USD`,
            Customer_Name: `${formData.firstName} ${formData.lastName}`,
            Customer_Email: formData.email,
            Customer_Phone: formData.phone || 'N/A',
            Shipping_Address: fullShipping,
            Ordered_Items: orderSummaryLines,
            Customer_Notes: formData.orderComments || 'None',
          }),
        }).catch(() => {});
      } catch {
        // Non-blocking background redundancy
      }

      clearCart();
      router.push(`/success-page/?order=${data.orderNumber}&pm=${paymentMethod}&amount=${total.toFixed(2)}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while processing checkout.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 text-center">
        <h1 className="text-3xl font-black uppercase text-gray-900 mb-6">Checkout</h1>
        <div className="bg-gray-50 border border-gray-200 p-12 max-w-[600px] mx-auto space-y-6">
          <p className="text-[15px] text-gray-600">Your cart is empty. Please add items before checking out.</p>
          <Link
            href="/buy-peptides/"
            className="inline-block bg-[#0c71c3] hover:bg-[#0a5ea3] text-white px-8 py-3 text-[14px] font-bold uppercase tracking-wider transition-colors"
          >
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10">
      <h1 className="text-3xl font-black uppercase text-gray-900 mb-8 border-b border-gray-200 pb-4">
        Checkout
      </h1>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 text-[14px]">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Customer & Billing Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2">
            Billing Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1">
              Company Name (optional)
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1">
              Country / Region *
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 text-[14px] bg-white focus:outline-hidden focus:border-[#0c71c3]"
            >
              <option value="United States (US)">United States (US)</option>
              <option value="Canada">Canada</option>
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              name="address1"
              required
              placeholder="House number and street name"
              value={formData.address1}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 text-[14px] mb-2 focus:outline-hidden focus:border-[#0c71c3]"
            />
            <input
              type="text"
              name="address2"
              placeholder="Apartment, suite, unit, etc. (optional)"
              value={formData.address2}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                Town / City *
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                ZIP Code *
              </label>
              <input
                type="text"
                name="postcode"
                required
                value={formData.postcode}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1">
                Account Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-700 mb-1">
              Order Notes (optional)
            </label>
            <textarea
              name="orderComments"
              rows={3}
              placeholder="Notes about your order, e.g. special delivery instructions."
              value={formData.orderComments}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
            />
          </div>
        </div>

        {/* Order Summary & Payment (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-50 border border-gray-200 p-6 space-y-5">
            <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2">
              Your Order
            </h2>

            {/* Items summary */}
            <div className="divide-y divide-gray-200 text-[13px]">
              {items.map((i) => (
                <div key={`${i.id}-${i.variationId || 0}`} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-gray-800">{i.name}</span>{' '}
                    <span className="text-gray-500">× {i.quantity}</span>
                    {i.variationName && (
                      <div className="text-[11px] text-gray-400">Size: {i.variationName}</div>
                    )}
                  </div>
                  <span className="font-bold text-gray-900">${(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-2 text-[14px]">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>

              {tierSavings > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Volume Tier Savings:</span>
                  <span>-${tierSavings.toFixed(2)}</span>
                </div>
              )}

              {cashAppDiscount > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>CashApp 4% Discount:</span>
                  <span>-${cashAppDiscount.toFixed(2)}</span>
                </div>
              )}

              {/* Shipping Method radio */}
              <div className="pt-2 border-t border-gray-200 space-y-2">
                <span className="block text-[13px] font-bold text-gray-700">Shipping:</span>
                <label className="flex items-center justify-between p-2 border bg-white cursor-pointer text-[13px]">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping_sel"
                      checked={shippingMethod === 'usps'}
                      onChange={() => setShippingMethod('usps')}
                    />
                    <span>USPS PRIORITY (2-3 Day)</span>
                  </div>
                  <span className="font-bold">$11.25</span>
                </label>
                <label className="flex items-center justify-between p-2 border bg-white cursor-pointer text-[13px]">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping_sel"
                      checked={shippingMethod === 'ups'}
                      onChange={() => setShippingMethod('ups')}
                    />
                    <span>UPS Next Day Air</span>
                  </div>
                  <span className="font-bold">$45.00</span>
                </label>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between text-lg font-black text-gray-900">
                <span>Total:</span>
                <span className="text-[#0c71c3]">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Options */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <span className="block text-[14px] font-bold uppercase tracking-wider text-gray-900">
                Payment Method:
              </span>

              {/* Method 1: CRYPTO */}
              <div className={`border p-3 space-y-2 transition-colors ${paymentMethod === 'crypto' ? 'border-[#0c71c3] bg-blue-50/30' : 'border-gray-200 bg-white'}`}>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2 font-bold text-[14px] text-gray-900">
                    <input
                      type="radio"
                      name="payment"
                      value="crypto"
                      checked={paymentMethod === 'crypto'}
                      onChange={() => setPaymentMethod('crypto')}
                    />
                    <span>CRYPTO</span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                    BTC &bull; ETH &bull; USDT
                  </span>
                </label>

                {paymentMethod === 'crypto' && (
                  <div className="pt-2 text-[12px] text-gray-600 border-t border-gray-100 leading-relaxed space-y-1">
                    <p>
                      Pay securely with cryptocurrency. Direct transfer via <strong>Bitcoin (BTC)</strong>, <strong>Ethereum (ETH)</strong>, or <strong>USDT (TRC20 / ERC20)</strong>.
                    </p>
                    <p className="text-gray-500">
                      Receiving wallet addresses and instant payment QR codes are provided immediately on the confirmation page after placing your order.
                    </p>
                  </div>
                )}
              </div>

              {/* Method 2: CASHAPP */}
              <div className={`border p-3 space-y-2 transition-colors ${paymentMethod === 'cashapp' ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 bg-white'}`}>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2 font-bold text-[14px] text-emerald-800">
                    <input
                      type="radio"
                      name="payment"
                      value="cashapp"
                      checked={paymentMethod === 'cashapp'}
                      onChange={() => setPaymentMethod('cashapp')}
                    />
                    <span>CASHAPP</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    $psci2021
                  </span>
                </label>

                {paymentMethod === 'cashapp' && (
                  <div className="pt-2 text-[12px] text-gray-600 border-t border-gray-100 leading-relaxed">
                    After placing your order, send your payment via Cash App to Cashtag <strong>$psci2021</strong> with note <strong>Cosmetics</strong>. Orders are quickly matched and dispatched.
                  </div>
                )}
              </div>

              {/* Method 3: APPLE PAY */}
              <div className={`border p-3 space-y-2 transition-colors ${paymentMethod === 'applepay' ? 'border-gray-800 bg-gray-50' : 'border-gray-200 bg-white'}`}>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2 font-bold text-[14px] text-gray-900">
                    <input
                      type="radio"
                      name="payment"
                      value="applepay"
                      checked={paymentMethod === 'applepay'}
                      onChange={() => setPaymentMethod('applepay')}
                    />
                    <span>APPLE PAY</span>
                  </div>
                  <span className="text-[12px] font-bold text-black bg-gray-200 px-2.5 py-0.5 rounded">
                     Pay
                  </span>
                </label>

                {paymentMethod === 'applepay' && (
                  <div className="pt-2 text-[12px] text-gray-600 border-t border-gray-100 leading-relaxed">
                    Pay using Apple Cash / Apple Pay directly to our dispatch receiver at <strong>Biotechpeptidessupport@gmail.com</strong> or <strong>+3122862032</strong> with your order number.
                  </div>
                )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2 border-t border-gray-200">
              <label className="flex items-start gap-2 text-[12px] text-gray-600 cursor-pointer leading-snug">
                <input
                  type="checkbox"
                  required
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  I agree to the <Link href="/terms-and-conditions/" className="text-[#0c71c3] underline">terms and conditions</Link>. I am at least 21 years of age and understand that purchases are limited to licensed researchers and/or qualified professionals. I understand that the products listed on the site are not for human or veterinary use.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#0c71c3] hover:bg-[#0a5ea3] disabled:opacity-50 text-white font-bold uppercase text-[15px] tracking-wider transition-colors cursor-pointer shadow-md"
            >
              {isSubmitting ? 'Processing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
