import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Received | Biotech Peptides',
  robots: {
    googleBot: { index: false, follow: false },
    index: false,
    follow: false,
  },
};

export default function SuccessPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
