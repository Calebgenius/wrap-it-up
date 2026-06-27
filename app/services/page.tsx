import type { Metadata } from "next";
import PriceCalculator from "../../components/PriceCalculator";

export const metadata: Metadata = {
  title: "Services & Pricing — Wrap It Up",
  description: "Professional gift wrapping, hampers, school packages and corporate gifting in Kampala.",
};

const wrappingSizes = [
  { size: "Small",   price: "3,000 – 5,000",   desc: "Small boxes, envelopes, tiny gifts", icon: "🎀" },
  { size: "Medium",  price: "5,000 – 10,000",  desc: "Standard gift boxes, books, clothing", icon: "🎁" },
  { size: "Large",   price: "10,000 – 20,000", desc: "Large boxes, appliances, big items", icon: "📦" },
  { size: "Premium", price: "15,000 – 50,000", desc: "Luxury paper, flowers, ribbons, full styling", icon: "✨" },
];

const addons = [
  { name: "Handwritten card",        price: "+2,000",  icon: "💌" },
  { name: "Decorative ribbon & bow", price: "+2,000",  icon: "🎀" },
  { name: "Artificial flowers",      price: "+5,000",  icon: "🌸" },
  { name: "Photo packaging",         price: "+10,000", icon: "📸" },
  { name: "Name printing",           price: "+5,000",  icon: "🖨️" },
  { name: "Motivational sticker",    price: "+1,000",  icon: "⭐" },
  { name: "Theme-based design",      price: "+10,000", icon: "🎨" },
  { name: "Gift bag upgrade",        price: "+3,000",  icon: "🛍️" },
];

const hampers = [
  { type: "Birthday Hamper",   price: "50,000 – 150,000",   items: "Cake, chocolates, balloons, perfume, custom wrap", icon: "🎂" },
  { type: "Baby Shower",       price: "80,000 – 200,000",   items: "Baby items, clothing, diapers, cream, themed wrap", icon: "👶" },
  { type: "Wedding Hamper",    price: "100,000 – 300,000+", items: "Wine, chocolates, couple items, luxury wrap", icon: "💍" },
  { type: "Corporate Hamper",  price: "80,000 – 500,000+",  items: "Branded items, premium packaging, bulk available", icon: "🏢" },
];

const schoolPackages = [
  { name: "Basic School Pack",   price: "2,000 – 3,000 / book", items: "Wrapping paper + personalised label per book", featured: false },
  { name: "Premium School Pack", price: "3,000 – 5,000 / book", items: "Sticky back plastic + custom label + motivational sticker", featured: true },
  { name: "Full Decoration",     price: "20,000 – 50,000",      items: "All books + bag decoration + full sticker set + name printing", featured: false },
];

const corporate = [
  { service: "Staff Appreciation",  desc: "Branded wrapped gifts for your team. Bulk pricing available.", price: "From UGX 30,000/gift", icon: "👔" },
  { service: "Client Gift Hampers", desc: "Premium hampers for your best clients with custom branding.", price: "From UGX 80,000",       icon: "🤝" },
  { service: "Event Giveaways",     desc: "Themed wrapped gifts for launches, parties and corporate events.", price: "Custom quote",     icon: "🎉" },
  { service: "Holiday Packages",    desc: "Christmas, Eid, New Year bulk gifting for your company.",          price: "Custom quote",     icon: "🎄" },
];

