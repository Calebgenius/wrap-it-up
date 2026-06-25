import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Wrap It Up",
  description: "Gift wrapping, hamper curation, corporate gifting and event packages in Kampala.",
};

const packages = [
  {
    name: "The Ribbon",
    price: "UGX 15,000 – 35,000",
    desc: "Perfect for a single gift. Premium wrapping paper, ribbon, and a gift tag.",
    includes: ["Premium wrapping paper", "Satin ribbon & bow", "Personalised gift tag", "Up to 2 items"],
  },
  {
    name: "The Bouquet",
    price: "UGX 50,000 – 120,000",
    desc: "Our most popular package. A beautifully curated hamper for any occasion.",
    includes: ["Hamper basket or box", "Curated gift items", "Tissue paper & filler", "Handwritten card", "Ribbon & finishing"],
    featured: true,
  },
  {
    name: "The Occasion",
    price: "Custom quote",
    desc: "For events, weddings, corporate gifting, and bulk orders. We handle everything.",
    includes: ["Consultation call", "Branded packaging", "Bulk pricing", "Delivery coordination", "Custom design"],
  },
];

const allServices = [
  { icon: "🎁", title: "Gift Wrapping", desc: "Single gifts, multiple gifts, odd shapes — we wrap them all beautifully using premium papers, satins, and finishing touches tailored to your style and occasion." },
  { icon: "🧺", title: "Hamper Curation", desc: "We source and assemble stunning gift hampers. Tell us your budget and occasion and we handle the rest — from food and skincare to personalised items." },
  { icon: "💌", title: "Cards & Handwritten Notes", desc: "We write your message by hand on beautiful card stock. Because a typed text is not the same as a handwritten word." },
  { icon: "🚗", title: "Pickup & Delivery", desc: "We collect from you across Kampala and deliver to your recipient, fully wrapped and ready to be received. Same-day available." },
  { icon: "🏢", title: "Corporate Gifting", desc: "Staff appreciation, client gifts, product launches — we do branded, elegant, bulk gifting for businesses of all sizes." },
  { icon: "🎉", title: "Event Packages", desc: "Full gifting solutions for weddings, introduction ceremonies, baby showers, gender reveals, and graduations. Let us make your event unforgettable." },
  { icon: "💝", title: "Surprise Deliveries", desc: "Want to make someone's day completely? We deliver surprise gift packages across Kampala with a personal touch they'll never forget." },
  { icon: "🌸", title: "Seasonal Specials", desc: "Watch out for our Christmas, Valentine's, Mother's Day, and Eid special packages — limited editions with exclusive wrapping designs." },
];

export default function ServicesPage() {
  return (
    <main className="site">

      {/* PAGE HERO */}
      <div className="page-hero">
        <p className="section-eyebrow">What we do</p>
        <h1 className="page-hero-title">Our <em>services</em></h1>
        <p className="page-hero-sub">Every service is designed with one goal — to make the person receiving the gift feel truly special.</p>
      </div>

      {/* PACKAGES */}
      <section className="section">
        <div className="section-header">
          <p className="section-eyebrow">Pricing</p>
          <h2 className="section-title">Choose your <em>package</em></h2>
        </div>
        <div className="packages-grid">
          {packages.map((pkg) => (
            <div className={`package-card ${pkg.featured ? "package-featured" : ""}`} key={pkg.name}>
              {pkg.featured && <div className="package-badge">Most popular</div>}
              <h3 className="package-name">{pkg.name}</h3>
              <p className="package-price">{pkg.price}</p>
              <p className="package-desc">{pkg.desc}</p>
              <ul className="package-includes">
                {pkg.includes.map((item) => (
                  <li key={item}>✦ {item}</li>
                ))}
              </ul>
              <a href="/#order" className={pkg.featured ? "btn-primary" : "btn-outline"} style={{ display: "block", textAlign: "center", marginTop: "1.5rem" }}>
                Order this package
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ALL SERVICES */}
      <section className="section section-alt">
        <div className="section-header">
          <p className="section-eyebrow">Everything we offer</p>
          <h2 className="section-title">Every way we can <em>help</em></h2>
        </div>
        <div className="services-grid">
          {allServices.map((s) => (
            <div className="service-card" key={s.title}>
              <div className="service-icon">{s.icon}</div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="testimonial-section" style={{ padding: "4rem 3rem" }}>
        <div className="gold-divider" />
        <p className="testimonial-quote" style={{ fontSize: "26px" }}>Not sure which service you need?</p>
        <p style={{ color: "rgba(255,255,255,0.6)", margin: "1rem 0 2rem", fontSize: "14px", letterSpacing: "0.05em" }}>
          WhatsApp us and we&apos;ll help you figure it out in minutes.
        </p>
        <a href="https://wa.me/256790084402" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ background: "#C9A96E" }}>
          Chat with us on WhatsApp
        </a>
      </div>

    </main>
  );
}