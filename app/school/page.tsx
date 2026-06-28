"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://yqiyxvnytgddydzeoboo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXl4dm55dGdkZHlkemVvYm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzOTU1MTYsImV4cCI6MjA5Nzk3MTUxNn0.2jJ6dH1Z3IJ16mtlZDHG8J33pypjDA34MU6nS1mL9Yg"
);

const PACKAGES = [
  { id: "basic",   name: "Basic Pack",   price: 2000, desc: "Wrapping paper + personalised label per book" },
  { id: "premium", name: "Premium Pack", price: 4000, desc: "Sticky back plastic + custom label + motivational sticker" },
  { id: "full",    name: "Full Deco",    price: 35000, desc: "All books + bag + name printing + full sticker set", flat: true },
];

const ADDONS = [
  { name: "Name printing on bag",     price: 5000 },
  { name: "Motivational stickers set", price: 3000 },
  { name: "Custom label design",       price: 5000 },
  { name: "School bag decoration",     price: 10000 },
];

export default function SchoolPage() {
  const [pkg, setPkg]         = useState("premium");
  const [books, setBooks]     = useState(5);
  const [addons, setAddons]   = useState<string[]>([]);
  const [form, setForm]       = useState({ name:"", phone:"", school:"", notes:"" });
  const [status, setStatus]   = useState<"idle"|"saving"|"done">("idle");

  const selectedPkg = PACKAGES.find(p => p.id === pkg)!;
  const addonTotal  = addons.reduce((s, a) => {
    const found = ADDONS.find(x => x.name === a);
    return s + (found?.price || 0);
  }, 0);
  const bookTotal   = selectedPkg.flat ? selectedPkg.price : selectedPkg.price * books;
  const total       = bookTotal + addonTotal;

  function toggleAddon(name: string) {
    setAddons(a => a.includes(name) ? a.filter(x => x !== name) : [...a, name]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    await supabase.from("orders").insert([{
      customer_name: form.name,
      phone: form.phone,
      occasion: "Back to School",
      service: `School Package — ${selectedPkg.name}`,
      message: `School: ${form.school}\nBooks: ${books}\nAdd-ons: ${addons.join(", ") || "None"}\nNotes: ${form.notes}`,
      estimated_price: total,
      status: "new",
      payment_status: "unpaid",
    }]);
    const text = encodeURIComponent(
      `Hi Wrap It Up! 📚\n\nSchool Package Order:\n- Package: ${selectedPkg.name}\n- Books: ${books}\n- Add-ons: ${addons.join(", ") || "None"}\n- School: ${form.school}\n- Estimated total: UGX ${total.toLocaleString()}\n- Notes: ${form.notes}\n\nName: ${form.name}\nPhone: ${form.phone}`
    );
    window.open(`https://wa.me/256750016270?text=${text}`, "_blank");
    setStatus("done");
  }

  return (
    <main className="site">
      <div className="page-hero">
        <p className="section-eyebrow">Back to school</p>
        <h1 className="page-hero-title">School <em>packages</em></h1>
        <p className="page-hero-sub">Make the new school term exciting — beautifully wrapped books, personalised labels, motivational stickers and more.</p>
      </div>

      <section className="section">
        <div style={{maxWidth:"680px",margin:"0 auto"}}>

          {status === "done" ? (
            <div style={{textAlign:"center",padding:"3rem",background:"var(--white)",border:"0.5px solid rgba(201,169,110,0.2)"}}>
              <div style={{fontSize:"48px",marginBottom:"1rem"}}>📚</div>
              <h2 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"28px",marginBottom:"0.75rem"}}>Order received!</h2>
              <p style={{color:"var(--text-muted)",fontSize:"14px",marginBottom:"1.5rem"}}>WhatsApp is open with your details. We'll confirm and schedule your school package shortly!</p>
              <button className="form-submit" style={{width:"auto",padding:"0.75rem 2rem"}} onClick={() => setStatus("idle")}>
                Place another order
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>

              {/* STEP 1 - PACKAGE */}
              <div style={{background:"var(--white)",border:"0.5px solid rgba(201,169,110,0.2)",padding:"2rem",marginBottom:"1rem"}}>
                <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"22px",marginBottom:"1.5rem",color:"var(--dark)"}}>
                  1. Choose your package
                </h3>
                <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
                  {PACKAGES.map(p => (
                    <button type="button" key={p.id}
                      onClick={() => setPkg(p.id)}
                      style={{
                        border: pkg===p.id ? "1.5px solid var(--dark)" : "0.5px solid rgba(201,169,110,0.3)",
                        background: pkg===p.id ? "var(--dark)" : "transparent",
                        padding:"1rem 1.25rem",cursor:"pointer",textAlign:"left",
                        display:"flex",justifyContent:"space-between",alignItems:"center",
                      }}>
                      <div>
                        <div style={{fontSize:"14px",fontWeight:500,color:pkg===p.id?"var(--gold)":"var(--dark)"}}>{p.name}</div>
                        <div style={{fontSize:"12px",color:pkg===p.id?"rgba(255,255,255,0.6)":"var(--text-muted)",marginTop:"3px"}}>{p.desc}</div>
                      </div>
                      <div style={{fontSize:"13px",color:"var(--gold)",fontWeight:500,whiteSpace:"nowrap",marginLeft:"1rem"}}>
                        {p.flat ? `UGX ${p.price.toLocaleString()}` : `UGX ${p.price.toLocaleString()}/book`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 2 - BOOKS */}
              {!selectedPkg.flat && (
                <div style={{background:"var(--white)",border:"0.5px solid rgba(201,169,110,0.2)",padding:"2rem",marginBottom:"1rem"}}>
                  <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"22px",marginBottom:"1.5rem",color:"var(--dark)"}}>
                    2. How many books?
                  </h3>
                  <div style={{display:"flex",alignItems:"center",gap:"1.5rem"}}>
                    <button type="button" onClick={() => setBooks(b => Math.max(1,b-1))}
                      style={{width:"40px",height:"40px",border:"0.5px solid rgba(201,169,110,0.4)",background:"transparent",cursor:"pointer",fontSize:"20px",color:"var(--text-muted)"}}>−</button>
                    <span style={{fontSize:"36px",fontWeight:"300",color:"var(--dark)",minWidth:"50px",textAlign:"center"}}>{books}</span>
                    <button type="button" onClick={() => setBooks(b => b+1)}
                      style={{width:"40px",height:"40px",border:"0.5px solid rgba(201,169,110,0.4)",background:"transparent",cursor:"pointer",fontSize:"20px",color:"var(--text-muted)"}}>+</button>
                    <span style={{fontSize:"14px",color:"var(--text-muted)"}}>books</span>
                  </div>
                </div>
              )}

              {/* STEP 3 - ADD-ONS */}
              <div style={{background:"var(--white)",border:"0.5px solid rgba(201,169,110,0.2)",padding:"2rem",marginBottom:"1rem"}}>
                <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"22px",marginBottom:"1.5rem",color:"var(--dark)"}}>
                  3. Add extras
                </h3>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
                  {ADDONS.map(a => {
                    const active = addons.includes(a.name);
                    return (
                      <button type="button" key={a.name} onClick={() => toggleAddon(a.name)}
                        style={{
                          border: active ? "1.5px solid var(--gold)" : "0.5px solid rgba(201,169,110,0.2)",
                          background: active ? "rgba(201,169,110,0.08)" : "transparent",
                          padding:"0.85rem",cursor:"pointer",textAlign:"left",
                        }}>
                        <div style={{fontSize:"13px",color:"var(--dark)",fontWeight:active?500:400}}>{a.name}</div>
                        <div style={{fontSize:"12px",color:"var(--gold)",marginTop:"3px"}}>+UGX {a.price.toLocaleString()}</div>
                        {active && <div style={{fontSize:"11px",color:"var(--gold)",marginTop:"3px"}}>✓ Added</div>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PRICE SUMMARY */}
              <div style={{background:"var(--dark)",padding:"1.5rem",marginBottom:"1rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"rgba(255,255,255,0.5)",marginBottom:"0.5rem"}}>
                  <span>{selectedPkg.name}{!selectedPkg.flat ? ` × ${books} books` : ""}</span>
                  <span>UGX {bookTotal.toLocaleString()}</span>
                </div>
                {addons.map(a => {
                  const found = ADDONS.find(x => x.name === a);
                  return (
                    <div key={a} style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"rgba(255,255,255,0.5)",marginBottom:"0.5rem"}}>
                      <span>{a}</span><span>UGX {found?.price.toLocaleString()}</span>
                    </div>
                  );
                })}
                <div style={{display:"flex",justifyContent:"space-between",borderTop:"0.5px solid rgba(201,169,110,0.3)",paddingTop:"0.75rem",marginTop:"0.5rem"}}>
                  <span style={{fontSize:"16px",color:"var(--white)",fontWeight:500}}>Estimated total</span>
                  <span style={{fontSize:"16px",color:"var(--gold)",fontWeight:600}}>UGX {total.toLocaleString()}</span>
                </div>
              </div>

              {/* CONTACT */}
              <div style={{background:"var(--white)",border:"0.5px solid rgba(201,169,110,0.2)",padding:"2rem",marginBottom:"1rem"}}>
                <h3 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"22px",marginBottom:"1.5rem",color:"var(--dark)"}}>
                  4. Your details
                </h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Your name *</label>
                    <input className="form-input" required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Sarah Nakato"/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">WhatsApp number *</label>
                    <input className="form-input" required value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+256 ..."/>
                  </div>
                  <div className="form-group full">
                    <label className="form-label">School name</label>
                    <input className="form-input" value={form.school} onChange={e=>setForm(f=>({...f,school:e.target.value}))} placeholder="e.g. Kampala Parents School"/>
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Special notes</label>
                    <textarea className="form-input" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Child's name for labels, colour preferences, pickup or delivery..."/>
                  </div>
                </div>
              </div>

              <button type="submit" className="form-submit" disabled={status==="saving"}>
                {status==="saving" ? "Placing order..." : "Place school package order ✦"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}