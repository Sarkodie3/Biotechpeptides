import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MiniCartDrawer from '@/components/MiniCartDrawer';
import AgeGateModal from '@/components/AgeGateModal';
import { CANONICAL_DOMAIN, getOrganizationSchema, getWebSiteSchema } from '@/lib/seo';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_DOMAIN),
  title: {
    default: 'Buy Peptides for Scientific Research (USA Made) | Biotech Peptides',
    template: '%s | Biotech Peptides',
  },
  description:
    'Biotech Peptides is a premier USA laboratory supplier of high-purity lyophilized research peptides and synergistic blends, verified >99% purity by third-party HPLC-MS analytical testing.',
  alternates: {
    canonical: `${CANONICAL_DOMAIN}/`,
  },
  icons: {
    icon: '/wp-content/uploads/2022/10/Biotech-Peptides-192x192-1.png',
    apple: '/wp-content/uploads/2022/10/Biotech-Peptides-192x192-1.png',
  },
  openGraph: {
    title: 'Buy Peptides for Scientific Research (USA Made) | Biotech Peptides',
    description:
      'Biotech Peptides offers high-purity research peptides, synthesized and lyophilized in the USA with HPLC-MS verification for laboratory researchers.',
    url: `${CANONICAL_DOMAIN}/`,
    siteName: 'Biotech Peptides',
    images: [
      {
        url: `${CANONICAL_DOMAIN}/wp-content/uploads/2020/12/biotech-peptides-social.jpg`,
        width: 1400,
        height: 536,
        alt: 'Biotech Peptides Laboratory Research Supplier',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Peptides for Scientific Research (USA Made) | Biotech Peptides',
    description:
      'High-purity lyophilized research peptides synthesized in the USA with third-party analytical testing.',
    images: [`${CANONICAL_DOMAIN}/wp-content/uploads/2020/12/biotech-peptides-social.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = getOrganizationSchema();
  const webSiteSchema = getWebSiteSchema();

  return (
    <html lang="en-US">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <CartProvider>
          <AgeGateModal />
          <TopBar />
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <MiniCartDrawer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
