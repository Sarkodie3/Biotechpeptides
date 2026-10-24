import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart | Biotech Peptides',
  robots: {
    googleBot: { index: false, follow: false },
    index: false,
    follow: false,
  },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
