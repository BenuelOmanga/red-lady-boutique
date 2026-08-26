"use client";

import Link from "next/link";
import { useState } from "react";
import { useShop } from "@/lib/cart-context";

export function Header() {
  const { wishlist, cartCount, openCart } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand" onClick={() => setMenuOpen(false)}>
          <div className="brand-mark">RL</div>
          <div>
            <span className="brand-name">The Red Lady</span>
            <span className="brand-sub">BOUTIQUE</span>
          </div>
        </Link>

        <nav className="primary-nav">
          <Link href="/" className="navlink">New Arrivals</Link>
          <Link href="/?category=Dresses" className="navlink">Womenswear</Link>
          <Link href="/?category=Tailoring" className="navlink">Tailoring</Link>
          <Link href="/?category=Accessories" className="navlink">Accessories</Link>
          <Link href="/admin" className="navlink">Admin Demo</Link>
        </nav>

        <div className="header-actions">
          <Link href="/wishlist" className="iconbtn" aria-label="Wishlist" onClick={() => setMenuOpen(false)}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7.5-4.6-10-9.3C.5 8 2 4.5 5.6 4c2.1-.3 3.9.8 6.4 3.3C14.5 4.8 16.3 3.7 18.4 4c3.6.5 5.1 4 3.6 7.7C19.5 16.4 12 21 12 21z" /></svg>
            {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
          </Link>
          <button type="button" className="iconbtn" aria-label="Bag" onClick={openCart}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8h12l1 13H5L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
            {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
          </button>
          <div className="hairline-v mobile-hide-hairline" />
          <button type="button" className="iconbtn menu-toggle" aria-label="Menu" onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>
            )}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-nav">
          <Link href="/" onClick={() => setMenuOpen(false)}>New Arrivals</Link>
          <Link href="/?category=Dresses" onClick={() => setMenuOpen(false)}>Womenswear</Link>
          <Link href="/?category=Tailoring" onClick={() => setMenuOpen(false)}>Tailoring</Link>
          <Link href="/?category=Accessories" onClick={() => setMenuOpen(false)}>Accessories</Link>
          <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin Demo</Link>
        </div>
      )}
    </>
  );
}
