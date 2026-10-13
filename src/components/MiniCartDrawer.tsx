'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function MiniCartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal, tierSavings } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-[#0c71c3] text-white flex items-center justify-between">
            <h2 className="text-[16px] font-bold tracking-wide uppercase">
              Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded cursor-pointer"
              aria-label="Close cart"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-[15px] mb-4">No products in the cart.</p>
                <Link
                  href="/buy-peptides/"
                  onClick={() => setIsOpen(false)}
                  className="inline-block bg-[#0c71c3] text-white px-5 py-2 text-[14px] font-medium rounded hover:bg-[#0b5fa5]"
                >
                  Return to shop
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.id}-${item.variationId || 0}`} className="pt-4 first:pt-0 flex gap-3">
                  <div className="w-16 h-16 bg-gray-50 border border-gray-100 shrink-0 p-1 flex items-center justify-center">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-400 text-[10px]">IMG</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.slug}/`}
                      onClick={() => setIsOpen(false)}
                      className="text-[14px] font-semibold text-gray-900 hover:text-[#0c71c3] line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    {item.variationName && (
                      <div className="text-[12px] text-gray-500">
                        Size: {item.variationName}
                      </div>
                    )}
                    <div className="text-[13px] text-gray-700 font-medium mt-1">
                      ${item.price.toFixed(2)}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.variationId, item.quantity - 1)}
                          className="px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-[12px] font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.variationId, item.quantity + 1)}
                          className="px-2 py-0.5 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id, item.variationId)}
                        className="text-[11px] text-red-600 hover:underline cursor-pointer ml-auto"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer actions */}
          {items.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
              {tierSavings > 0 && (
                <div className="text-[12px] text-green-700 bg-green-50 p-2 rounded border border-green-200">
                  Tier savings applied: <strong>-${tierSavings.toFixed(2)}</strong>
                </div>
              )}
              <div className="flex justify-between items-center text-[15px] font-bold text-gray-900">
                <span>Subtotal:</span>
                <span className="text-[#0c71c3]">${subtotal.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/cart/"
                  onClick={() => setIsOpen(false)}
                  className="block text-center py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-[14px] font-bold rounded transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout/"
                  onClick={() => setIsOpen(false)}
                  className="block text-center py-2.5 bg-[#0c71c3] hover:bg-[#0a5ea3] text-white text-[14px] font-bold rounded transition-colors"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
