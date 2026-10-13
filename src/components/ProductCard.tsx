import Link from 'next/link';
import Image from 'next/image';
import { ProductRecord } from '@/lib/db';

export default function ProductCard({ product }: { product: ProductRecord }) {
  let images: any[] = [];
  try {
    images = JSON.parse(product.images || '[]');
  } catch {}

  const mainImage = images[0]?.src || images[0]?.thumbnail || '/placeholder.png';
  const onSale = product.on_sale === 1;

  // Format price display
  let priceDisplay = `$${product.price.toFixed(2)}`;
  if (product.type === 'variable' && product.regular_price > product.price) {
    priceDisplay = `$${product.price.toFixed(2)} – $${product.regular_price.toFixed(2)}`;
  }

  return (
    <div className="group relative bg-white border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all flex flex-col p-4 text-center rounded-none">
      {/* On sale badge */}
      {onSale && (
        <span className="absolute top-3 left-3 z-10 bg-[#36aadd] text-white text-[13px] font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
          Sale!
        </span>
      )}

      {/* Product Image */}
      <Link
        href={`/product/${product.slug}/`}
        className="block relative w-full aspect-3/4 mb-4 overflow-hidden bg-white flex items-center justify-center"
      >
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Product Name */}
      <h2 className="text-[15px] font-bold text-gray-900 group-hover:text-[#0c71c3] transition-colors mb-2 line-clamp-2">
        <Link href={`/product/${product.slug}/`}>
          {product.name}
        </Link>
      </h2>

      {/* Price */}
      <div className="mt-auto pt-2 text-[15px] font-bold text-[#0c71c3]">
        {onSale && product.sale_price ? (
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-400 line-through font-normal text-[14px]">
              ${product.regular_price.toFixed(2)}
            </span>
            <span className="text-[#0c71c3]">
              ${product.sale_price.toFixed(2)}
            </span>
          </div>
        ) : (
          <span>{priceDisplay}</span>
        )}
      </div>

      {/* Action button */}
      <div className="mt-3">
        <Link
          href={`/product/${product.slug}/`}
          className="inline-block w-full py-2 px-3 text-[13px] font-bold uppercase tracking-wider bg-[#0c71c3] hover:bg-[#0a5ea3] text-white transition-colors"
        >
          {product.type === 'variable' ? 'Select options' : 'View Product'}
        </Link>
      </div>
    </div>
  );
}
