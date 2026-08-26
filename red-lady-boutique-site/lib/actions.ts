"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Re-checks real stock in the database before an item is trusted client-side.
 * The cart itself lives in the browser (localStorage) — this is the one
 * moment it touches the real database.
 */
export async function checkVariantStock(variantId: string, qty: number) {
  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) return { ok: false as const, reason: "This item is no longer available." };
  if (variant.stock < qty) {
    return {
      ok: false as const,
      reason: variant.stock === 0 ? "That size/color just sold out." : `Only ${variant.stock} left in this size/color.`,
    };
  }
  return { ok: true as const };
}

/** Admin: adjust one variant's real stock in the database. Used by the +/- controls. */
export async function adjustVariantStock(variantId: string, delta: number) {
  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) return;
  const next = Math.max(0, variant.stock + delta);
  await prisma.productVariant.update({ where: { id: variantId }, data: { stock: next } });
  revalidatePath("/admin");
  revalidatePath("/");
}

/** Admin: toggle whether a product is force-pinned to the homepage. */
export async function togglePin(productId: string, next: boolean) {
  await prisma.product.update({ where: { id: productId }, data: { isPinned: next } });
  revalidatePath("/admin");
  revalidatePath("/");
}
