import { prisma } from "@/lib/prisma";
import { AdminTable } from "./AdminTable";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const products = await prisma.product.findMany({
    include: { category: true, variants: { orderBy: [{ color: "asc" }, { size: "asc" }] } },
    orderBy: { createdAt: "desc" },
  });

  const allVariants = products.flatMap((p) => p.variants);
  const lowStockCount = allVariants.filter((v) => v.stock > 0 && v.stock <= v.lowStockThreshold).length;
  const outOfStockCount = allVariants.filter((v) => v.stock === 0).length;

  const rows = products.map((p) => {
    const primary = p.variants[0] ?? null;
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category.name,
      price: p.price.toNumber(),
      gradient: p.gradient,
      isPinned: p.isPinned,
      primaryVariantId: primary?.id ?? null,
      primaryColor: primary?.color ?? null,
      primarySize: primary?.size ?? null,
      primaryStock: primary?.stock ?? 0,
      primaryThreshold: primary?.lowStockThreshold ?? 5,
      variantCount: p.variants.length,
    };
  });

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-nav-item active">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" /></svg>
          <span>Dashboard</span>
        </div>
        <div className="admin-nav-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8h12l1 13H5L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
          <span>Orders</span>
        </div>
        <div className="admin-nav-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7l8-4 8 4v10l-8 4-8-4V7z" /><path d="M4 7l8 4 8-4 M12 11v10" /></svg>
          <span>Inventory</span>
        </div>
        <a className="admin-nav-item" href="/" style={{ marginTop: 10, borderTop: "1px solid rgba(248,242,233,0.12)", paddingTop: 16 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11.5 12 4l8 7.5" /><path d="M6 10v10h5v-6h2v6h5V10" /></svg>
          <span>Back to Storefront</span>
        </a>
      </aside>

      <main className="admin-main">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
          <div>
            <h1 style={{ fontSize: 23 }}>Good afternoon, Amara</h1>
            <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4 }}>
              Stock and pin controls below write to the real database — refresh the page and your change is still there.
            </p>
          </div>
        </div>

        <div className="metric-grid" style={{ marginBottom: 10 }}>
          <div className="metric-card">
            <p className="metric-label">Daily Revenue</p>
            <p className="metric-value">$8,420</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Total Orders</p>
            <p className="metric-value">37</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Low Stock Alerts</p>
            <p className="metric-value" style={{ color: lowStockCount > 0 ? "var(--burgundy)" : undefined }}>{lowStockCount}</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Out of Stock</p>
            <p className="metric-value" style={{ color: outOfStockCount > 0 ? "var(--burgundy)" : undefined }}>{outOfStockCount}</p>
          </div>
        </div>
        <p style={{ fontSize: 11, color: "var(--ink-soft)", fontStyle: "italic", marginBottom: 22 }}>
          Revenue and order count are sample figures for this walkthrough — Low Stock and Out of Stock are computed live from the real inventory below.
        </p>

        <div className="metric-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 16px 6px" }}>
            <p style={{ fontSize: 14, fontWeight: 500 }}>Inventory</p>
            <p style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 3 }}>
              Each product's first color/size combination is shown here — open the product page to see its full size run.
            </p>
          </div>
          <AdminTable rows={rows} />
        </div>
      </main>
    </div>
  );
}
