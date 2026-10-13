import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getPageBySlug } from '@/lib/db';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug) as any;
  if (post) {
    return {
      title: `${post.title} - Biotech Peptides`,
      description: post.excerpt?.replace(/<[^>]+>/g, '').slice(0, 160) || post.title,
    };
  }

  const page = getPageBySlug(slug) as any;
  if (page) {
    return {
      title: `${page.title} - Biotech Peptides`,
    };
  }

  return {
    title: 'Page Not Found - Biotech Peptides',
  };
}

export default async function DynamicSlugPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Check if it is a Post
  const post = getPostBySlug(slug) as any;
  if (post) {
    const dateStr = new Date(post.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return (
      <article className="max-w-[960px] mx-auto px-4 md:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-[13px] text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#0c71c3]">
            Home
          </Link>
          <span>/</span>
          <Link href="/news/" className="hover:text-[#0c71c3]">
            Research
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{post.title}</span>
        </nav>

        {/* Title & Metadata */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-8 border-b border-gray-100 pb-4">
          <span>by</span>
          <Link href="/dr-usman/" className="font-bold text-[#0c71c3] hover:underline">
            {post.author || 'Dr. Usman'}
          </Link>
          <span>|</span>
          <span>{dateStr}</span>
          <span>|</span>
          <span className="bg-blue-50 text-[#0c71c3] px-2 py-0.5 rounded text-xs font-semibold">
            {post.category || 'Research'}
          </span>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative aspect-16/9 w-full bg-gray-100 mb-10 overflow-hidden border border-gray-200">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Body content */}
        <div
          className="prose-biotech text-[15px] leading-relaxed mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Author Bio Box */}
        <div className="bg-gray-50 border border-gray-200 p-6 md:p-8 mb-12 flex flex-col sm:flex-row items-center gap-6">
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

        {/* Standard Disclaimer */}
        <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-900 text-[13px] leading-relaxed">
          <strong>Disclaimer:</strong> The products mentioned are not intended for human or animal consumption. Research chemicals are intended solely for laboratory experimentation and/or in-vitro testing. Bodily introduction of any sort is strictly prohibited by law. All purchases are limited to licensed researchers and/or qualified professionals. All information shared in this article is for educational purposes only.
        </div>
      </article>
    );
  }

  // 2. Check if it is a Static Page
  const page = getPageBySlug(slug) as any;
  if (page) {
    return (
      <div className="max-w-[960px] mx-auto px-4 md:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-black uppercase text-gray-900 tracking-tight mb-8 border-b border-gray-200 pb-4">
          {page.title}
        </h1>

        <div
          className="prose-biotech text-[15px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    );
  }

  // 3. Fallback not found
  notFound();
}
