import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

interface PageProps {
  searchParams: Promise<{ s?: string; post_type?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchQuery = params.s;

  // If search query is present, render search results view
  if (searchQuery) {
    const { products, total } = getAllProducts({
      search: searchQuery,
      limit: 28,
    });

    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10">
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            You searched for &quot;{searchQuery}&quot;
          </h1>
          <p className="text-gray-500 text-[14px]">
            Showing {products.length} of {total} results
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-700 mb-2">No Results Found</h2>
            <p className="text-gray-500 mb-6 text-[14px]">
              No compounds or sequences matched your query. Try searching by generic compound name, formula, or sequence.
            </p>
            <Link
              href="/buy-peptides/"
              className="bg-[#0c71c3] hover:bg-[#0a5ea3] text-white px-6 py-2.5 font-bold uppercase text-[13px] tracking-wider transition-colors inline-block"
            >
              Browse All Peptides
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Standard Homepage
  const { products: allProducts } = getAllProducts({ limit: 40 });

  // Filter single peptides vs blends
  const singlePeptides = allProducts.filter((p) => {
    try {
      const cats = JSON.parse(p.categories || '[]');
      return cats.some((c: any) => c.slug === 'peptides') && !p.name.toLowerCase().includes('blend');
    } catch {
      return true;
    }
  }).slice(0, 8);

  const blends = allProducts.filter((p) => {
    try {
      const cats = JSON.parse(p.categories || '[]');
      return cats.some((c: any) => c.slug === 'blends') || p.name.toLowerCase().includes('blend');
    } catch {
      return false;
    }
  }).slice(0, 8);

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-50/50 to-white overflow-hidden border-b border-gray-100 py-12 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-gray-900 leading-tight">
              Biotech <span className="title-gradient">Peptides</span>
            </h1>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                  <Image
                    src="/wp-content/uploads/2026/07/Asset-10.svg"
                    alt="Synthesis Experience"
                    width={40}
                    height={40}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <p className="text-[14px] md:text-[15px] font-bold text-gray-800 tracking-wide uppercase">
                  SYNTHESIZING PEPTIDES FOR OVER 6 YEARS
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                  <Image
                    src="/wp-content/uploads/2026/07/Asset-11.svg"
                    alt="Quality Testing"
                    width={40}
                    height={40}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <p className="text-[14px] md:text-[15px] font-bold text-gray-800 tracking-wide uppercase">
                  INDEPENDENTLY TESTED FOR QUALITY YOU CAN TRUST
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/buy-peptides/"
                className="inline-block bg-[#0c71c3] hover:bg-[#0a5ea3] text-white text-[14px] md:text-[15px] font-bold py-3.5 px-8 uppercase tracking-wider transition-all shadow-md hover:shadow-lg rounded-none"
              >
                BUY PEPTIDES ONLINE
              </Link>
            </div>
          </div>

          {/* Right Hero Graphic */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[380px] aspect-4/3">
              <Image
                src="/wp-content/uploads/2026/07/Asset-2@300x.webp"
                alt="Lyophilized Peptides"
                fill
                priority
                className="object-contain drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Bar (4 Features) */}
      <section className="bg-gradient-to-r from-[#0b72c3] to-[#42bafc] text-white py-10 shadow-inner">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <h2 className="text-center text-[18px] md:text-[21px] font-black uppercase tracking-wider mb-8 text-white">
            LYOPHILIZED PEPTIDES - TRUSTED SINCE 2019
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
            {/* Feat 1 */}
            <div className="p-3 bg-white/10 rounded-sm backdrop-blur-xs">
              <h3 className="text-[16px] font-bold mb-1 text-white">Rigorous Quality Control</h3>
              <p className="text-[12px] text-white/90 leading-relaxed">
                Our production is verified by HPLC-MS to confirm &gt;99% purity.
              </p>
            </div>

            {/* Feat 2 */}
            <div className="p-3 bg-white/10 rounded-sm backdrop-blur-xs">
              <h3 className="text-[16px] font-bold mb-1 text-white">Independently Tested</h3>
              <p className="text-[12px] text-white/90 leading-relaxed">
                Every batch is verified by a third-party lab, with results posted on our website.
              </p>
            </div>

            {/* Feat 3 */}
            <div className="p-3 bg-white/10 rounded-sm backdrop-blur-xs">
              <h3 className="text-[16px] font-bold mb-1 text-white">Based in the USA</h3>
              <p className="text-[12px] text-white/90 leading-relaxed">
                Peptides are domestically synthesized, backed by our knowledgeable US-based team.
              </p>
            </div>

            {/* Feat 4 */}
            <div className="p-3 bg-white/10 rounded-sm backdrop-blur-xs">
              <h3 className="text-[16px] font-bold mb-1 text-white">Research Use</h3>
              <p className="text-[12px] text-white/90 leading-relaxed">
                Trusted supplier for in-vitro laboratory research compounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Single Peptides */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-gray-900">
            Peptides
          </h2>
          <div className="w-16 h-1 bg-[#0c71c3] mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {singlePeptides.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/product-category/peptides/"
            className="inline-block bg-[#0c71c3] hover:bg-[#0a5ea3] text-white text-[13px] font-bold py-3 px-8 uppercase tracking-wider transition-colors"
          >
            See More Peptides
          </Link>
        </div>
      </section>

      {/* 4. About Banner */}
      <section className="bg-[#f7f7f7] py-14 border-y border-gray-200">
        <div className="max-w-[960px] mx-auto px-4 md:px-8 text-center space-y-4">
          <h3 className="text-2xl font-black uppercase text-gray-900 tracking-wide">
            About Biotech Peptides
          </h3>
          <p className="text-[14px] md:text-[15px] text-gray-700 leading-relaxed max-w-[850px] mx-auto">
            At Biotech Peptides, our mission is to provide laboratories and researchers with the highest-quality peptides possible. Multiple rounds of High-Performance Liquid Chromatography isolate our products by removing contaminating reagents and byproducts of synthesis. As a final measure of peptide accuracy, our analytical lab uses mass spectrometry to verify the theoretical molecular weight of each peptide. At Biotech Peptides, we lead the industry by offering the synthesis of ANY peptide desired. Contact us, and be sure to include the sequence and quantity desired.
          </p>
          <div className="pt-2">
            <Link
              href="/contact-us/"
              className="inline-block bg-[#0c71c3] hover:bg-[#0a5ea3] text-white text-[13px] font-bold py-2.5 px-6 uppercase tracking-wider transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Featured Peptide Blends */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-gray-900">
            Peptide Blends
          </h2>
          <div className="w-16 h-1 bg-[#0c71c3] mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {blends.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/product-category/blends/"
            className="inline-block bg-[#0c71c3] hover:bg-[#0a5ea3] text-white text-[13px] font-bold py-3 px-8 uppercase tracking-wider transition-colors"
          >
            See More Peptide Blends
          </Link>
        </div>
      </section>
    </div>
  );
}
