import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetail } from "./ProductDetail";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug }, select: { title: true, description: true } });
  if (!product) return {};
  return { title: `${product.title} · The Red Lady Boutique`, description: product.description.slice(0, 160) };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true, variants: { orderBy: [{ color: "asc" }, { size: "asc" }] } },
  });
  if (!product) notFound();

  const others = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    take: 4,
  });

  const serialized = {
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    price: product.price.toNumber(),
    compareAtPrice: product.compareAtPrice ? product.compareAtPrice.toNumber() : null,
    category: product.category.name,
    tag: product.tag,
    ratingAvg: product.ratingAvg,
    ratingCount: product.ratingCount,
    soldLabel: product.soldLabel,
    materials: product.materials,
    sizingFit: product.sizingFit,
    care: product.care,
    gradient: product.gradient,
    silhouette: product.silhouette,
    variants: product.variants.map((v) => ({
      id: v.id,
      color: v.color,
      colorHex: v.colorHex,
      size: v.size,
      stock: v.stock,
      lowStockThreshold: v.lowStockThreshold,
    })),
  };

  const otherCards = others.map((p) => ({
    slug: p.slug,
    title: p.title,
    price: p.price.toNumber(),
    compareAtPrice: p.compareAtPrice ? p.compareAtPrice.toNumber() : null,
    tag: p.tag,
    ratingAvg: p.ratingAvg,
    soldLabel: p.soldLabel,
    gradient: p.gradient,
    silhouette: p.silhouette,
  }));

  return (
    <main>
      <ProductDetail product={serialized} others={otherCards} />
      <Footer />
    </main>
  );
}
