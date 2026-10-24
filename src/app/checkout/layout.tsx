import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Checkout | Biotech Peptides',
  robots: {
    googleBot: { index: false, follow: false },
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
