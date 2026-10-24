import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account | Biotech Peptides',
  robots: {
    googleBot: { index: false, follow: false },
    index: false,
    follow: false,
  },
};

export default function MyAccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
