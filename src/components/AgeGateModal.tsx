'use client';

import { useEffect, useState } from 'react';

const AGE_KEY = 'biotech_age_v4';

export default function AgeGateModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check sessionStorage & cookie
    try {
      const session = sessionStorage.getItem(AGE_KEY);
      const cookieMatch = document.cookie.includes(`${AGE_KEY}=1`);
      if (session === '1' || cookieMatch) {
        document.documentElement.classList.add('biotech-age-ok');
        setIsOpen(false);
        return;
      }
    } catch {}

    setIsOpen(true);
  }, []);

  const handleAgree = () => {
    try {
      sessionStorage.setItem(AGE_KEY, '1');
      const secure = location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `${AGE_KEY}=1; path=/; SameSite=Lax${secure}`;
      const host = location.hostname.replace(/^www\./, '');
      if (host.includes('.')) {
        document.cookie = `${AGE_KEY}=1; path=/; domain=.${host}; SameSite=Lax${secure}`;
      }
    } catch {}
    document.documentElement.classList.add('biotech-age-ok');
    setIsOpen(false);
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com/';
  };

  if (!isOpen) return null;

  return (
    <div
      id="biotech-age-gate"
      className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="biotech-age-gate-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#081220]/80 backdrop-blur-[2px]"
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-[520px] bg-white border border-[#d7e6f2] shadow-[0_18px_48px_rgba(0,0,0,0.25)] p-7 md:p-8 text-center rounded-none">
        <p
          id="biotech-age-gate-title"
          className="text-[#122033] text-[16px] md:text-[17px] leading-[1.6] mb-6 font-sans"
        >
          The products on this website are only for research professionals of 21+ years of age, purchasing for research purposes only. Any human or animal consumption is strictly prohibited.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleAgree}
            className="cursor-pointer bg-[#117cd3] hover:bg-[#0c71c3] text-white text-[16px] font-bold py-3 px-7 min-w-[140px] transition-colors rounded-none"
          >
            I agree
          </button>
          <button
            type="button"
            onClick={handleDecline}
            className="cursor-pointer bg-white text-[#117cd3] border border-[#117cd3] hover:bg-[#f0f6fc] text-[16px] font-bold py-3 px-7 min-w-[140px] transition-colors rounded-none"
          >
            I decline
          </button>
        </div>
      </div>
    </div>
  );
}
