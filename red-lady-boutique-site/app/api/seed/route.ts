import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Visit this URL once after your first deploy (e.g. https://your-site.vercel.app/api/seed)
// to fill the database with demo products. It's safe to visit more than once —
// it does nothing if products already exist.

const CATEGORIES = ["Dresses", "Outerwear", "Tailoring", "Tops", "Accessories", "Bridal Capsule"];

const PRODUCTS = [
  {
    title: "Vesper Silk Wrap Dress", slug: "vesper-silk-wrap-dress", sku: "RLB-DR-0112",
    category: "Dresses", tag: "NEW", price: 890, compareAtPrice: null,
    ratingAvg: 4.9, ratingCount: 128, soldLabel: null,
    gradient: "linear-gradient(160deg,#7a1b2c,#3d0e17)", silhouette: "dress",
    description: "Cut from 100% mulberry silk, the Vesper wraps and ties at the waist for a fit that moves with you. Finished with a hand-rolled hem and mother-of-pearl buttons at the cuff.",
    materials: "100% mulberry silk charmeuse, lined in silk habotai.",
    sizingFit: "True to size — model is 5'9\" wearing a size S. The wrap tie allows a half-size adjustment either way at the waist.",
    care: "Dry clean only. Store on a padded hanger, away from direct light.",
    colors: [{ name: "Oxblood", hex: "#6d1626" }, { name: "Ink", hex: "#1c1512" }, { name: "Sand", hex: "#c9b89a" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: { "Oxblood|XS": 14, "Oxblood|S": 9, "Oxblood|M": 2, "Oxblood|L": 6, "Oxblood|XL": 0, "Ink|XS": 11, "Ink|S": 16, "Ink|M": 10, "Ink|L": 7, "Ink|XL": 4, "Sand|XS": 5, "Sand|S": 8, "Sand|M": 12, "Sand|L": 9, "Sand|XL": 3 },
  },
  {
    title: "Noir Tailored Blazer", slug: "noir-tailored-blazer", sku: "RLB-BL-0087",
    category: "Tailoring", tag: "NEW", price: 1240, compareAtPrice: null,
    ratingAvg: 4.8, ratingCount: 76, soldLabel: null,
    gradient: "linear-gradient(160deg,#2a201c,#14100e)", silhouette: "coat",
    description: "A single-breasted blazer built on a structured shoulder, cut from Italian wool twill and fully canvassed for a silhouette that holds its shape all day.",
    materials: "100% Italian wool twill, cupro lining, horn buttons.",
    sizingFit: "Fits true to size through the shoulder with room to layer a knit underneath. Model wears a size 4 / EU 36.",
    care: "Dry clean only. Steam to refresh between wears rather than pressing flat.",
    colors: [{ name: "Ink", hex: "#1c1512" }, { name: "Sand", hex: "#c9b89a" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: { "Ink|XS": 12, "Ink|S": 15, "Ink|M": 18, "Ink|L": 10, "Ink|XL": 6, "Sand|XS": 8, "Sand|S": 10, "Sand|M": 9, "Sand|L": 7, "Sand|XL": 3 },
  },
  {
    title: "Aurelia Pleated Skirt", slug: "aurelia-pleated-skirt", sku: "RLB-SK-0034",
    category: "Dresses", tag: "NEW", price: 560, compareAtPrice: null,
    ratingAvg: 4.7, ratingCount: 54, soldLabel: null,
    gradient: "linear-gradient(160deg,#8a6a3f,#5c4526)", silhouette: "skirt",
    description: "Knife-pleated from a fluid crepe that catches the light with every step. Sits at the natural waist with a concealed side zip.",
    materials: "100% crepe de chine, half-lined at the hip.",
    sizingFit: "True to size. The pleats give an inch of ease at the hip beyond the finished measurement.",
    care: "Dry clean only. Hang to preserve the pleats — do not fold for long periods.",
    colors: [{ name: "Oxblood", hex: "#6d1626" }, { name: "Sand", hex: "#c9b89a" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: { "Oxblood|XS": 10, "Oxblood|S": 14, "Oxblood|M": 11, "Oxblood|L": 8, "Oxblood|XL": 4, "Sand|XS": 9, "Sand|S": 12, "Sand|M": 10, "Sand|L": 6, "Sand|XL": 2 },
  },
  {
    title: "Bardot Cashmere Coat", slug: "bardot-cashmere-coat", sku: "RLB-CO-0041",
    category: "Outerwear", tag: "NEW", price: 2180, compareAtPrice: null,
    ratingAvg: 4.9, ratingCount: 112, soldLabel: null,
    gradient: "linear-gradient(160deg,#5c1420,#241012)", silhouette: "coat",
    description: "An oversized cocoon coat in double-faced cashmere, designed to be worn open over everything from tailoring to knitwear.",
    materials: "100% double-faced cashmere, no lining by design.",
    sizingFit: "Designed oversized — size down for a closer silhouette. Model wears a size S in her usual M.",
    care: "Dry clean only. Brush gently after wear to lift the nap.",
    colors: [{ name: "Ink", hex: "#1c1512" }, { name: "Oxblood", hex: "#6d1626" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: { "Ink|XS": 6, "Ink|S": 8, "Ink|M": 5, "Ink|L": 4, "Ink|XL": 2, "Oxblood|XS": 3, "Oxblood|S": 5, "Oxblood|M": 4, "Oxblood|L": 2, "Oxblood|XL": 1 },
  },
  {
    title: "Camille Satin Slip Dress", slug: "camille-satin-slip-dress", sku: "RLB-DR-0098",
    category: "Dresses", tag: "BESTSELLER", price: 410, compareAtPrice: 480,
    ratingAvg: 4.9, ratingCount: 212, soldLabel: "2.1k sold",
    gradient: "linear-gradient(200deg,#8a6a3f,#3d0e17)", silhouette: "dress",
    description: "Bias-cut satin that skims rather than clings, with adjustable straps and a low cowl back — our most-repeated silhouette for a reason.",
    materials: "97% silk, 3% elastane satin.",
    sizingFit: "Cut close to the body — if between sizes, we recommend sizing up.",
    care: "Hand wash cold or dry clean. Do not wring; lay flat to dry.",
    colors: [{ name: "Oxblood", hex: "#6d1626" }, { name: "Ink", hex: "#1c1512" }, { name: "Sand", hex: "#c9b89a" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: { "Oxblood|XS": 16, "Oxblood|S": 20, "Oxblood|M": 14, "Oxblood|L": 9, "Oxblood|XL": 5, "Ink|XS": 12, "Ink|S": 18, "Ink|M": 15, "Ink|L": 10, "Ink|XL": 6, "Sand|XS": 8, "Sand|S": 11, "Sand|M": 9, "Sand|L": 7, "Sand|XL": 3 },
  },
  {
    title: "Faye Wool Trench", slug: "faye-wool-trench", sku: "RLB-CO-0056",
    category: "Outerwear", tag: "BESTSELLER", price: 1680, compareAtPrice: null,
    ratingAvg: 4.8, ratingCount: 94, soldLabel: "860 sold",
    gradient: "linear-gradient(200deg,#3a2c22,#14100e)", silhouette: "coat",
    description: "A double-breasted trench in a technical wool blend, water-resistant enough for real weather without sacrificing the drape.",
    materials: "80% wool, 20% technical nylon blend, water-resistant finish.",
    sizingFit: "True to size with room for tailoring underneath. Belted at the waist, adjustable.",
    care: "Dry clean only. Re-proof the water-resistant finish annually.",
    colors: [{ name: "Ink", hex: "#1c1512" }, { name: "Sand", hex: "#c9b89a" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: { "Ink|XS": 0, "Ink|S": 0, "Ink|M": 0, "Ink|L": 0, "Ink|XL": 0, "Sand|XS": 4, "Sand|S": 6, "Sand|M": 5, "Sand|L": 3, "Sand|XL": 1 },
  },
  {
    title: "Rosalind Silk Blouse", slug: "rosalind-silk-blouse", sku: "RLB-TP-0019",
    category: "Tops", tag: "BESTSELLER", price: 340, compareAtPrice: null,
    ratingAvg: 4.9, ratingCount: 156, soldLabel: "1.4k sold",
    gradient: "linear-gradient(200deg,#7a1b2c,#241012)", silhouette: "blouse",
    description: "A relaxed silk blouse with a French cuff and mother-of-pearl buttons — reads as effortless, holds up to scrutiny.",
    materials: "100% silk crepe de chine, mother-of-pearl buttons.",
    sizingFit: "Relaxed fit through the body. Size down for a more fitted look.",
    care: "Dry clean recommended, or hand wash cold and air dry.",
    colors: [{ name: "Ink", hex: "#1c1512" }, { name: "Sand", hex: "#c9b89a" }],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: { "Ink|XS": 13, "Ink|S": 17, "Ink|M": 14, "Ink|L": 9, "Ink|XL": 5, "Sand|XS": 10, "Sand|S": 13, "Sand|M": 11, "Sand|L": 7, "Sand|XL": 3 },
  },
  {
    title: "Odette Leather Tote", slug: "odette-leather-tote", sku: "RLB-AC-0203",
    category: "Accessories", tag: "BESTSELLER", price: 980, compareAtPrice: null,
    ratingAvg: 4.7, ratingCount: 203, soldLabel: "1.9k sold",
    gradient: "linear-gradient(200deg,#5c4526,#1c1512)", silhouette: "bag",
    description: "Vegetable-tanned Italian leather that develops its own patina — structured enough for the office, soft enough to soften with use.",
    materials: "Vegetable-tanned Italian calfskin, brass hardware, suede lining.",
    sizingFit: "One size. 34cm wide × 28cm tall × 14cm deep — fits a 13\" laptop.",
    care: "Condition leather every few months. Avoid prolonged direct sun.",
    colors: [{ name: "Oxblood", hex: "#6d1626" }, { name: "Ink", hex: "#1c1512" }, { name: "Sand", hex: "#c9b89a" }],
    sizes: ["One Size"],
    stock: { "Oxblood|One Size": 9, "Ink|One Size": 14, "Sand|One Size": 0 },
  },
];

export async function GET() {
  const existing = await prisma.product.count();
  if (existing > 0) {
    return NextResponse.json({ ok: true, message: `Already seeded — ${existing} products exist. Nothing changed.` });
  }

  const categoryMap = new Map<string, string>();
  for (const name of CATEGORIES) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, slug },
    });
    categoryMap.set(name, category.id);
  }

  for (const p of PRODUCTS) {
    const categoryId = categoryMap.get(p.category);
    if (!categoryId) continue;
    await prisma.product.create({
      data: {
        title: p.title,
        slug: p.slug,
        sku: p.sku,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? undefined,
        categoryId,
        tag: p.tag,
        ratingAvg: p.ratingAvg,
        ratingCount: p.ratingCount,
        soldLabel: p.soldLabel ?? undefined,
        gradient: p.gradient,
        silhouette: p.silhouette,
        materials: p.materials,
        sizingFit: p.sizingFit,
        care: p.care,
        isPinned: p.slug === "vesper-silk-wrap-dress",
        variants: {
          create: p.colors.flatMap((c) =>
            p.sizes.map((size) => ({
              color: c.name,
              colorHex: c.hex,
              size,
              sku: `${p.sku}-${c.name.slice(0, 3).toUpperCase()}-${size}`,
              stock: (p.stock as Record<string, number>)[`${c.name}|${size}`] ?? 0,
              lowStockThreshold: 5,
            }))
          ),
        },
      },
    });
  }

  const total = await prisma.product.count();
  return NextResponse.json({ ok: true, message: `Seeded ${total} products across ${CATEGORIES.length} categories.` });
}
