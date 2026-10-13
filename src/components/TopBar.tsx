'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function TopBar() {
  const { itemCount, setIsOpen } = useCart();

  return (
    <div className="bg-[#0c71c3] text-white text-[13px] py-1.5 px-4 md:px-8 border-b border-[#0a5ea3]">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between">
        {/* Support email */}
        <div className="flex items-center gap-4">
          <a
            href="mailto:support@biotechpeptides.com"
            className="hover:underline flex items-center gap-1.5 font-medium"
          >
            <span>support@biotechpeptides.com</span>
          </a>
          <a
            href="#main-content"
            className="hidden sm:inline-block text-[11px] uppercase tracking-wider text-white/80 hover:text-white px-2 py-0.5 rounded border border-white/30"
          >
            Skip to Content
          </a>
        </div>

        {/* Right side: My account & Cart */}
        <div className="flex items-center gap-5">
          <Link
            href="/my-account/"
            className="hover:underline font-semibold tracking-wide uppercase text-[12px]"
          >
            MY ACCOUNT
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 cursor-pointer hover:opacity-90"
            aria-label="View shopping cart"
          >
            {/* Cart Icon */}
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            <span className="bg-black text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
              {itemCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
