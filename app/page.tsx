"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://yqiyxvnytgddydzeoboo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXl4dm55dGdkZHlkemVvYm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzOTU1MTYsImV4cCI6MjA5Nzk3MTUxNn0.2jJ6dH1Z3IJ16mtlZDHG8J33pypjDA34MU6nS1mL9Yg"
);

const services = [
  { icon: "🎁", title: "Gift Wrapping", desc: "Elegant wrapping using premium papers, ribbons, and finishing touches. From birthday boxes to wedding gifts — every detail matters.", price: "From UGX 15,000" },
  { icon: "🧺", title: "Hamper Curation", desc: "We source, style, and assemble beautiful gift hampers for any occasion. Corporate gifting, baby showers, anniversaries and more.", price: "From UGX 50,000" },
  { icon: "💌", title: "Cards & Messages", desc: "Personalised handwritten cards and custom gift tags. Because words matter as much as the wrapping does.", price: "From UGX 5,000" },
  { icon: "🚗", title: "Pickup & Delivery", desc: "We pick up your gifts, wrap them beautifully, and deliver to your recipient — all without you lifting a finger.", price: "From UGX 10,000" },
  { icon: "🏢", title: "Corporate Gifting", desc: "Branded, bulk gifting solutions for businesses. Staff appreciation, client gifts, and product launches done right.", price: "Custom pricing" },
  { icon: "🎉", title: "Event Packages", desc: "Full-service gifting for weddings, graduations, gender reveals, and milestone celebrations.", price: "Custom pricing" },
];

const steps = [
  { num: "01", title: "Place your order", desc: "Fill in our form or WhatsApp us. Tell us the occasion, gift size, and style you love." },
  { num: "02", title: "We pick it up", desc: "We collect your gift anywhere in Kampala, or you drop it off to us." },
  { num: "03", title: "We wrap it beautifully", desc: "Our team wraps with premium materials and includes your personal card message." },
  { num: "04", title: "Delivered with love", desc: "We deliver to your recipient — or back to you — ready to make someone smile." },
];

