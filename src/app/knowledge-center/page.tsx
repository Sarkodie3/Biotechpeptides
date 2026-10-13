import Link from 'next/link';
import Image from 'next/image';
import { getPosts } from '@/lib/db';

export const metadata = {
  title: 'Knowledge Center - Biotech Peptides',
  description: 'Knowledge Center - All peptides articles and shared info are for educational purposes only.',
};

export default function KnowledgeCenterPage() {
  const { posts } = getPosts({ category: 'Knowledge Center', limit: 20 });

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black uppercase text-gray-900 tracking-tight">
          Knowledge Center
        </h1>
        <p className="text-[15px] text-gray-600 mt-2">
          All articles and shared info are for educational purposes only.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: any) => (
          <article
            key={post.id}
            className="bg-white border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
          >
            {post.featured_image && (
              <Link href={`/${post.slug}/`} className="block relative aspect-16/9 bg-gray-100">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </Link>
            )}

            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 hover:text-[#0c71c3] transition-colors mb-3">
                <Link href={`/${post.slug}/`}>
                  {post.title}
                </Link>
              </h2>

              <div
                className="text-[14px] text-gray-600 line-clamp-3 mb-4 flex-1"
                dangerouslySetInnerHTML={{ __html: post.excerpt || '' }}
              />

              <div className="pt-4 border-t border-gray-100">
                <Link
                  href={`/${post.slug}/`}
                  className="text-[13px] font-bold uppercase tracking-wider text-[#0c71c3] hover:underline"
                >
                  Read Article →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
