import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Wrap It Up",
  description: "The story behind Wrap It Up, Kampala's premium gift wrapping service.",
};

const values = [
  { icon: "✨", title: "Attention to detail", desc: "Every fold, every ribbon, every tag is placed with intention. We don't rush beauty." },
  { icon: "💛", title: "Made with love", desc: "We treat every gift as if we're wrapping it for our own family. Because that's how it should feel." },
  { icon: "🌍", title: "Proudly Ugandan", desc: "Born in Kampala, made for Kampala. We understand local occasions, culture, and what makes gifting here special." },
  { icon: "⚡", title: "Fast & reliable", desc: "Same-day wrapping and delivery available. We know occasions don't wait." },
];

export default function AboutPage() {
  return (
    <main className="site">

      <div className="page-hero">
        <p className="section-eyebrow">Our story</p>
        <h1 className="page-hero-title">About <em>us</em></h1>
      </div>

      {/* STORY */}
      <section className="section">
        <div className="about-story">
          <div className="about-text">
            <p className="section-eyebrow">How it started</p>
            <h2 className="section-title" style={{ textAlign: "left", fontSize: "36px", marginBottom: "1.5rem" }}>
              Two sisters, one <em>beautiful idea</em>
            </h2>
            <p className="about-para">
              Wrap It Up was born from a simple belief — that the way a gift looks on the outside
              says just as much as what&apos;s inside. We started wrapping gifts for family, then friends,
              then friends of friends, and before we knew it, people were calling us for every occasion
              in their lives.
            </p>
            <p className="about-para">
              Based in Kampala, we bring a premium wrapping experience to Uganda — using carefully
              sourced papers, ribbons, and materials to create gifts that people are almost afraid to open.
              Almost.
            </p>
            <p className="about-para">
              Whether it&apos;s a birthday, a wedding, a baby shower, or just a Tuesday when you want
              to make someone smile — we&apos;re here for it.
            </p>
          </div>
          <div className="about-visual">
            <div className="about-img-placeholder">
              <span style={{ fontSize: "64px" }}>🎀</span>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "1rem" }}>
                Add a team photo here
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section section-alt">
        <div className="section-header">
          <p className="section-eyebrow">What we stand for</p>
          <h2 className="section-title">Our <em>values</em></h2>
        </div>
        <div className="values-grid">
          {values.map((v) => (
            <div className="value-card" key={v.title}>
              <div className="value-icon">{v.icon}</div>
              <h3 className="value-title">{v.title}</h3>
              <p className="value-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="testimonial-section" style={{ padding: "4rem 3rem" }}>
        <div className="gold-divider" />
        <p className="testimonial-quote" style={{ fontSize: "26px" }}>
          Ready to work with us?
        </p>
        <p style={{ color: "rgba(255,255,255,0.6)", margin: "1rem 0 2rem", fontSize: "14px" }}>
          Place your first order today — we promise it will be beautiful.
        </p>
        <a href="/#order" className="btn-primary" style={{ background: "#C9A96E" }}>
          Get started
        </a>
      </div>

    </main>
  );
}