export default function Home() {
  const [form, setForm] = useState({ name: "", phone: "", occasion: "", service: "", message: "" });
  const [status, setStatus] = useState<"idle"|"saving"|"done"|"error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");

    // 1. Save to Supabase
    const { error } = await supabase.from("orders").insert([{
      customer_name: form.name,
      phone: form.phone,
      occasion: form.occasion,
      service: form.service,
      message: form.message,
      status: "new",
    }]);

    // 2. Also upsert customer record
    if (!error) {
      await supabase.from("customers").upsert(
        [{ name: form.name, phone: form.phone }],
        { onConflict: "phone", ignoreDuplicates: false }
      );
    }

    // 3. Open WhatsApp with pre-filled message
    const text = encodeURIComponent(
      `Hi Wrap It Up! 🎁\n\nName: ${form.name}\nPhone: ${form.phone}\nOccasion: ${form.occasion}\nService: ${form.service}\nDetails: ${form.message}`
    );
    window.open(`https://wa.me/256700000000?text=${text}`, "_blank");

    setStatus(error ? "error" : "done");
  }

  return (
    <main className="site">

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <p className="hero-eyebrow">Kampala&apos;s premium gift wrapping</p>
          <h1 className="hero-title">Every gift<br />deserves to be<br /><em>beautiful</em></h1>
          <p className="hero-sub">Professional gift wrapping, hamper curation, and delivery across Kampala. Because the outside of a gift tells the story before the inside does.</p>
          <div className="hero-actions">
            <a href="#order" className="btn-primary">Order a wrap</a>
            <a href="#services" className="btn-outline">See services</a>
          </div>
        </div>
        <div className="hero-visual">
          <svg className="gift-box-svg" viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="60" y="160" width="220" height="150" rx="3" fill="#C9A96E" fillOpacity="0.12"/>
            <rect x="60" y="160" width="220" height="150" rx="3" stroke="#C9A96E" strokeWidth="1.5"/>
            <rect x="50" y="138" width="240" height="30" rx="3" fill="#C9A96E" fillOpacity="0.18"/>
            <rect x="50" y="138" width="240" height="30" rx="3" stroke="#C9A96E" strokeWidth="1.5"/>
            <rect x="157" y="138" width="26" height="172" fill="#C9A96E" fillOpacity="0.3"/>
            <rect x="50" y="147" width="240" height="12" fill="#C9A96E" fillOpacity="0.3"/>
            <path d="M130 138 Q95 100 105 75 Q115 55 140 70 Q160 82 170 105" stroke="#C9A96E" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M210 138 Q245 100 235 75 Q225 55 200 70 Q180 82 170 105" stroke="#C9A96E" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M165 112 Q145 125 130 145" stroke="#C9A96E" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M175 112 Q195 125 210 145" stroke="#C9A96E" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <circle cx="170" cy="112" r="7" fill="#C9A96E"/>
          </svg>
        </div>
      </section>

      {/* TAGLINE BAR */}
      <div className="tagline-bar">
        <span className="tagline-item">Beautifully wrapped</span>
        <span className="tagline-sep">✦</span>
        <span className="tagline-item">Thoughtfully given</span>
        <span className="tagline-sep">✦</span>
        <span className="tagline-item">Same day delivery</span>
        <span className="tagline-sep">✦</span>
        <span className="tagline-item">Across Kampala</span>
      </div>

      {/* SERVICES */}
      <section className="section" id="services">
        <div className="section-header">
          <p className="section-eyebrow">What we offer</p>
          <h2 className="section-title">Services crafted with <em>care</em></h2>
        </div>
        <div className="services-grid">
          {services.map((s) => (
            <div className="service-card" key={s.title}>
              <div className="service-icon">{s.icon}</div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
              <p className="service-price">{s.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="section section-alt" id="gallery">
        <div className="section-header">
          <p className="section-eyebrow">Our work</p>
          <h2 className="section-title">The <em>gallery</em></h2>
        </div>
        <div className="gallery-grid">
          <div className="gallery-item tall g1"><div className="gallery-placeholder"><span className="gallery-label">Your best wrap photo</span></div></div>
          <div className="gallery-item g2"><div className="gallery-placeholder"><span className="gallery-label">Photo</span></div></div>
          <div className="gallery-item g3"><div className="gallery-placeholder"><span className="gallery-label">Photo</span></div></div>
          <div className="gallery-item g4"><div className="gallery-placeholder"><span className="gallery-label">Photo</span></div></div>
          <div className="gallery-item g5"><div className="gallery-placeholder"><span className="gallery-label">Photo</span></div></div>
        </div>
        <div style={{ textAlign:"center", marginTop:"2.5rem" }}>
          <a href="/gallery" className="btn-outline">View full gallery</a>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how-it-works">
        <div className="section-header">
          <p className="section-eyebrow">The process</p>
          <h2 className="section-title">Simple as <em>one, two, three</em></h2>
        </div>
        <div className="process-steps">
          {steps.map((step) => (
            <div className="process-step" key={step.num}>
              <div className="step-num">{step.num}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <div className="testimonial-section">
        <div className="gold-divider" />
        <p className="testimonial-quote">&ldquo;I sent my mum a birthday gift and cried when I saw the photos. It was the most beautiful wrapping I had ever seen.&rdquo;</p>
        <p className="testimonial-author">— Aisha M., Kampala</p>
      </div>

      {/* ORDER FORM */}
      <section className="order-section" id="order">
        <div className="order-inner">
          <div className="order-info">
            <h2 className="order-tagline">Ready to make<br />someone feel <em>special?</em></h2>
            <p className="order-note">Fill in the form and we&apos;ll save your order and open WhatsApp so we can confirm everything with you within the hour.</p>
            <div className="contact-details">
              <div className="contact-item">📱 <span>+256 700 000 000</span></div>
              <div className="contact-item">✉️ <span>hello@wrapitup.ug</span></div>
              <div className="contact-item">📍 <span>Kampala, Uganda</span></div>
              <div className="contact-item">📸 <span>@wrapitup.ug</span></div>
            </div>
          </div>

          {status === "done" || status === "error" ? (
            <div className="sent-message">
              <div className="sent-icon">{status === "done" ? "🎁" : "⚠️"}</div>
              <h3>{status === "done" ? "Order received!" : "Something went wrong"}</h3>
              <p>{status === "done"
                ? "Your order is saved and WhatsApp is open. We\u2019ll confirm shortly!"
                : "Please try again or WhatsApp us directly."}</p>
              <button className="form-submit" style={{marginTop:"1.5rem"}} onClick={() => setStatus("idle")}>
                {status === "done" ? "Place another order" : "Try again"}
              </button>
            </div>
          ) : (
            <form className="order-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Your name</label>
                <input className="form-input" name="name" type="text" placeholder="e.g. Amara Nakato" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp number</label>
                <input className="form-input" name="phone" type="tel" placeholder="+256 ..." value={form.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Occasion</label>
                <select className="form-input" name="occasion" value={form.occasion} onChange={handleChange} required>
                  <option value="">Select occasion...</option>
                  <option>Birthday</option>
                  <option>Anniversary</option>
                  <option>Wedding / Introduction</option>
                  <option>Baby shower</option>
                  <option>Graduation</option>
                  <option>Corporate gift</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Service needed</label>
                <select className="form-input" name="service" value={form.service} onChange={handleChange} required>
                  <option value="">Select service...</option>
                  <option>Gift wrapping only</option>
                  <option>Wrapping + delivery</option>
                  <option>Hamper curation</option>
                  <option>Full event package</option>
                  <option>Corporate gifting</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tell us more</label>
                <textarea className="form-input" name="message" placeholder="Gift size, preferred colours, special requests..." value={form.message} onChange={handleChange} />
              </div>
              <button type="submit" className="form-submit" disabled={status === "saving"}>
                {status === "saving" ? "Saving..." : "Send enquiry via WhatsApp ✦"}
              </button>
            </form>
          )}
        </div>
      </section>

    </main>
  );
}