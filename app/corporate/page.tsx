"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://yqiyxvnytgddydzeoboo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXl4dm55dGdkZHlkemVvYm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzOTU1MTYsImV4cCI6MjA5Nzk3MTUxNn0.2jJ6dH1Z3IJ16mtlZDHG8J33pypjDA34MU6nS1mL9Yg"
);

const CORP_SERVICES = [
  "Staff appreciation gifts","Client gift hampers","Event giveaways",
  "Holiday packages","Branded packaging","Bulk wrapping","Other"
];

export default function CorporatePage() {
  const [form, setForm] = useState({
    company: "", name: "", phone: "", email: "",
    service: "", quantity: "", budget: "", occasion: "", notes: "",
  });
  const [status, setStatus] = useState<"idle"|"saving"|"done"|"error">("idle");

  function set(e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) {
    setForm(f => ({...f, [e.target.name]: e.target.value}));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    const { error } = await supabase.from("orders").insert([{
      customer_name: `${form.name} (${form.company})`,
      phone: form.phone,
      occasion: "Corporate — " + form.service,
      service: "Corporate gifting",
      message: `Company: ${form.company}\nEmail: ${form.email}\nQuantity: ${form.quantity}\nBudget: ${form.budget}\nNotes: ${form.notes}`,
      status: "new",
      payment_status: "unpaid",
    }]);

    const text = encodeURIComponent(
      `Hi Wrap It Up! 🏢\n\nCorporate enquiry from ${form.company}:\n- Contact: ${form.name}\n- Phone: ${form.phone}\n- Service: ${form.service}\n- Quantity: ${form.quantity}\n- Budget: ${form.budget}\n- Notes: ${form.notes}`
    );
    window.open(`https://wa.me/256700000000?text=${text}`, "_blank");
    setStatus(error ? "error" : "done");
  }

  return (
    <main className="site">
      <div className="page-hero">
        <p className="section-eyebrow">For businesses</p>
        <h1 className="page-hero-title">Corporate <em>Gifting</em></h1>
        <p className="page-hero-sub">
          Trusted by businesses across Kampala. Staff gifts, client hampers, event giveaways — done beautifully and on time.
        </p>
      </div>

      {/* WHY US */}
      <section className="section">
        <div className="section-header">
          <p className="section-eyebrow">Why Wrap It Up</p>
          <h2 className="section-title">What we offer <em>businesses</em></h2>
        </div>
        <div className="services-grid">
          {[
            { icon:"📦", title:"Bulk orders", desc:"We handle 1 gift or 1,000. Pricing gets better the more you order." },
            { icon:"🏷️", title:"Branded packaging", desc:"Your logo, your colours, your message on every package." },
            { icon:"🚗", title:"Office delivery",   desc:"We deliver directly to your office or to your clients." },
            { icon:"⚡", title:"Fast turnaround",   desc:"Same-day for urgent orders. We understand business timelines." },
            { icon:"💌", title:"Custom cards",      desc:"Personalised handwritten cards for every recipient." },
            { icon:"📊", title:"Invoicing",         desc:"Proper invoices for your accounts department." },
          ].map(f => (
            <div className="service-card" key={f.title}>
              <div className="service-icon">{f.icon}</div>
              <h3 className="service-title">{f.title}</h3>
              <p className="service-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ENQUIRY FORM */}
      <section className="section section-alt">
        <div className="section-header">
          <p className="section-eyebrow">Get a quote</p>
          <h2 className="section-title">Corporate <em>enquiry</em></h2>
        </div>
        <div style={{maxWidth:"640px",margin:"0 auto"}}>
          {status === "done" ? (
            <div style={{textAlign:"center",padding:"3rem",background:"var(--white)",border:"0.5px solid rgba(201,169,110,0.2)"}}>
              <div style={{fontSize:"48px",marginBottom:"1rem"}}>🎁</div>
              <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"28px",marginBottom:"0.75rem"}}>Enquiry received!</h3>
              <p style={{color:"var(--text-muted)",fontSize:"14px"}}>WhatsApp is open with your details. We&apos;ll respond within 2 hours with a full quote.</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{background:"var(--white)",padding:"2rem",border:"0.5px solid rgba(201,169,110,0.2)"}}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Company name *</label>
                  <input className="form-input" name="company" required value={form.company} onChange={set} placeholder="e.g. Stanbic Bank Uganda"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Your name *</label>
                  <input className="form-input" name="name" required value={form.name} onChange={set} placeholder="e.g. Sarah Nakato"/>
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp number *</label>
                  <input className="form-input" name="phone" required value={form.phone} onChange={set} placeholder="+256 ..."/>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" name="email" type="email" value={form.email} onChange={set} placeholder="sarah@company.com"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Service needed *</label>
                  <select className="form-input" name="service" required value={form.service} onChange={set}>
                    <option value="">Select...</option>
                    {CORP_SERVICES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity of gifts</label>
                  <input className="form-input" name="quantity" value={form.quantity} onChange={set} placeholder="e.g. 50 gifts"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Budget range (UGX)</label>
                  <input className="form-input" name="budget" value={form.budget} onChange={set} placeholder="e.g. 500,000 – 1,000,000"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Occasion / Event</label>
                  <input className="form-input" name="occasion" value={form.occasion} onChange={set} placeholder="e.g. End of year staff party"/>
                </div>
                <div className="form-group full">
                  <label className="form-label">Additional details</label>
                  <textarea className="form-input" name="notes" value={form.notes} onChange={set}
                    placeholder="Branding requirements, delivery location, timeline, any special requests..."/>
                </div>
              </div>
              <button type="submit" className="form-submit" disabled={status==="saving"} style={{marginTop:"1.5rem"}}>
                {status==="saving" ? "Sending..." : "Send corporate enquiry ✦"}
              </button>
            </form>
          )}
        </div>
      </section>

    </main>
  );
}