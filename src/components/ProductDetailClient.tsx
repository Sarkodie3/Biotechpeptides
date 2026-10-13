'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import TierDiscountTable from './TierDiscountTable';
import { ProductRecord } from '@/lib/db';

interface ProductDetailClientProps {
  product: ProductRecord;
  relatedProducts: ProductRecord[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addItem } = useCart();

  let images: any[] = [];
  try {
    images = JSON.parse(product.images || '[]');
  } catch {}

  let variations: any[] = [];
  try {
    variations = JSON.parse(product.variations || '[]');
  } catch {}

  let categories: any[] = [];
  try {
    categories = JSON.parse(product.categories || '[]');
  } catch {}

  let specs: Record<string, string> = {};
  try {
    specs = JSON.parse(product.specs || '{}');
  } catch {}

  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState<any | null>(
    variations.length > 0 ? variations[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // Active price calculation
  const activePrice = selectedVariation
    ? parseFloat(selectedVariation.prices?.price || selectedVariation.price || '0') / (selectedVariation.prices?.price ? 100 : 1) || product.price
    : product.price;

  const activeSku = selectedVariation?.sku || product.sku;

  const currentImage = images[selectedImgIdx]?.src || images[0]?.src || '/placeholder.png';

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: activePrice,
        regularPrice: product.regular_price,
        image: images[0]?.src || '',
        variationId: selectedVariation?.id,
        variationName: selectedVariation?.attributes?.[0]?.value || (selectedVariation ? 'Selected Option' : undefined),
        sku: activeSku,
      },
      quantity
    );
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 4000);
  };

  const primaryCategory = categories[0] || { name: 'Peptides', slug: 'peptides' };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-[13px] text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#0c71c3]">
          Home
        </Link>
        <span>/</span>
        <Link href={`/product-category/${primaryCategory.slug}/`} className="hover:text-[#0c71c3]">
          {primaryCategory.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      {/* Main product box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
        {/* Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/5 w-full bg-white border border-gray-200 p-4 flex items-center justify-center">
            {product.on_sale === 1 && (
              <span className="absolute top-4 left-4 z-10 bg-[#36aadd] text-white text-[13px] font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                Sale!
              </span>
            )}
            <Image
              src={currentImage}
              alt={product.name}
              fill
              priority
              className="object-contain p-4"
            />
          </div>

          {/* Thumbnails list */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`relative w-18 h-18 shrink-0 bg-white border p-1 cursor-pointer transition-all ${
                    selectedImgIdx === idx ? 'border-[#0c71c3] ring-2 ring-[#0c71c3]/30' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={img.thumbnail || img.src}
                    alt={img.alt || `Thumbnail ${idx + 1}`}
                    fill
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Form (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">
            {product.name}
          </h1>

          {/* Price display */}
          <div className="text-2xl font-bold text-[#0c71c3]">
            ${activePrice.toFixed(2)}
          </div>

          {/* Short description */}
          {product.short_description && (
            <div
              className="text-[14px] text-gray-600 border-l-2 border-[#0c71c3] pl-3 py-1"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          )}

          {/* Tier discount table */}
          <TierDiscountTable basePrice={activePrice} />

          {/* Variations selector */}
          {variations.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="block text-[13px] font-bold uppercase tracking-wider text-gray-700">
                Please select a size:
              </label>
              <div className="flex flex-wrap gap-2">
                {variations.map((v: any) => {
                  const label = v.attributes?.[0]?.value || v.name?.split('–')?.pop()?.trim() || v.name || 'Standard';
                  const isSelected = selectedVariation?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariation(v)}
                      className={`px-4 py-2 text-[13px] font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0c71c3] border-[#0c71c3] text-white shadow-xs'
                          : 'bg-white border-gray-300 text-gray-800 hover:border-[#0c71c3]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center border border-gray-300 h-11">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-full text-gray-600 hover:bg-gray-100 font-bold"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-14 h-full text-center text-[14px] font-bold border-x border-gray-300 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-full text-gray-600 hover:bg-gray-100 font-bold"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 h-11 bg-[#0c71c3] hover:bg-[#0a5ea3] text-white font-bold text-[14px] uppercase tracking-wider transition-colors cursor-pointer rounded-none shadow-sm"
            >
              Add to cart
            </button>
          </div>

          {addedNotice && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-3 text-[13px] flex items-center justify-between">
              <span>&quot;{product.name}&quot; has been added to your cart.</span>
              <Link href="/cart/" className="font-bold underline hover:text-green-900">
                View Cart
              </Link>
            </div>
          )}

          {/* Meta Info */}
          <div className="pt-4 border-t border-gray-200 text-[13px] text-gray-500 space-y-1">
            {activeSku && (
              <div>
                <span className="font-medium text-gray-700">SKU:</span> {activeSku}
              </div>
            )}
            <div>
              <span className="font-medium text-gray-700">Category:</span>{' '}
              <Link
                href={`/product-category/${primaryCategory.slug}/`}
                className="text-[#0c71c3] hover:underline"
              >
                {primaryCategory.name}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Product Specifications & Description */}
      <div className="border border-gray-200 p-6 md:p-8 bg-white mb-14">
        <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-3 mb-6">
          Description &amp; Specifications
        </h2>

        {/* Specifications Table */}
        {Object.keys(specs).length > 0 && (
          <div className="mb-8 bg-gray-50 border border-gray-200 p-5">
            <h3 className="text-[15px] font-bold text-gray-900 uppercase mb-3">
              Compound Specifications
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[14px]">
              {Object.entries(specs).map(([key, val]) => (
                <div key={key} className="border-b border-gray-200 pb-2">
                  <dt className="font-bold text-gray-700">{key}:</dt>
                  <dd className="text-gray-900 font-mono text-[13px] break-all">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Description Body */}
        <div
          className="prose-biotech text-[14px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />

        {/* Standard Disclaimer Notice */}
        <div className="mt-8 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-900 text-[13px] leading-relaxed">
          <strong>Disclaimer:</strong> The products mentioned are not intended for human or animal consumption. Research chemicals are intended solely for laboratory experimentation and/or in-vitro testing. Bodily introduction of any sort is strictly prohibited by law. All purchases are limited to licensed researchers and/or qualified professionals. All information shared in this article is for educational purposes only.
        </div>
      </div>

      {/* Author Review Box: Dr. Usman */}
      <div className="bg-gray-50 border border-gray-200 p-6 md:p-8 mb-14 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center shrink-0 border-2 border-[#0c71c3] text-[#0c71c3] font-black text-2xl">
          DU
        </div>
        <div className="text-center sm:text-left space-y-2">
          <h2 className="text-lg font-bold text-gray-900">
            <Link href="/dr-usman/" className="hover:text-[#0c71c3]">
              Dr. Usman (BSc, MBBS, MaRCP)
            </Link>
          </h2>
          <p className="text-[13px] text-gray-600 leading-relaxed">
            Dr. Usman completed his studies in medicine at the Royal College of Physicians, London. He is an avid researcher with more than 30 publications in internationally recognized peer-reviewed journals. Dr. Usman has worked as a researcher and medical consultant for reputable pharmaceutical companies including Johnson &amp; Johnson and Sanofi.
          </p>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mb-14">
          <h2 className="text-xl font-bold uppercase tracking-wider text-gray-900 mb-6 border-b border-gray-200 pb-3">
            Related Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <div key={p.id} className="border border-gray-100 p-4 text-center bg-white hover:shadow-md transition-shadow">
                <Link href={`/product/${p.slug}/`} className="block aspect-3/4 relative mb-2">
                  <Image
                    src={JSON.parse(p.images || '[]')[0]?.src || '/placeholder.png'}
                    alt={p.name}
                    fill
                    className="object-contain"
                  />
                </Link>
                <h3 className="text-[14px] font-bold text-gray-900 line-clamp-1 hover:text-[#0c71c3]">
                  <Link href={`/product/${p.slug}/`}>{p.name}</Link>
                </h3>
                <div className="text-[14px] font-bold text-[#0c71c3] mt-1">
                  ${p.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
