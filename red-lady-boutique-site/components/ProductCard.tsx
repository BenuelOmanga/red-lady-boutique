"use client";

import Link from "next/link";
import { Silhouette } from "./Silhouette";
import { money } from "@/lib/money";
import { useShop } from "@/lib/cart-context";

export type CardProduct = {
  slug: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  tag: string;
  ratingAvg: number;
  soldLabel: string | null;
  gradient: string;
  silhouette: string;
};

export function ProductCard({ product }: { product: CardProduct }) {
  const { wishlist, toggleWishlist } = useShop();
  const wished = wishlist.includes(product.slug);
  const isBest = product.tag === "BESTSELLER";

  return (
    <Link href={`/products/${product.slug}`} className="card">
      <div className="card-img" style={{ background: product.gradient }}>
        <Silhouette kind={product.silhouette} width={88} height={135} />
        <span className="card-tag" style={{ background: isBest ? "var(--burgundy)" : "var(--ink)", color: "var(--cream)" }}>
          {isBest ? "Best Seller" : "New"}
        </span>
        <button
          type="button"
          className={"fav" + (wished ? " active" : "")}
          aria-label="Toggle wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.slug);
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s-7.5-4.6-10-9.3C.5 8 2 4.5 5.6 4c2.1-.3 3.9.8 6.4 3.3C14.5 4.8 16.3 3.7 18.4 4c3.6.5 5.1 4 3.6 7.7C19.5 16.4 12 21 12 21z" />
          </svg>
        </button>
      </div>
      <p className="prod-title">{product.title}</p>
      <div className="prod-row">
        <span className="prod-price">
          {product.compareAtPrice ? (
            <>
              <s style={{ color: "var(--ink-soft)", fontWeight: 400, fontSize: 12, marginRight: 6 }}>{money(product.compareAtPrice)}</s>
              {money(product.price)}
            </>
          ) : (
            money(product.price)
          )}
        </span>
        {isBest && (
          <span className="prod-meta">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--gold)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>
            {product.ratingAvg} · {product.soldLabel}
          </span>
        )}
      </div>
    </Link>
  );
}
