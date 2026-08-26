"use client";

import { useState, useTransition } from "react";
import { adjustVariantStock, togglePin } from "@/lib/actions";
import { money, stockLevel } from "@/lib/money";

type Row = {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  gradient: string;
  isPinned: boolean;
  primaryVariantId: string | null;
  primaryColor: string | null;
  primarySize: string | null;
  primaryStock: number;
  primaryThreshold: number;
  variantCount: number;
};

export function AdminTable({ rows: initialRows }: { rows: Row[] }) {
  const [rows, setRows] = useState(initialRows);
  const [isPending, startTransition] = useTransition();

  function adjust(row: Row, delta: number) {
    if (!row.primaryVariantId) return;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, primaryStock: Math.max(0, r.primaryStock + delta) } : r)));
    startTransition(() => {
      adjustVariantStock(row.primaryVariantId as string, delta);
    });
  }

  function pin(row: Row, next: boolean) {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, isPinned: next } : r)));
    startTransition(() => {
      togglePin(row.id, next);
    });
  }

  return (
    <div className="table-scroll">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Homepage Pin</th>
          </tr>
        </thead>
        <tbody style={{ opacity: isPending ? 0.7 : 1 }}>
          {rows.map((row) => {
            const level = stockLevel(row.primaryStock);
            const badgeStyle =
              level === "out"
                ? { background: "var(--danger-bg)", color: "var(--burgundy)" }
                : level === "low"
                ? { background: "var(--warn-bg)", color: "var(--warn)" }
                : { background: "var(--ok-bg)", color: "var(--ok)" };
            const badgeLabel = level === "out" ? "Out of stock" : level === "low" ? `Low · ${row.primaryStock} left` : `${row.primaryStock} in stock`;

            return (
              <tr key={row.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 4, background: row.gradient, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 500 }}>{row.title}</p>
                      <p style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>
                        {row.primaryColor} / {row.primarySize}
                        {row.variantCount > 1 ? ` · +${row.variantCount - 1} more` : ""}
                      </p>
                    </div>
                  </div>
                </td>
                <td style={{ color: "var(--ink-soft)" }}>{row.category}</td>
                <td style={{ fontWeight: 500 }}>{money(row.price)}.00</td>
                <td>
                  <div className="stepper-sm">
                    <button type="button" disabled={row.primaryStock <= 0} onClick={() => adjust(row, -1)} aria-label="Decrease stock">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                    <span className="stock-badge" style={badgeStyle}>{badgeLabel}</span>
                    <button type="button" onClick={() => adjust(row, 1)} aria-label="Increase stock">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><line x1="12" y1="5" x2="12" y2="19" /></svg>
                    </button>
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => pin(row, !row.isPinned)}
                    aria-label="Pin to homepage"
                    style={{
                      width: 30,
                      height: 17,
                      borderRadius: 9,
                      position: "relative",
                      flexShrink: 0,
                      background: row.isPinned ? "var(--burgundy)" : "var(--stone-dark)",
                    }}
                  >
                    <span
                      style={{
                        width: 13,
                        height: 13,
                        borderRadius: "50%",
                        background: "#fff",
                        position: "absolute",
                        top: 2,
                        left: row.isPinned ? 15 : 2,
                        transition: "left .15s ease",
                      }}
                    />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
