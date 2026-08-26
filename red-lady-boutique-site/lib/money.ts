export function money(amount: number | string): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return "$" + value.toLocaleString("en-US");
}

export function stockLevel(qty: number): "out" | "low" | "ok" {
  if (qty <= 0) return "out";
  if (qty <= 3) return "low";
  return "ok";
}
