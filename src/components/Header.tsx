'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: number;
  name: string;
  slug: string;
  price: number;
  images: any[];
}

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [buyDropdownOpen, setBuyDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search debounced
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
          setShowResults(true);
        }
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowResults(false);
    router.push(`/?s=${encodeURIComponent(searchQuery)}&post_type=product`);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="shrink-0">
          <Link href="/" className="inline-block">
            <Image
              src="/wp-content/uploads/2020/12/Biotech-Peptides.png"
              alt="Biotech Peptides - Buy Peptides Online (USA Made)"
              width={200}
              height={82}
              priority
              className="h-[52px] md:h-[65px] w-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-[15px] font-semibold text-gray-800">
          {/* Buy Peptides with Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setBuyDropdownOpen(true)}
            onMouseLeave={() => setBuyDropdownOpen(false)}
          >
            <Link
              href="/buy-peptides/"
              className="hover:text-[#0c71c3] py-2 inline-flex items-center gap-1 transition-colors"
            >
              Buy Peptides
              <svg className="w-3.5 h-3.5 fill-current opacity-70" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </Link>

            {buyDropdownOpen && (
              <div className="absolute top-full left-0 w-48 bg-white shadow-lg border border-gray-100 py-2 z-50 animate-fadeIn">
                <Link
                  href="/product-category/peptides/"
                  className="block px-4 py-2 hover:bg-[#0c71c3] hover:text-white transition-colors"
                  onClick={() => setBuyDropdownOpen(false)}
                >
                  Peptides
                </Link>
                <Link
                  href="/product-category/blends/"
                  className="block px-4 py-2 hover:bg-[#0c71c3] hover:text-white transition-colors"
                  onClick={() => setBuyDropdownOpen(false)}
                >
                  Peptide Blends
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/about/"
            className="hover:text-[#0c71c3] transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/knowledge-center/"
            className="hover:text-[#0c71c3] transition-colors"
          >
            Knowledge Center
          </Link>
          <Link
            href="/contact-us/"
            className="hover:text-[#0c71c3] transition-colors"
          >
            Contact Us
          </Link>
        </nav>

        {/* Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-[340px] md:max-w-[420px]">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <div className="relative w-full">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowResults(true);
                }}
                placeholder="Search for Compounds, Sequences, or Formulas"
                className="w-full pl-4 pr-12 py-2 text-[13px] bg-[#fdfdfd] border border-gray-300 rounded-l-full rounded-r-none focus:outline-hidden focus:border-[#188fe1] transition-colors"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-3.5 h-3.5 border-2 border-[#188fe1] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <button
              type="submit"
              aria-label="Submit search"
              className="bg-[#188fe1] hover:bg-[#0c71c3] text-white px-4 py-2 rounded-r-full rounded-l-none border border-[#188fe1] cursor-pointer transition-colors flex items-center justify-center shrink-0 h-[38px]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white shadow-xl border border-gray-200 z-50 max-h-[360px] overflow-y-auto">
              {searchResults.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.slug}/`}
                  onClick={() => setShowResults(false)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 shrink-0 flex items-center justify-center">
                    {item.images?.[0]?.src ? (
                      <Image
                        src={item.images[0].src}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-gray-400 text-[10px]">IMG</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-gray-900 truncate">
                      {item.name}
                    </div>
                    <div className="text-[12px] text-[#0c71c3] font-semibold">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                </Link>
              ))}
              <div className="p-2.5 text-center bg-gray-50 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="text-[12px] text-[#0c71c3] hover:underline font-semibold"
                >
                  View all results for &quot;{searchQuery}&quot;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <div className="lg:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-800 p-2 focus:outline-hidden cursor-pointer"
            aria-label="Toggle navigation"
          >
            <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3 text-[15px] font-medium text-gray-800 shadow-md">
          <Link
            href="/buy-peptides/"
            className="block py-1 hover:text-[#0c71c3]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Buy Peptides
          </Link>
          <div className="pl-4 space-y-2 border-l-2 border-gray-200">
            <Link
              href="/product-category/peptides/"
              className="block text-gray-600 hover:text-[#0c71c3]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Peptides
            </Link>
            <Link
              href="/product-category/blends/"
              className="block text-gray-600 hover:text-[#0c71c3]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Peptide Blends
            </Link>
          </div>
          <Link
            href="/about/"
            className="block py-1 hover:text-[#0c71c3]"
            onClick={() => setMobileMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            href="/knowledge-center/"
            className="block py-1 hover:text-[#0c71c3]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Knowledge Center
          </Link>
          <Link
            href="/contact-us/"
            className="block py-1 hover:text-[#0c71c3]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact Us
          </Link>
          <Link
            href="/my-account/"
            className="block py-1 text-[#0c71c3] font-semibold"
            onClick={() => setMobileMenuOpen(false)}
          >
            My Account
          </Link>
        </div>
      )}
    </header>
  );
}
