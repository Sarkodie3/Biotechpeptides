import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  const { products } = getAllProducts({
    search: q.trim(),
    limit: 8,
  });

  const results = products.map((p) => {
    let images: any[] = [];
    try {
      images = JSON.parse(p.images || '[]');
    } catch {}

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      images,
    };
  });

  return NextResponse.json({ results });
}
