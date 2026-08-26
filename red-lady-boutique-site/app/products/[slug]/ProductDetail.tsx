"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Silhouette } from "@/components/Silhouette";
import { ProductCard, type CardProduct } from "@/components/ProductCard";
import { money } from "@/lib/money";
import { useShop } from "@/lib/cart-context";
import { checkVariantStock } from "@/lib/actions";

type Variant = {
  id: string;
  color: string;
  colorHex: string;
  size: string;
  stock: number;
  lowStockThreshold: number;
};

type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  tag: string;
  ratingAvg: number;
  ratingCount: number;
  soldLabel: string | null;
  materials: string | null;
  sizingFit: string | null;
  care: string | null;
  gradient: string;
  silhouette: string;
  variants: Variant[];
};

export function ProductDetail({ product, others }: { product: Product; others: CardProduct[] }) {
  const { addToCart, wishlist, toggleWishlist } = useShop();
  const wished = wishlist.includes(product.slug);

  const colors = useMemo(() => Array.from(new Set(product.variants.map((v) => v.color))), [product]);
  const [color, setColor] = useState(colors[0]);
  const sizesForColor = product.variants.filter((v) => v.color === color);
  const [size, setSize] = useState(sizesForColor.find((v) => v.stock > 0)?.size ?? sizesForColor[0]?.size);
  const [qty, setQty] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>("sizing");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  const activeVariant = product.variants.find((v) => v.color === color && v.size === size) ?? sizesForColor[0];
  const stock = activeVariant?.stock ?? 0;

  function pickColor(next: string) {
    setColor(next);
    const opts = product.variants.filter((v) => v.color === next);
    const firstOk = opts.find((v) => v.stock > 0);
    setSize((firstOk ?? opts[0])?.size);
    setQty(1);
  }

  function handleAdd() {
    if (!activeVariant) return;
    setFeedback(null);
    startTransition(async () => {
      const result = await checkVariantStock(activeVariant.id, qty);
      if (!result.ok) {
        setFeedback({ ok: false, message: result.reason });
        return;
      }
      addToCart({
        variantId: activeVariant.id,
        slug: product.slug,
        title: product.title,
        color: activeVariant.color,
        size: activeVariant.size,
        price: product.price,
        gradient: product.gradient,
        silhouette: product.silhouette,
        maxQty: activeVariant.stock,
        qty,
      });
      setFeedback({ ok: true, message: "Added to your bag." });
    });
  }

  const accordions = [
    { key: "materials", label: "Materials", body: product.materials },
    { key: "sizing", label: "Sizing & Fit", body: product.sizingFit },
    { key: "care", label: "Care Instructions", body: product.care },
    { key: "shipping", label: "Shipping & Returns", body: "Complimentary shipping on all orders. Free returns within 14 days of delivery, unworn and with tags attached." },
  ].filter((a) => a.body);

  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Home</Link> &nbsp;/&nbsp; <Link href={`/?category=${encodeURIComponent(product.category)}`}>{product.category}</Link> &nbsp;/&nbsp;{" "}
        <span style={{ color: "var(--ink)" }}>{product.title}</span>
      </div>

      <div className="pdp-grid">
        <div>
          <div className="pdp-gallery-main" style={{ background: product.gradient }}>
            <Silhouette kind={product.silhouette} width={190} height={292} />
            {stock > 0 && stock <= 3 && (
              <span style={{ position: "absolute", top: 16, left: 16, background: "var(--burgundy)", color: "var(--cream)", fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", padding: "6px 12px", borderRadius: 2 }}>
                Only {stock} Left
              </span>
            )}
            {stock <= 0 && (
              <span style={{ position: "absolute", top: 16, left: 16, background: "var(--ink)", color: "var(--cream)", fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", padding: "6px 12px", borderRadius: 2 }}>
                Sold Out
              </span>
            )}
          </div>
        </div>

        <div>
          <span className="hero-eyebrow">{product.category.toUpperCase()}</span>
          <h1 style={{ fontStyle: "italic", fontSize: 33, marginTop: 10 }}>{product.title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
            <span style={{ fontSize: 19, fontWeight: 500 }}>
              {product.compareAtPrice && (
                <s style={{ color: "var(--ink-soft)", fontWeight: 400, fontSize: 15, marginRight: 6 }}>{money(product.compareAtPrice)}</s>
              )}
              {money(product.price)}
            </span>
            <span className="prod-meta" style={{ fontSize: 12 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--gold)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>
              {product.ratingAvg} ({product.ratingCount} reviews){product.soldLabel ? ` · ${product.soldLabel} sold` : ""}
            </span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: "var(--ink-soft)", marginTop: 20 }}>{product.description}</p>

          <div style={{ marginTop: 30 }}>
            <p style={{ fontSize: 13, fontWeight: 500 }}>
              Color — <span style={{ fontWeight: 400, color: "var(--ink-soft)" }}>{color}</span>
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 11 }}>
              {colors.map((c) => {
                const hex = product.variants.find((v) => v.color === c)?.colorHex ?? "#ccc";
                const anyStock = product.variants.some((v) => v.color === c && v.stock > 0);
                return (
                  <button
                    key={c}
                    type="button"
                    className={"swatch" + (color === c ? " active" : "") + (anyStock ? "" : " disabled")}
                    style={{ background: hex }}
                    title={c + (anyStock ? "" : " — sold out")}
                    disabled={!anyStock}
                    onClick={() => pickColor(c)}
                  />
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 26 }}>
            <p style={{ fontSize: 13, fontWeight: 500 }}>Size</p>
            <div style={{ display: "flex", gap: 9, marginTop: 11, flexWrap: "wrap" }}>
              {sizesForColor.map((v) => (
                <button
                  key={v.size}
                  type="button"
                  className={"size-pill" + (size === v.size ? " active" : "") + (v.stock <= 0 ? " disabled" : "")}
                  disabled={v.stock <= 0}
                  onClick={() => {
                    setSize(v.size);
                    setQty(1);
                  }}
                >
                  {v.size}
                </button>
              ))}
            </div>
            {stock > 0 && stock <= 3 && (
              <p style={{ fontSize: 12, color: "var(--burgundy)", fontWeight: 500, marginTop: 10 }}>
                Only {stock} left in {color} / {size} — order soon.
              </p>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
            <div className="qty-stepper">
              <button type="button" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
              <span>{qty}</span>
              <button type="button" disabled={qty >= stock} onClick={() => setQty((q) => Math.min(stock, q + 1))}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><line x1="12" y1="5" x2="12" y2="19" /></svg>
              </button>
            </div>
            <button type="button" className="btn-primary" style={{ flex: 1, minWidth: 160 }} disabled={stock <= 0 || isPending} onClick={handleAdd}>
              {stock <= 0 ? "Sold Out" : isPending ? "Adding…" : "Add to Bag"}
            </button>
            <button
              type="button"
              className="iconbtn"
              style={{ border: "1px solid var(--stone-dark)", borderRadius: 2, width: 52, height: 52, color: wished ? "var(--burgundy)" : "var(--ink)" }}
              aria-label="Toggle wishlist"
              onClick={() => toggleWishlist(product.slug)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7.5-4.6-10-9.3C.5 8 2 4.5 5.6 4c2.1-.3 3.9.8 6.4 3.3C14.5 4.8 16.3 3.7 18.4 4c3.6.5 5.1 4 3.6 7.7C19.5 16.4 12 21 12 21z" /></svg>
            </button>
          </div>

          {feedback && (
            <p style={{ marginTop: 12, fontSize: 13, color: feedback.ok ? "var(--ok)" : "var(--burgundy)" }}>{feedback.message}</p>
          )}

          <div style={{ marginTop: 36 }}>
            {accordions.map((a) => {
              const open = openAccordion === a.key;
              return (
                <div key={a.key} className="accordion-item">
                  <button type="button" className="accordion-btn" onClick={() => setOpenAccordion(open ? null : a.key)}>
                    {a.label}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s ease" }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {open && (
                    <div className="accordion-panel">
                      <p>{a.body}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <section style={{ padding: "90px 0 80px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 5.5L20 9l-4.4 3.6L17 19l-5-3.4L7 19l1.4-6.4L4 9l5.6-1.5z" /></svg>
            <h2 style={{ fontStyle: "italic", fontSize: 24 }}>Complete the Look</h2>
          </div>
          <div className="grid">
            {others.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
