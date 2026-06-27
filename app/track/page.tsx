"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://yqiyxvnytgddydzeoboo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXl4dm55dGdkZHlkemVvYm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzOTU1MTYsImV4cCI6MjA5Nzk3MTUxNn0.2jJ6dH1Z3IJ16mtlZDHG8J33pypjDA34MU6nS1mL9Yg"
);

const STATUS_STEPS = [
  { key: "new",              label: "Order placed",    icon: "⭐", desc: "We've received your order" },
  { key: "sourcing",         label: "Sourcing gift",   icon: "🛍️", desc: "We're getting your gift ready" },
  { key: "wrapping",         label: "Wrapping",        icon: "🎁", desc: "Your gift is being beautifully wrapped" },
  { key: "out_for_delivery", label: "On the way",      icon: "🚗", desc: "Your gift is out for delivery" },
  { key: "delivered",        label: "Delivered",       icon: "✅", desc: "Your gift has been delivered!" },
];

export default function TrackPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("phone", phone.trim())
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setSearched(true);
    setLoading(false);
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-UG", { day: "numeric", month: "long", year: "numeric" });

  const getStepIndex = (status: string) => STATUS_STEPS.findIndex(s => s.key === status);

  return (
    <main className="site">
      <div className="page-hero">
        <p className="section-eyebrow">Order tracking</p>
        <h1 className="page-hero-title">Track your <em>order</em></h1>
        <p className="page-hero-sub">Enter the WhatsApp number you used to place your order</p>
      </div>

      <section className="section">
        <div style={{maxWidth:"480px",margin:"0 auto"}}>

          {/* SEARCH FORM */}
          <form onSubmit={search} style={{display:"flex",flexDirection:"column",gap:"1rem",marginBottom:"2.5rem"}}>
            <div className="form-group">
              <label className="form-label">Your WhatsApp number</label>
              <input
                className="form-input"
                type="tel"
                placeholder="+256 ..."
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="form-submit" disabled={loading}>
              {loading ? "Searching..." : "Find my orders ✦"}
            </button>
          </form>

          {/* RESULTS */}
          {searched && orders.length === 0 && (
            <div style={{textAlign:"center",padding:"2rem",background:"var(--section-bg)",border:"0.5px solid rgba(201,169,110,0.2)"}}>
              <div style={{fontSize:"40px",marginBottom:"1rem"}}>🔍</div>
              <p style={{color:"var(--text-muted)",fontSize:"14px"}}>No orders found for this number.</p>
              <p style={{color:"var(--text-muted)",fontSize:"13px",marginTop:"0.5rem"}}>
                Make sure you use the same number you gave us when ordering.
              </p>
              <a href="/#order" className="btn-outline" style={{display:"inline-block",marginTop:"1.5rem",padding:"0.75rem 1.5rem"}}>
                Place an order
              </a>
            </div>
          )}

          {orders.map(order => {
            const stepIndex = getStepIndex(order.status);
            const price = order.confirmed_price || order.total_price || order.price || 0;
            const paid  = order.paid_amount || 0;
            const owed  = Math.max(0, price - paid);
            const isPriceConfirmed = order.price_confirmed;

            return (
              <div key={order.id} style={{
                background:"var(--white)",
                border:"0.5px solid rgba(201,169,110,0.2)",
                marginBottom:"1.5rem",
                overflow:"hidden"
              }}>
                {/* ORDER HEADER */}
                <div style={{background:"var(--dark)",padding:"1.25rem 1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:"11px",color:"rgba(255,255,255,0.4)",letterSpacing:"0.15em",textTransform:"uppercase"}}>
                      Order reference
                    </div>
                    <div style={{fontSize:"18px",color:"var(--gold)",fontFamily:"Georgia,serif",fontWeight:500,marginTop:"2px"}}>
                      {order.order_ref || order.id.slice(0,8).toUpperCase()}
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:"11px",color:"rgba(255,255,255,0.4)"}}>Placed on</div>
                    <div style={{fontSize:"13px",color:"rgba(255,255,255,0.8)",marginTop:"2px"}}>{fmt(order.created_at)}</div>
                  </div>
                </div>

                {/* STATUS TRACKER */}
                <div style={{padding:"1.5rem",borderBottom:"0.5px solid rgba(201,169,110,0.15)"}}>
                  <p style={{fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"1.25rem"}}>
                    Order status
                  </p>
                  <div style={{display:"flex",alignItems:"flex-start",gap:"0"}}>
                    {STATUS_STEPS.map((step, i) => {
                      const done    = i < stepIndex;
                      const active  = i === stepIndex;
                      const pending = i > stepIndex;
                      return (
                        <div key={step.key} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",position:"relative"}}>
                          {/* LINE */}
                          {i < STATUS_STEPS.length - 1 && (
                            <div style={{
                              position:"absolute",top:"16px",left:"50%",width:"100%",height:"2px",
                              background: done ? "var(--gold)" : "rgba(201,169,110,0.2)",
                              zIndex:0
                            }}/>
                          )}
                          {/* DOT */}
                          <div style={{
                            width:"32px",height:"32px",borderRadius:"50%",
                            background: done ? "var(--gold)" : active ? "var(--dark)" : "rgba(201,169,110,0.15)",
                            border: active ? "2px solid var(--gold)" : "none",
                            display:"flex",alignItems:"center",justifyContent:"center",
                            fontSize:"14px",zIndex:1,position:"relative",
                            marginBottom:"8px"
                          }}>
                            {done ? "✓" : <span style={{fontSize:"12px"}}>{step.icon}</span>}
                          </div>
                          <div style={{
                            fontSize:"10px",textAlign:"center",
                            color: done || active ? "var(--dark)" : "var(--text-muted)",
                            fontWeight: active ? 600 : 400,
                            lineHeight:"1.3",
                            padding:"0 2px"
                          }}>
                            {step.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {stepIndex >= 0 && (
                    <p style={{fontSize:"13px",color:"var(--text-muted)",textAlign:"center",marginTop:"1.25rem",fontStyle:"italic"}}>
                      {STATUS_STEPS[stepIndex]?.desc}
                    </p>
                  )}
                </div>

                {/* ORDER DETAILS */}
                <div style={{padding:"1.25rem 1.5rem",borderBottom:"0.5px solid rgba(201,169,110,0.1)"}}>
                  <p style={{fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"0.75rem"}}>
                    Order details
                  </p>
                  {[
                    { label:"Service",   value: order.service },
                    { label:"Occasion",  value: order.occasion },
                    { label:"Gift",      value: order.gift_description },
                    { label:"Delivery",  value: order.delivery_zone },
                    { label:"Address",   value: order.delivery_address },
                    { label:"Notes",     value: order.message || order.notes },
                  ].filter(r => r.value).map(row => (
                    <div key={row.label} style={{display:"flex",gap:"1rem",marginBottom:"0.5rem"}}>
                      <span style={{fontSize:"12px",color:"var(--text-muted)",minWidth:"70px",fontWeight:500}}>{row.label}</span>
                      <span style={{fontSize:"13px",color:"var(--dark)"}}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* PAYMENT SECTION */}
                <div style={{padding:"1.25rem 1.5rem"}}>
                  <p style={{fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"1rem"}}>
                    Payment
                  </p>

                  {!isPriceConfirmed ? (
                    <div style={{background:"rgba(201,169,110,0.08)",border:"0.5px solid rgba(201,169,110,0.2)",padding:"1rem",textAlign:"center"}}>
                      <div style={{fontSize:"20px",marginBottom:"0.5rem"}}>⏳</div>
                      <p style={{fontSize:"13px",color:"var(--text-muted)"}}>
                        We&apos;re reviewing your order and will send you the final price on WhatsApp shortly.
                      </p>
                      {order.estimated_price > 0 && (
                        <p style={{fontSize:"12px",color:"var(--gold)",marginTop:"0.5rem"}}>
                          Estimated: UGX {order.estimated_price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* PRICE BREAKDOWN */}
                      <div style={{background:"var(--section-bg)",padding:"1rem",marginBottom:"1rem"}}>
                        {[
                          { label:"Wrapping",    val: order.wrapping_cost },
                          { label:"Gift cost",   val: order.supplier_cost },
                          { label:"Delivery",    val: order.delivery_cost },
                        ].filter(r => r.val > 0).map(r => (
                          <div key={r.label} style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"var(--text-muted)",marginBottom:"0.4rem"}}>
                            <span>{r.label}</span>
                            <span>UGX {r.val?.toLocaleString()}</span>
                          </div>
                        ))}
                        <div style={{display:"flex",justifyContent:"space-between",borderTop:"0.5px solid rgba(201,169,110,0.2)",paddingTop:"0.75rem",marginTop:"0.5rem"}}>
                          <span style={{fontSize:"14px",fontWeight:600,color:"var(--dark)"}}>Total</span>
                          <span style={{fontSize:"14px",fontWeight:600,color:"var(--gold)"}}>UGX {price.toLocaleString()}</span>
                        </div>
                        {paid > 0 && (
                          <div style={{display:"flex",justifyContent:"space-between",marginTop:"0.4rem"}}>
                            <span style={{fontSize:"13px",color:"var(--text-muted)"}}>Paid</span>
                            <span style={{fontSize:"13px",color:"#4CAF82"}}>UGX {paid.toLocaleString()}</span>
                          </div>
                        )}
                        {owed > 0 && (
                          <div style={{display:"flex",justifyContent:"space-between",marginTop:"0.4rem"}}>
                            <span style={{fontSize:"14px",fontWeight:600,color:"var(--dark)"}}>Balance owed</span>
                            <span style={{fontSize:"14px",fontWeight:600,color:"#E05C5C"}}>UGX {owed.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* PAY BUTTONS */}
                      {owed > 0 ? (
                        <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
                          <a
                            href={`https://wa.me/256750016270?text=${encodeURIComponent(`Hi! I'd like to pay UGX ${owed.toLocaleString()} for order ${order.order_ref}. Please send me the MTN MoMo details.`)}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",background:"#FDB95D",color:"#1E1A16",padding:"0.9rem",textDecoration:"none",fontSize:"14px",fontWeight:600}}>
                            📱 Pay via MTN Mobile Money
                          </a>
                          <a
                            href={`https://wa.me/256750016270?text=${encodeURIComponent(`Hi! I'd like to pay UGX ${owed.toLocaleString()} for order ${order.order_ref}. Please send me the Airtel Money details.`)}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",background:"#E4002B",color:"#fff",padding:"0.9rem",textDecoration:"none",fontSize:"14px",fontWeight:600}}>
                            📱 Pay via Airtel Money
                          </a>
                          <a
                            href={`https://wa.me/256750016270?text=${encodeURIComponent(`Hi! I'd like to pay for order ${order.order_ref}.`)}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",background:"var(--dark)",color:"#fff",padding:"0.9rem",textDecoration:"none",fontSize:"14px",fontWeight:500}}>
                            💬 Pay via WhatsApp
                          </a>
                        </div>
                      ) : (
                        <div style={{textAlign:"center",padding:"1rem",background:"rgba(76,175,130,0.1)",border:"0.5px solid rgba(76,175,130,0.2)"}}>
                          <div style={{fontSize:"24px",marginBottom:"0.5rem"}}>✅</div>
                          <p style={{fontSize:"14px",color:"#0F6E56",fontWeight:500}}>Fully paid — thank you!</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* PLACE ORDER CTA */}
          {searched && orders.length === 0 && (
            <div style={{textAlign:"center",marginTop:"1rem"}}>
              <p style={{fontSize:"13px",color:"var(--text-muted)"}}>
                Haven&apos;t ordered yet?{" "}
                <a href="/#order" style={{color:"var(--gold)"}}>Place an order now →</a>
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}