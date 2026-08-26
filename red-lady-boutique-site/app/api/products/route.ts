import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Small read-only endpoint the wishlist page uses to turn the slugs it kept
// in localStorage back into full product cards.
export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(
    products.map((p) => ({
      slug: p.slug,
      title: p.title,
      price: p.price.toNumber(),
      compareAtPrice: p.compareAtPrice ? p.compareAtPrice.toNumber() : null,
      tag: p.tag,
      ratingAvg: p.ratingAvg,
      soldLabel: p.soldLabel,
      gradient: p.gradient,
      silhouette: p.silhouette,
    }))
  );
}