export default function ServicesPage() {
  return (
    <main className="site">

      <div className="page-hero">
        <p className="section-eyebrow">Everything we offer</p>
        <h1 className="page-hero-title">Services & <em>Pricing</em></h1>
        <p className="page-hero-sub">From a single wrapped gift to full corporate hamper programmes — beautifully done.</p>
      </div>

      {/* WRAPPING SIZES */}
      <section className="section">
        <div className="section-header">
          <p className="section-eyebrow">Gift wrapping</p>
          <h2 className="section-title">Choose your <em>size</em></h2>
        </div>
        <div className="services-grid" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
          {wrappingSizes.map(s => (
            <div className="service-card" key={s.size}>
              <div className="service-icon">{s.icon}</div>
              <h3 className="service-title">{s.size}</h3>
              <p className="service-desc">{s.desc}</p>
              <p className="service-price">UGX {s.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ADD-ONS */}
      <section className="section section-alt">
        <div className="section-header">
          <p className="section-eyebrow">Make it special</p>
          <h2 className="section-title">Add-<em>ons</em></h2>
          <p style={{marginTop:"0.75rem",color:"var(--text-muted)",fontSize:"14px"}}>Add any of these to any wrap</p>
        </div>
        <div className="services-grid">
          {addons.map(a => (
            <div className="service-card" key={a.name} style={{padding:"1.5rem"}}>
              <div className="service-icon" style={{fontSize:"22px"}}>{a.icon}</div>
              <h3 className="service-title" style={{fontSize:"16px"}}>{a.name}</h3>
              <p className="service-price">{a.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICE CALCULATOR */}
      <section className="section">
        <div className="section-header">
          <p className="section-eyebrow">Instant estimate</p>
          <h2 className="section-title">Price <em>calculator</em></h2>
          <p style={{marginTop:"0.75rem",color:"var(--text-muted)",fontSize:"14px"}}>
            Pick your size, add-ons and delivery zone — get an instant quote
          </p>
        </div>
        <div style={{maxWidth:"620px",margin:"0 auto"}}>
          <PriceCalculator />
        </div>
      </section>

      {/* HAMPERS */}
      <section className="section section-alt">
        <div className="section-header">
          <p className="section-eyebrow">Gift hampers</p>
          <h2 className="section-title">Curated with <em>love</em></h2>
        </div>
        <div className="services-grid" style={{gridTemplateColumns:"repeat(2,1fr)"}}>
          {hampers.map(h => (
            <div className="service-card" key={h.type}>
              <div className="service-icon">{h.icon}</div>
              <h3 className="service-title">{h.type}</h3>
              <p className="service-desc">{h.items}</p>
              <p className="service-price">UGX {h.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SCHOOL PACKAGES */}
      <section className="section">
        <div className="section-header">
          <p className="section-eyebrow">Back to school</p>
          <h2 className="section-title">School <em>packages</em></h2>
          <p style={{marginTop:"0.75rem",color:"var(--text-muted)",fontSize:"14px"}}>
            Make school exciting — books, bags, personalised labels, motivational stickers
          </p>
        </div>
        <div className="packages-grid">
          {schoolPackages.map((p) => (
            <div className={`package-card ${p.featured?"package-featured":""}`} key={p.name}>
              {p.featured && <div className="package-badge">Most popular</div>}
              <h3 className="package-name">{p.name}</h3>
              <p className="package-price">{p.price}</p>
              <p className="package-desc">{p.items}</p>
              <a href="/#order" className={p.featured?"btn-primary":"btn-outline"}
                style={{display:"block",textAlign:"center",marginTop:"1.5rem",padding:"0.75rem"}}>
                Order this package
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* MOBILE WRAPPING */}
      <div className="testimonial-section" style={{padding:"4rem 3rem"}}>
        <div className="gold-divider"/>
        <p className="testimonial-quote" style={{fontSize:"26px"}}>
          📍 Mobile Wrapping Service
        </p>
        <p style={{color:"rgba(255,255,255,0.6)",margin:"1rem 0 0.5rem",fontSize:"15px"}}>
          We come to you — at home, at your office, at your event.
        </p>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:"13px",marginBottom:"2rem"}}>
          Home service fee: UGX 10,000 – 30,000 depending on location
        </p>
        <a href="/#order" className="btn-primary" style={{background:"#C9A96E"}}>
          Book mobile service
        </a>
      </div>

      {/* CORPORATE */}
      <section className="section section-alt" id="corporate">
        <div className="section-header">
          <p className="section-eyebrow">For businesses</p>
          <h2 className="section-title">Corporate <em>gifting</em></h2>
          <p style={{marginTop:"0.75rem",color:"var(--text-muted)",fontSize:"14px"}}>
            Trusted by businesses across Kampala for staff appreciation, client gifts and events
          </p>
        </div>
        <div className="services-grid" style={{gridTemplateColumns:"repeat(2,1fr)"}}>
          {corporate.map(c => (
            <div className="service-card" key={c.service}>
              <div className="service-icon">{c.icon}</div>
              <h3 className="service-title">{c.service}</h3>
              <p className="service-desc">{c.desc}</p>
              <p className="service-price">{c.price}</p>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:"2.5rem"}}>
          <a href="/corporate" className="btn-primary">Get a corporate quote</a>
        </div>
      </section>

    </main>
  );
}