import { CartProvider } from "../context/CartContext";
import "./globals.css"; // INI WAJIB ADA agar desainnya muncul!

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}