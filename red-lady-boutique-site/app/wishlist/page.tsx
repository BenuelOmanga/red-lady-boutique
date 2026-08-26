"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useShop } from "@/lib/cart-context";
import { ProductCard, type CardProduct } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";

export default function WishlistPage() {
  const { wishlist } = useShop();
  const [products, setProducts] = useState<CardProduct[] | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  const items = (products || []).filter((p) => wishlist.includes(p.slug));

  return (
    <main>
      <div className="wrap">
        <div className="crumb">
          <Link href="/">Home</Link> &nbsp;/&nbsp; <span style={{ color: "var(--ink)" }}>Wishlist</span>
        </div>
        <div className="section-head" style={{ marginTop: 22 }}>
          <h2 style={{ fontSize: 28 }}>Your Wishlist</h2>
        </div>

        {products === null ? null : items.length > 0 ? (
          <div className="grid" style={{ paddingBottom: 90 }}>
            {items.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div style={{ paddingBottom: 100 }}>
            <div className="empty-state">
              <h3>Nothing saved yet</h3>
              <p>Tap the heart on anything you love and it will turn up here.</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
