import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#212121] text-white pt-12 pb-0">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-gray-700">
          {/* Column 1: Disclaimers & Mission (6 cols) */}
          <div className="md:col-span-6 space-y-4 text-[13px] text-gray-300 leading-relaxed">
            <p>
              Biotech Peptides is a chemical supplier. Biotech Peptides is not a compounding pharmacy or chemical compounding facility as defined under 503A of the Federal Food, Drug, and Cosmetic act. Biotech Peptides is not an outsourcing facility as defined under 503B of the Federal Food, Drug, and Cosmetic act.
            </p>
            <p className="font-semibold text-white/90">
              All products are sold for research, laboratory, or analytical purposes only, and are not for human consumption.
            </p>
          </div>

          {/* Column 2: Useful links (3 cols) */}
          <div className="md:col-span-3">
            <h2 className="text-[16px] font-bold uppercase tracking-wider mb-4 text-white">
              USEFUL LINKS
            </h2>
            <ul className="space-y-2 text-[13px]">
              <li>
                <Link href="/knowledge-center/" className="text-gray-300 hover:text-[#36aadd] transition-colors">
                  Knowledge Center
                </Link>
              </li>
              <li>
                <Link href="/about/" className="text-gray-300 hover:text-[#36aadd] transition-colors">
                  About Biotech Peptides
                </Link>
              </li>
              <li>
                <Link href="/shipping/" className="text-gray-300 hover:text-[#36aadd] transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy/" className="text-gray-300 hover:text-[#36aadd] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions/" className="text-gray-300 hover:text-[#36aadd] transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/accessibility/" className="text-gray-300 hover:text-[#36aadd] transition-colors">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link href="/refunds-and-returns/" className="text-gray-300 hover:text-[#36aadd] transition-colors">
                  Refunds and Returns
                </Link>
              </li>
              <li>
                <Link href="/contact-us/" className="text-gray-300 hover:text-[#36aadd] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact (3 cols) */}
          <div className="md:col-span-3">
            <h2 className="text-[16px] font-bold uppercase tracking-wider mb-4 text-white">
              CONTACT:
            </h2>
            <div className="text-[13px] text-gray-300 space-y-2">
              <p>
                <a
                  href="mailto:support@biotechpeptides.com"
                  className="text-[#36aadd] hover:underline"
                >
                  support@biotechpeptides.com
                </a>
              </p>
              <p className="text-gray-400">
                Customer support available Mon-Fri. All inquiries answered within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#0d5b9c] py-4 text-center text-[13px] text-white">
        <div className="max-w-[1280px] mx-auto px-4">
          <p>© Copyright 2026. Biotech Peptides. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
