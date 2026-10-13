import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MiniCartDrawer from '@/components/MiniCartDrawer';
import AgeGateModal from '@/components/AgeGateModal';

export const metadata: Metadata = {
  title: 'Buy Peptides for Scientific Research (USA Made)',
  description:
    'Buy peptides online, synthesized, and lyophilized in the USA. Biotech Peptides offers the synthesis of ANY peptide desired.',
  metadataBase: new URL('https://biotechpeptides.com'),
  icons: {
    icon: '/wp-content/uploads/2022/10/Biotech-Peptides-192x192-1.png',
  },
  openGraph: {
    title: 'Buy Peptides Online - CREDIT CARDS ACCEPTED (USA Made) - Biotech',
    description:
      'Biotech Peptides offer the synthesis of ANY peptide desired. Buy quality peptides online, synthesized, and lyophilized in the USA.',
    url: 'https://biotechpeptides.com/',
    siteName: 'Biotech Peptides',
    images: [
      {
        url: '/wp-content/uploads/2020/12/biotech-peptides-social.jpg',
        width: 1400,
        height: 536,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US">
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
      </body>
    </html>
  );
}
