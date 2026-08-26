"use client";

import { useState } from "react";
import { useShop } from "@/lib/cart-context";
import { money } from "@/lib/money";
import { Silhouette } from "./Silhouette";

export function CartDrawer() {
  const { cart, cartOpen, closeCart, removeFromCart, setCartQty, cartSubtotal } = useShop();
  const [checkedOut, setCheckedOut] = useState(false);

  return (
    <>
      <div className={"scrim" + (cartOpen ? " show" : "")} onClick={closeCart} />
      <div className={"drawer" + (cartOpen ? " show" : "")} role="dialog" aria-label="Shopping bag">
        <div className="drawer-head">
          <h3 style={{ fontSize: 19, fontStyle: "italic" }}>Your Bag ({cart.reduce((n, l) => n + l.qty, 0)})</h3>
          <button type="button" className="iconbtn" aria-label="Close" onClick={closeCart}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
          </button>
        </div>
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty">Your bag is empty. Anything you add will show up here.</div>
          ) : (
            cart.map((l) => (
              <div className="cart-line" key={l.variantId}>
                <div className="cart-thumb" style={{ background: l.gradient }}>
                  <Silhouette kind={l.silhouette} width={40} height={62} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13 }}>{l.title}</p>
                  <p style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 3 }}>{l.color} · {l.size}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                    <div className="qty-stepper" style={{ transform: "scale(0.85)", transformOrigin: "left center" }}>
                      <button type="button" disabled={l.qty <= 1} onClick={() => setCartQty(l.variantId, l.qty - 1)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      </button>
                      <span>{l.qty}</span>
                      <button type="button" disabled={l.qty >= l.maxQty} onClick={() => setCartQty(l.variantId, l.qty + 1)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><line x1="12" y1="5" x2="12" y2="19" /></svg>
                      </button>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{money(l.price * l.qty)}</span>
                  </div>
                  <button type="button" className="cart-remove" onClick={() => removeFromCart(l.variantId)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="drawer-foot">
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 16 }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 500 }}>{money(cartSubtotal)}</span>
            </div>
            <button type="button" className="btn-primary" style={{ width: "100%" }} onClick={() => setCheckedOut(true)}>
              Proceed to Checkout
            </button>
            {checkedOut && (
              <p className="demo-note">
                This is a working prototype — in production, Checkout hands off to a real Stripe Checkout session.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
