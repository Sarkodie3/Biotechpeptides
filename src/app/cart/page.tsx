'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, tierSavings } = useCart();
  const [shippingMethod, setShippingMethod] = useState<'usps' | 'ups'>('usps');
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  const shippingFee = shippingMethod === 'ups' ? 45.0 : 11.25;
  const total = Math.max(0, subtotal + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponMsg('Coupon code not recognized or expired.');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 text-center">
        <h1 className="text-3xl font-black uppercase text-gray-900 mb-6">Cart</h1>
        <div className="bg-gray-50 border border-gray-200 p-12 max-w-[600px] mx-auto space-y-6">
          <p className="text-[15px] text-gray-600">Your cart is currently empty.</p>
          <div>
            <Link
              href="/buy-peptides/"
              className="inline-block bg-[#0c71c3] hover:bg-[#0a5ea3] text-white px-8 py-3 text-[14px] font-bold uppercase tracking-wider transition-colors"
            >
              Return to shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10">
      <h1 className="text-3xl font-black uppercase text-gray-900 mb-8 border-b border-gray-200 pb-4">
        Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Items Table (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="border border-gray-200 overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase text-[12px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                  <th className="py-3 px-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={`${item.id}-${item.variationId || 0}`} className="hover:bg-gray-50/50">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div className="w-14 h-14 bg-gray-50 border shrink-0 p-1 flex items-center justify-center">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={56}
                            height={56}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-[10px] text-gray-400">IMG</span>
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/product/${item.slug}/`}
                          className="font-bold text-gray-900 hover:text-[#0c71c3]"
                        >
                          {item.name}
                        </Link>
                        {item.variationName && (
                          <div className="text-[12px] text-gray-500">
                            Size: {item.variationName}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-gray-700">
                      ${item.price.toFixed(2)}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center border border-gray-300 w-28 h-9">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.variationId, item.quantity - 1)}
                          className="w-8 h-full text-gray-600 hover:bg-gray-100 font-bold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, item.variationId, parseInt(e.target.value) || 1)
                          }
                          className="w-12 h-full text-center font-bold text-[13px] border-x border-gray-300 focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.variationId, item.quantity + 1)}
                          className="w-8 h-full text-gray-600 hover:bg-gray-100 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right font-bold text-[#0c71c3]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>

                    <td className="py-4 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id, item.variationId)}
                        className="text-gray-400 hover:text-red-600 text-lg font-bold"
                        title="Remove item"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Coupon bar & Clear cart */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <form onSubmit={handleApplyCoupon} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="border border-gray-300 px-3 py-2 text-[13px] focus:outline-hidden focus:border-[#0c71c3]"
              />
              <button
                type="submit"
                className="bg-gray-800 hover:bg-black text-white px-4 py-2 text-[13px] font-bold uppercase tracking-wider transition-colors"
              >
                Apply Coupon
              </button>
            </form>

            <button
              type="button"
              onClick={clearCart}
              className="text-[13px] text-red-600 hover:underline font-medium self-end sm:self-auto cursor-pointer"
            >
              Clear Cart
            </button>
          </div>

          {couponMsg && (
            <div className="text-[13px] text-amber-700 bg-amber-50 border border-amber-200 p-2.5">
              {couponMsg}
            </div>
          )}
        </div>

        {/* Totals Box (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-gray-50 border border-gray-200 p-6 space-y-5">
            <h2 className="text-[16px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-3">
              Cart Totals
            </h2>

            <div className="flex justify-between text-[14px]">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>

            {tierSavings > 0 && (
              <div className="flex justify-between text-[14px] text-green-700 font-semibold bg-green-50 p-2 border border-green-200">
                <span>Volume Tier Discount:</span>
                <span>-${tierSavings.toFixed(2)}</span>
              </div>
            )}

            {/* Shipping selection */}
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <span className="block text-[13px] font-bold uppercase tracking-wider text-gray-700">
                Shipping Options:
              </span>
              <label className="flex items-center justify-between text-[13px] text-gray-700 cursor-pointer p-2 border border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'usps'}
                    onChange={() => setShippingMethod('usps')}
                    className="text-[#0c71c3] focus:ring-[#0c71c3]"
                  />
                  <span>USPS PRIORITY (2-3 Day)</span>
                </div>
                <span className="font-bold">$11.25</span>
              </label>

              <label className="flex items-center justify-between text-[13px] text-gray-700 cursor-pointer p-2 border border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'ups'}
                    onChange={() => setShippingMethod('ups')}
                    className="text-[#0c71c3] focus:ring-[#0c71c3]"
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

            <div className="pt-4">
              <Link
                href="/checkout/"
                className="block w-full py-3.5 bg-[#0c71c3] hover:bg-[#0a5ea3] text-white text-center font-bold uppercase text-[14px] tracking-wider transition-colors shadow-sm"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
