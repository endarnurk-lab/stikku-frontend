import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Stikku - Toko Stiker Premium',
  description: 'Temukan stiker keren untuk melengkapi gayamu.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900">
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>

        {/* SUNTIKAN SISTEM PEMBAYARAN MIDTRANS (MODE UJI COBA) */}
        {/* Nanti client-key nya kita ganti dengan milik Anda */}
        <Script 
          src="https://app.sandbox.midtrans.com/snap/snap.js" 
          data-client-key="SB-Mid-client-DUMMY"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}