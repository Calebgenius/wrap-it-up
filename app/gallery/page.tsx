import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery — Wrap It Up",
  description: "See our gift wrapping work. Beautiful wraps, hampers, and event packages from Kampala.",
};

const placeholders = [
  { cls: "g1", label: "Birthday wrap", size: "tall" },
  { cls: "g2", label: "Hamper" },
  { cls: "g3", label: "Wedding gift" },
  { cls: "g4", label: "Baby shower" },
  { cls: "g5", label: "Corporate" },
  { cls: "g1", label: "Valentine's" },
  { cls: "g3", label: "Anniversary" },
  { cls: "g2", label: "Graduation" },
  { cls: "g4", label: "Event wrap" },
];

export default function GalleryPage() {
  return (
    <main className="site">

      <div className="page-hero">
        <p className="section-eyebrow">Our work</p>
        <h1 className="page-hero-title">The <em>gallery</em></h1>
        <p className="page-hero-sub">Every wrap tells a story. Here are some of ours.</p>
      </div>

      {/* INSTAGRAM CTA */}
      <div style={{ background: "var(--section-bg)", padding: "2rem 3rem", textAlign: "center", borderBottom: "0.5px solid rgba(201,169,110,0.2)" }}>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
          Follow us on Instagram for daily wrapping inspiration →{" "}
          <a href="https://instagram.com/wrapitup.ug" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: 500 }}>
            @wrapitup.ug
          </a>
        </p>
      </div>

      {/* GALLERY MASONRY */}
      <section className="section">
        <div className="gallery-full-grid">
          {placeholders.map((item, i) => (
            <div
              className={`gallery-item ${item.cls} ${item.size === "tall" ? "tall" : ""}`}
              key={i}
            >
              <div className="gallery-placeholder">
                <span style={{ fontSize: "24px", marginBottom: "0.5rem" }}>🎁</span>
                <span className="gallery-label">{item.label}</span>
                <span className="gallery-label" style={{ opacity: 0.4, fontSize: "10px", marginTop: "4px" }}>
                  Drop photo in public/gallery/
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ORDER CTA */}
      <div className="testimonial-section" style={{ padding: "4rem 3rem" }}>
        <div className="gold-divider" />
        <p className="testimonial-quote" style={{ fontSize: "26px" }}>Love what you see?</p>
        <p style={{ color: "rgba(255,255,255,0.6)", margin: "1rem 0 2rem", fontSize: "14px" }}>
          Let us wrap something beautiful for you.
        </p>
        <a href="/#order" className="btn-primary" style={{ background: "#C9A96E" }}>
          Place an order
        </a>
      </div>

    </main>
  );
}