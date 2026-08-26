import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Silhouette } from "@/components/Silhouette";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { money } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const activeCategory = searchParams.category || "All";

  const [categories, allProducts] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
  ]);

  const inCategory = (p: (typeof allProducts)[number]) =>
    activeCategory === "All" || p.category.name === activeCategory;

  const newArrivals = allProducts.filter((p) => p.tag === "NEW" && inCategory(p));
  const bestSellers = allProducts.filter((p) => p.tag === "BESTSELLER" && inCategory(p));

  const toCard = (p: (typeof allProducts)[number]) => ({
    slug: p.slug,
    title: p.title,
    price: p.price.toNumber(),
    compareAtPrice: p.compareAtPrice ? p.compareAtPrice.toNumber() : null,
    tag: p.tag,
    ratingAvg: p.ratingAvg,
    soldLabel: p.soldLabel,
    gradient: p.gradient,
    silhouette: p.silhouette,
  });

  const featured = allProducts.find((p) => p.tag === "NEW") ?? allProducts[0];

  return (
    <main>
      <section className="wrap hero">
        <div className="hero-copy">
          <span className="hero-eyebrow">SS26 COLLECTION</span>
          <h1>
            Quiet luxury,
            <br />
            worn loudly.
          </h1>
          <p className="sub">
            Considered silhouettes cut from fabrics that reward a second look — designed in-house, finished by hand in
            small runs.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 32, flexWrap: "wrap" }}>
            {featured && (
              <Link href={`/products/${featured.slug}`} className="btn-primary">
                Shop New Arrivals
              </Link>
            )}
            <a href="#editorial" style={{ fontSize: 13, letterSpacing: 1, color: "var(--ink)", display: "inline-flex", alignItems: "center", gap: 8 }}>
              View Lookbook
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12" /><polyline points="13 5 20 12 13 19" /></svg>
            </a>
          </div>
          <p style={{ fontSize: 11, letterSpacing: 1.1, color: "var(--ink-soft)", marginTop: 40 }}>
            FREE WORLDWIDE SHIPPING &nbsp;·&nbsp; 14-DAY RETURNS
          </p>
        </div>
        <div className="hero-visual">
          <div className="hero-panel" style={{ background: featured?.gradient ?? "linear-gradient(150deg,#7a1b2c,#3d0e17)" }}>
            <Silhouette kind={featured?.silhouette ?? "dress"} width={150} height={230} />
            {featured && (
              <div className="float-card">
                <p style={{ fontSize: 12, color: "var(--ink-soft)" }}>{featured.title}</p>
                <p style={{ fontSize: 15, fontWeight: 500, marginTop: 2 }}>{money(featured.price.toNumber())}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="wrap" style={{ paddingBottom: 44 }}>
        <div className="chip-row">
          <Link href="/" className={"chip" + (activeCategory === "All" ? " active" : "")}>All</Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/?category=${encodeURIComponent(c.name)}`} className={"chip" + (activeCategory === c.name ? " active" : "")}>
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {newArrivals.length === 0 && bestSellers.length === 0 ? (
        <div className="wrap" style={{ paddingBottom: 90 }}>
          <div className="empty-state">
            <h3>New for {activeCategory}</h3>
            <p>This capsule is still being cut and sewn — check back soon, or explore another category above.</p>
          </div>
        </div>
      ) : (
        <>
          {newArrivals.length > 0 && (
            <section className="wrap" style={{ paddingBottom: 80 }}>
              <div className="section-head">
                <div>
                  <span className="hero-eyebrow">JUST IN</span>
                  <h2 style={{ fontSize: 31, marginTop: 8 }}>New Arrivals</h2>
                </div>
              </div>
              <div className="grid">
                {newArrivals.map((p) => (
                  <ProductCard key={p.id} product={toCard(p)} />
                ))}
              </div>
            </section>
          )}

          <section className="editorial" id="editorial">
            <div className="editorial-inner">
              <div style={{ width: 54, height: 1, background: "var(--gold)", margin: "0 auto 26px" }} />
              <span className="hero-eyebrow">OUR CRAFT</span>
              <h2>Every piece begins as a sketch, ends as a second skin.</h2>
              <p style={{ fontSize: 14, color: "rgba(248,242,233,0.62)", lineHeight: 1.7, marginTop: 20, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
                Founded in 2014, The Red Lady Boutique designs in-house and produces in limited runs — considered
                fashion, not fast fashion.
              </p>
              <div className="editorial-craft">
                <span>HAND-FINISHED SEAMS</span>
                <div style={{ width: 1, height: 13, background: "rgba(248,242,233,0.25)" }} />
                <span>ETHICALLY SOURCED SILK</span>
                <div style={{ width: 1, height: 13, background: "rgba(248,242,233,0.25)" }} />
                <span>MADE IN SMALL BATCHES</span>
              </div>
            </div>
          </section>

          {bestSellers.length > 0 && (
            <section className="wrap" style={{ padding: "80px 0" }}>
              <div className="section-head">
                <div>
                  <span className="hero-eyebrow">MOST LOVED</span>
                  <h2 style={{ fontSize: 31, marginTop: 8 }}>Best Sellers</h2>
                </div>
              </div>
              <div className="grid">
                {bestSellers.map((p) => (
                  <ProductCard key={p.id} product={toCard(p)} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </main>
  );
}
