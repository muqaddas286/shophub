import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopHub - Premium eCommerce Store',
  description: 'Discover premium products for every lifestyle. Shop electronics, fashion, home decor, and more with fast shipping.',
  keywords: 'ecommerce, shopping, electronics, fashion, home decor, online store',
  openGraph: {
    title: 'ShopHub - Premium eCommerce Store',
    description: 'Discover premium products for every lifestyle.',
    images: [{ url: 'https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&cs=tinysrgb&w=1200' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopHub - Premium eCommerce Store',
    description: 'Discover premium products for every lifestyle.',
    images: [{ url: 'https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&cs=tinysrgb&w=1200' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
