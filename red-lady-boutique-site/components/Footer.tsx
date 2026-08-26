import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap foot-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--gold-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 13, color: "var(--cream)" }}>RL</div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: 18, color: "var(--cream)" }}>The Red Lady</span>
          </div>
          <p style={{ fontSize: 12, color: "rgba(248,242,233,0.55)", lineHeight: 1.7, marginTop: 15, maxWidth: 260 }}>
            Considered fashion, designed in-house and finished by hand in small batches since 2014.
          </p>
        </div>
        <div>
          <p className="foot-label">SHOP</p>
          <Link className="footlink" href="/">New Arrivals</Link>
          <Link className="footlink" href="/">Best Sellers</Link>
          <Link className="footlink" href="/admin">Admin Demo</Link>
        </div>
        <div>
          <p className="foot-label">CLIENT CARE</p>
          <a className="footlink" href="#">Contact Us</a>
          <a className="footlink" href="#">Shipping &amp; Returns</a>
          <a className="footlink" href="#">Size Guide</a>
        </div>
        <div>
          <p className="foot-label">STAY IN THE LOOP</p>
          <div style={{ display: "flex", borderBottom: "1px solid rgba(248,242,233,0.3)", paddingBottom: 9 }}>
            <span style={{ fontSize: 13, color: "rgba(248,242,233,0.4)", flex: 1 }}>Your email address</span>
          </div>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 The Red Lady Boutique. All rights reserved.</span>
        <span>Privacy &nbsp;·&nbsp; Terms</span>
      </div>
    </footer>
  );
}
