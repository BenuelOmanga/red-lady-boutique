import type { Metadata } from "next";
import "./globals.css";
import { ShopProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "The Red Lady Boutique",
  description: "A real, live storefront and admin dashboard for The Red Lady Boutique.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ShopProvider>
          <Header />
          {children}
          <CartDrawer />
        </ShopProvider>
      </body>
    </html>
  );
}
