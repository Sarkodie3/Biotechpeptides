import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found (404) | Biotech Peptides',
  description: 'The requested page could not be found. Please browse our research peptide catalog or contact customer support.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-8 py-20 text-center">
      <div className="w-20 h-20 bg-blue-50 text-[#0c71c3] rounded-full flex items-center justify-center mx-auto text-3xl font-black mb-6">
        404
      </div>

      <h1 className="text-3xl md:text-4xl font-black uppercase text-gray-900 tracking-tight mb-4">
        Page Not Found
      </h1>

      <p className="text-[15px] text-gray-600 max-w-[500px] mx-auto mb-8 leading-relaxed">
        The research compound, article, or resource you were looking for has moved or is no longer available at this address.
      </p>

      {/* Search Form */}
      <div className="max-w-[450px] mx-auto mb-10">
        <form action="/" method="GET" className="flex">
          <input
            type="text"
            name="s"
            placeholder="Search compounds (e.g., BPC-157, TB-500)..."
            className="flex-1 border border-gray-300 p-3 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
          />
          <button
            type="submit"
            className="bg-[#0c71c3] hover:bg-[#0a5ea3] text-white px-6 font-bold uppercase text-[13px] tracking-wider transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Quick Navigation Links */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
          Popular Research Destinations
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/buy-peptides/"
            className="bg-[#0c71c3] hover:bg-[#0a5ea3] text-white px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider transition-colors"
          >
            All Peptides
          </Link>
          <Link
            href="/product-category/peptides/"
            className="border border-gray-300 hover:border-gray-500 text-gray-700 px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider transition-colors"
          >
            Single Peptides
          </Link>
          <Link
            href="/product-category/blends/"
            className="border border-gray-300 hover:border-gray-500 text-gray-700 px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider transition-colors"
          >
            Peptide Blends
          </Link>
          <Link
            href="/news/"
            className="border border-gray-300 hover:border-gray-500 text-gray-700 px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider transition-colors"
          >
            Research Blog
          </Link>
          <Link
            href="/contact-us/"
            className="border border-gray-300 hover:border-gray-500 text-gray-700 px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider transition-colors"
          >
            Support
          </Link>
        </div>
      </div>
    </div>
  );
}
