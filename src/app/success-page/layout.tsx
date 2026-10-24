import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Received | Biotech Peptides',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuccessPageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
