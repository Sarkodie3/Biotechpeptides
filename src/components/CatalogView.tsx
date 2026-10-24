'use client';

import { useState, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import { ProductRecord } from '@/lib/db';
import Link from 'next/link';
import { cleanText } from '@/lib/seo';

interface CatalogViewProps {
  initialProducts: ProductRecord[];
  total: number;
  currentPage: number;
  totalPages: number;
  categoryFilter?: string;
  categoryTitle?: string;
  categorySubtitle?: string;
}

function CatalogViewInner({
  initialProducts,
  total,
  currentPage,
  totalPages,
  categoryFilter,
  categoryTitle = 'Buy quality peptides, made in the USA',
  categorySubtitle = 'Leading the research industry',
}: CatalogViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('orderby') || 'menu_order';
  const currentInStock = searchParams.get('in_stock') === '1';

  const [inStockOnly, setInStockOnly] = useState(currentInStock);
  const [selectedSort, setSelectedSort] = useState(currentSort);

  const applyFilter = (newSort = selectedSort, inStock = inStockOnly) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort && newSort !== 'menu_order') {
      params.set('orderby', newSort);
    } else {
      params.delete('orderby');
    }

    if (inStock) {
      params.set('in_stock', '1');
    } else {
      params.delete('in_stock');
    }

    params.delete('page'); // Reset to page 1
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage > 1) {
      params.set('page', newPage.toString());
    } else {
      params.delete('page');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const startIdx = (currentPage - 1) * 28 + 1;
  const endIdx = Math.min(currentPage * 28, total);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
      {/* Banner Notice */}
      <div className="bg-[#f0f7fd] border-l-4 border-[#0c71c3] p-3 mb-6 flex items-center justify-between">
        <h6 className="text-[13px] font-bold uppercase tracking-wider text-[#0c71c3]">
          Free same day priority shipping on qualifying orders
        </h6>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
          {cleanText(categoryTitle)}
        </h1>
        <p className="text-[15px] text-gray-600 mt-1">{cleanText(categorySubtitle)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters (3 cols) */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-gray-50 border border-gray-200 p-5 rounded-none space-y-6">
            <h3 className="text-[15px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2">
              Filter Catalog
            </h3>

            {/* Categories */}
            <div>
              <h4 className="text-[13px] font-bold text-gray-700 uppercase mb-2">
                Categories
              </h4>
              <ul className="space-y-1.5 text-[14px]">
                <li>
                  <Link
                    href="/buy-peptides/"
                    className={`flex items-center justify-between hover:text-[#0c71c3] ${
                      !categoryFilter ? 'font-bold text-[#0c71c3]' : 'text-gray-600'
                    }`}
                  >
                    <span>All Products</span>
                    <span className="text-xs text-gray-400">89</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/product-category/peptides/"
                    className={`flex items-center justify-between hover:text-[#0c71c3] ${
                      categoryFilter === 'peptides' ? 'font-bold text-[#0c71c3]' : 'text-gray-600'
                    }`}
                  >
                    <span>Peptides</span>
                    <span className="text-xs text-gray-400">73</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/product-category/blends/"
                    className={`flex items-center justify-between hover:text-[#0c71c3] ${
                      categoryFilter === 'blends' ? 'font-bold text-[#0c71c3]' : 'text-gray-600'
                    }`}
                  >
                    <span>Peptide Blends</span>
                    <span className="text-xs text-gray-400">16</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* In Stock toggle */}
            <div className="pt-2 border-t border-gray-200">
              <label className="flex items-center gap-2 text-[14px] font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    applyFilter(selectedSort, e.target.checked);
                  }}
                  className="rounded text-[#0c71c3] focus:ring-[#0c71c3]"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Reset */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setInStockOnly(false);
                  setSelectedSort('menu_order');
                  router.push(pathname);
                }}
                className="w-full py-2 text-[12px] font-bold uppercase tracking-wider text-gray-600 border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid & Controls (9 cols) */}
        <div className="lg:col-span-9">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
            <p className="text-[13px] text-gray-600">
              Showing {total > 0 ? `${startIdx}–${endIdx}` : 0} of {total} results
            </p>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="orderby" className="text-[13px] text-gray-600 font-medium">
                Sort by:
              </label>
              <select
                id="orderby"
                value={selectedSort}
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  applyFilter(e.target.value, inStockOnly);
                }}
                className="text-[13px] border border-gray-300 bg-white py-1.5 px-3 rounded-none focus:outline-hidden focus:border-[#0c71c3]"
              >
                <option value="menu_order">Default sorting</option>
                <option value="popularity">Sort by popularity</option>
                <option value="date">Sort by latest</option>
                <option value="price">Sort by price: low to high</option>
                <option value="price-desc">Sort by price: high to low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {initialProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 border border-gray-200 p-8">
              <p className="text-gray-600 text-[15px]">No products were found matching your selection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {initialProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  onClick={() => handlePageChange(pg)}
                  className={`w-9 h-9 text-[13px] font-bold border cursor-pointer transition-colors ${
                    pg === currentPage
                      ? 'bg-[#0c71c3] border-[#0c71c3] text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pg}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogView(props: CatalogViewProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-20 text-center text-gray-500">
          Loading catalog...
        </div>
      }
    >
      <CatalogViewInner {...props} />
    </Suspense>
  );
}
