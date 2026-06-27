"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://yqiyxvnytgddydzeoboo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXl4dm55dGdkZHlkemVvYm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzOTU1MTYsImV4cCI6MjA5Nzk3MTUxNn0.2jJ6dH1Z3IJ16mtlZDHG8J33pypjDA34MU6nS1mL9Yg"
);

// ── Your sis's payment details ──
const MOMO_NUMBER  = "0790084402";
const MOMO_NAME    = "Wrap It Up";
const AIRTEL_NUMBER = "0790084402"; // update if different
const WA_NUMBER    = "256750016270";

const STATUS_STEPS = [
  { key: "new",              label: "Order placed",    icon: "⭐", desc: "We've received your order and will confirm shortly." },
  { key: "sourcing",         label: "Sourcing gift",   icon: "🛍️", desc: "We're sourcing and preparing your gift." },
  { key: "wrapping",         label: "Wrapping",        icon: "🎁", desc: "Your gift is being beautifully wrapped right now!" },
  { key: "out_for_delivery", label: "On the way",      icon: "🚗", desc: "Your gift is out for delivery!" },
  { key: "delivered",        label: "Delivered",       icon: "✅", desc: "Your gift has been delivered. We hope they loved it! 🎀" },
];

function cleanPhone(phone: string) {
  let p = (phone || "").replace(/\D/g, "");
  if (p.startsWith("0")) p = "256" + p.slice(1);
  if (!p.startsWith("256")) p = "256" + p;
  return p;
}

export default function TrackPage() {
  const [phone, setPhone]       = useState("");
  const [orders, setOrders]     = useState<any[]>([]);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const [txnInputs, setTxnInputs] = useState<Record<string,string>>({});
  const [submitting, setSubmitting] = useState<string|null>(null);
  const [txnSent, setTxnSent]   = useState<Record<string,boolean>>({});

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSearched(false);
    const cleaned = cleanPhone(phone);
    // Try both formats — the number they typed and cleaned version
    const { data } = await supabase
      .from("orders")
      .select("*")
      .or(`phone.eq.${phone.trim()},phone.eq.+${cleaned},phone.eq.${cleaned}`)
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setSearched(true);
    setLoading(false);
  }

  async function submitTxn(order: any) {
    const txn = txnInputs[order.id];
    if (!txn) { alert("Please enter your transaction ID"); return; }
    setSubmitting(order.id);
    // Save txn ID and mark as pending verification
    await supabase.from("orders").update({
      pesapal_ref: txn,
      payment_status: "partial", // pending verification
      payment_method: "Mobile Money",
    }).eq("id", order.id);
    // Notify via WhatsApp to your sis
    const msg = encodeURIComponent(
      `💰 Payment notification!\n\n` +
      `Customer: ${order.customer_name}\n` +
      `Order: ${order.order_ref || order.id.slice(0,8)}\n` +
      `Amount: UGX ${(order.confirmed_price || order.total_price || order.price || 0).toLocaleString()}\n` +
      `Transaction ID: ${txn}\n\n` +
      `Please verify and mark as paid in the dashboard.`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
    setTxnSent(s => ({...s, [order.id]: true}));
    setSubmitting(null);
    // Refresh orders
    search({ preventDefault: () => {} } as any);
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-UG", {
    day:"numeric", month:"long", year:"numeric"
  });

  const getStepIndex = (status: string) =>
    STATUS_STEPS.findIndex(s => s.key === status);

  return (
    <main className="site">
      <div className="page-hero">
        <p className="section-eyebrow">Order tracking</p>
        <h1 className="page-hero-title">Track your <em>order</em></h1>
        <p className="page-hero-sub">
          Enter the WhatsApp number you used when placing your order
        </p>
      </div>

      <section className="section">
        <div style={{maxWidth:"520px",margin:"0 auto"}}>

          {/* SEARCH FORM */}
          <form onSubmit={search} style={{display:"flex",gap:"0.75rem",marginBottom:"2.5rem",alignItems:"flex-end"}}>
            <div className="form-group" style={{flex:1,marginBottom:0}}>
              <label className="form-label">Your WhatsApp number</label>
              <input
                className="form-input"
                type="tel"
                placeholder="e.g. 0750 016 270"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="form-submit"
              style={{width:"auto",padding:"0.75rem 1.5rem",marginBottom:"0"}}
              disabled={loading}>
              {loading ? "..." : "Find →"}
            </button>
          </form>

          {/* NO RESULTS */}
          {searched && orders.length === 0 && (
            <div style={{textAlign:"center",padding:"2.5rem",background:"var(--section-bg)",border:"0.5px solid rgba(201,169,110,0.2)"}}>
              <div style={{fontSize:"40px",marginBottom:"1rem"}}>🔍</div>
              <p style={{color:"var(--text-muted)",fontSize:"14px",marginBottom:"0.5rem"}}>
                No orders found for this number.
              </p>
              <p style={{color:"var(--text-muted)",fontSize:"13px",marginBottom:"1.5rem"}}>
                Make sure you use the exact number you gave us when ordering.
              </p>
              <a href="/#order" className="btn-outline"
                style={{display:"inline-block",padding:"0.75rem 1.5rem"}}>
                Place an order
              </a>
            </div>
          )}

          {/* ORDERS */}
          {orders.map(order => {
            const stepIndex    = getStepIndex(order.status);
            const price        = order.confirmed_price || order.total_price || order.price || 0;
            const paid         = order.paid_amount || 0;
            const owed         = Math.max(0, price - paid);
            const payStatus    = order.payment_status || "unpaid";
            const isPaid       = payStatus === "paid";
            const isPending    = payStatus === "partial" && order.pesapal_ref;
            const priceConfirmed = order.price_confirmed;
            const ref          = order.order_ref || order.id.slice(0,8).toUpperCase();
            const isCancelled  = order.status === "cancelled";

            return (
              <div key={order.id} style={{
                background:"var(--white)",
                border:"0.5px solid rgba(201,169,110,0.2)",
                marginBottom:"2rem",
                overflow:"hidden",
              }}>

                {/* HEADER */}
                <div style={{background:"var(--dark)",padding:"1.25rem 1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:"10px",color:"rgba(255,255,255,0.4)",letterSpacing:"0.15em",textTransform:"uppercase"}}>
                      Order reference
                    </div>
                    <div style={{fontSize:"20px",color:"var(--gold)",fontFamily:"Georgia,serif",fontWeight:500,marginTop:"2px"}}>
                      {ref}
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:"10px",color:"rgba(255,255,255,0.4)"}}>Placed on</div>
                    <div style={{fontSize:"13px",color:"rgba(255,255,255,0.8)",marginTop:"2px"}}>{fmt(order.created_at)}</div>
                  </div>
                </div>

                {/* CANCELLED */}
                {isCancelled && (
                  <div style={{padding:"1.5rem",background:"rgba(224,92,92,0.06)",borderBottom:"0.5px solid rgba(224,92,92,0.15)",textAlign:"center"}}>
                    <p style={{color:"#B03030",fontSize:"14px",fontWeight:500}}>❌ This order has been cancelled.</p>
                    <p style={{color:"var(--text-muted)",fontSize:"13px",marginTop:"0.5rem"}}>
                      Please contact us on WhatsApp if you have questions.
                    </p>
                  </div>
                )}

                {/* STATUS TRACKER */}
                {!isCancelled && (
                  <div style={{padding:"1.5rem",borderBottom:"0.5px solid rgba(201,169,110,0.1)"}}>
                    <p style={{fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"1.25rem"}}>
                      Order status
                    </p>
                    <div style={{display:"flex",alignItems:"flex-start"}}>
                      {STATUS_STEPS.map((step, i) => {
                        const done    = i < stepIndex;
                        const active  = i === stepIndex;
                        return (
                          <div key={step.key} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",position:"relative"}}>
                            {i < STATUS_STEPS.length - 1 && (
                              <div style={{
                                position:"absolute",top:"15px",left:"50%",width:"100%",height:"2px",
                                background: done ? "var(--gold)" : "rgba(201,169,110,0.15)",zIndex:0
                              }}/>
                            )}
                            <div style={{
                              width:"30px",height:"30px",borderRadius:"50%",zIndex:1,position:"relative",
                              background: done ? "var(--gold)" : active ? "var(--dark)" : "rgba(201,169,110,0.12)",
                              border: active ? "2px solid var(--gold)" : "none",
                              display:"flex",alignItems:"center",justifyContent:"center",
                              fontSize:"12px",color: done ? "white" : "inherit",
                              marginBottom:"8px",
                            }}>
                              {done ? "✓" : step.icon}
                            </div>
                            <div style={{
                              fontSize:"9px",textAlign:"center",lineHeight:"1.3",padding:"0 2px",
                              color: done || active ? "var(--dark)" : "var(--text-muted)",
                              fontWeight: active ? 600 : 400,
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
                )}

                {/* ORDER DETAILS */}
                <div style={{padding:"1.25rem 1.5rem",borderBottom:"0.5px solid rgba(201,169,110,0.08)"}}>
                  <p style={{fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"0.75rem"}}>
                    Order details
                  </p>
                  {[
                    { label:"Name",      value: order.customer_name },
                    { label:"Service",   value: order.service },
                    { label:"Occasion",  value: order.occasion },
                    { label:"Gift",      value: order.gift_description },
                    { label:"Delivery",  value: order.delivery_zone },
                    { label:"Address",   value: order.delivery_address },
                    { label:"Notes",     value: order.notes || order.message },
                  ].filter(r => r.value).map(row => (
                    <div key={row.label} style={{display:"flex",gap:"1rem",marginBottom:"0.5rem"}}>
                      <span style={{fontSize:"12px",color:"var(--text-muted)",minWidth:"65px",fontWeight:500}}>{row.label}</span>
                      <span style={{fontSize:"13px",color:"var(--dark)"}}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* PAYMENT SECTION */}
                <div style={{padding:"1.25rem 1.5rem"}}>
                  <p style={{fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"1rem"}}>
                    Payment
                  </p>

                  {/* PRICE NOT CONFIRMED YET */}
                  {!priceConfirmed && (
                    <div style={{background:"rgba(201,169,110,0.06)",border:"0.5px solid rgba(201,169,110,0.2)",padding:"1.25rem",textAlign:"center"}}>
                      <div style={{fontSize:"24px",marginBottom:"0.75rem"}}>⏳</div>
                      <p style={{fontSize:"14px",color:"var(--dark)",fontWeight:500,marginBottom:"0.5rem"}}>
                        Awaiting price confirmation
                      </p>
                      <p style={{fontSize:"13px",color:"var(--text-muted)"}}>
                        We&apos;re reviewing your order and will send you the final price via WhatsApp shortly.
                      </p>
                      {price > 0 && (
                        <p style={{fontSize:"13px",color:"var(--gold)",marginTop:"0.75rem",fontWeight:500}}>
                          Estimated: UGX {price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* PRICE CONFIRMED — show payment options */}
                  {priceConfirmed && (
                    <>
                      {/* PRICE BREAKDOWN */}
                      <div style={{background:"var(--section-bg)",padding:"1rem",marginBottom:"1rem",border:"0.5px solid rgba(201,169,110,0.15)"}}>
                        {order.wrapping_cost > 0 && (
                          <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"var(--text-muted)",marginBottom:"0.4rem"}}>
                            <span>Wrapping</span><span>UGX {order.wrapping_cost?.toLocaleString()}</span>
                          </div>
                        )}
                        {order.supplier_cost > 0 && (
                          <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"var(--text-muted)",marginBottom:"0.4rem"}}>
                            <span>Gift</span><span>UGX {order.supplier_cost?.toLocaleString()}</span>
                          </div>
                        )}
                        {order.delivery_cost > 0 && (
                          <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"var(--text-muted)",marginBottom:"0.4rem"}}>
                            <span>Delivery</span><span>UGX {order.delivery_cost?.toLocaleString()}</span>
                          </div>
                        )}
                        <div style={{display:"flex",justifyContent:"space-between",borderTop:"0.5px solid rgba(201,169,110,0.2)",paddingTop:"0.75rem",marginTop:"0.5rem"}}>
                          <span style={{fontSize:"14px",fontWeight:600,color:"var(--dark)"}}>Total</span>
                          <span style={{fontSize:"14px",fontWeight:600,color:"var(--gold)"}}>UGX {price.toLocaleString()}</span>
                        </div>
                        {paid > 0 && (
                          <div style={{display:"flex",justifyContent:"space-between",marginTop:"0.4rem"}}>
                            <span style={{fontSize:"13px",color:"var(--text-muted)"}}>Paid</span>
                            <span style={{fontSize:"13px",color:"#4CAF82",fontWeight:500}}>UGX {paid.toLocaleString()}</span>
                          </div>
                        )}
                        {owed > 0 && (
                          <div style={{display:"flex",justifyContent:"space-between",marginTop:"0.4rem",paddingTop:"0.4rem",borderTop:"0.5px solid rgba(201,169,110,0.15)"}}>
                            <span style={{fontSize:"14px",fontWeight:600,color:"var(--dark)"}}>Balance owed</span>
                            <span style={{fontSize:"14px",fontWeight:600,color:"#E05C5C"}}>UGX {owed.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* FULLY PAID */}
                      {isPaid && (
                        <div style={{textAlign:"center",padding:"1.5rem",background:"rgba(76,175,130,0.08)",border:"0.5px solid rgba(76,175,130,0.2)"}}>
                          <div style={{fontSize:"32px",marginBottom:"0.5rem"}}>✅</div>
                          <p style={{fontSize:"15px",color:"#0F6E56",fontWeight:600}}>Fully paid — thank you!</p>
                          <p style={{fontSize:"13px",color:"var(--text-muted)",marginTop:"0.5rem"}}>
                            Your gift is being taken care of. We&apos;ll update you every step of the way.
                          </p>
                        </div>
                      )}

                      {/* PAYMENT PENDING VERIFICATION */}
                      {isPending && !isPaid && (
                        <div style={{textAlign:"center",padding:"1.5rem",background:"rgba(232,148,58,0.06)",border:"0.5px solid rgba(232,148,58,0.2)"}}>
                          <div style={{fontSize:"32px",marginBottom:"0.5rem"}}>⏳</div>
                          <p style={{fontSize:"14px",color:"#854F0B",fontWeight:500}}>Payment received — verifying</p>
                          <p style={{fontSize:"13px",color:"var(--text-muted)",marginTop:"0.5rem"}}>
                            Transaction ID: <strong>{order.pesapal_ref}</strong>
                          </p>
                          <p style={{fontSize:"12px",color:"var(--text-muted)",marginTop:"0.5rem"}}>
                            We&apos;ll confirm your payment within a few minutes.
                          </p>
                        </div>
                      )}

                      {/* PAY NOW — only show if owed and not pending */}
                      {owed > 0 && !isPending && !isPaid && (
                        <div>
                          <p style={{fontSize:"13px",color:"var(--text-muted)",marginBottom:"1rem",textAlign:"center"}}>
                            Pay <strong style={{color:"var(--dark)"}}>UGX {owed.toLocaleString()}</strong> using any of these methods:
                          </p>

                          {/* MTN MOMO */}
                          <div style={{border:"0.5px solid rgba(201,169,110,0.2)",marginBottom:"0.75rem",overflow:"hidden"}}>
                            <div style={{background:"#FDB95D",padding:"0.85rem 1rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>
                              <span style={{fontSize:"20px"}}>📱</span>
                              <div>
                                <div style={{fontSize:"13px",fontWeight:600,color:"#1E1A16"}}>MTN Mobile Money</div>
                                <div style={{fontSize:"12px",color:"rgba(30,26,22,0.7)"}}>Send to: <strong>{MOMO_NUMBER}</strong> ({MOMO_NAME})</div>
                              </div>
                            </div>
                            <div style={{padding:"1rem"}}>
                              <p style={{fontSize:"12px",color:"var(--text-muted)",marginBottom:"0.75rem"}}>
                                1. Dial <strong>*165#</strong> → Send Money → Enter <strong>{MOMO_NUMBER}</strong> → Amount: <strong>UGX {owed.toLocaleString()}</strong><br/>
                                2. Enter your PIN and confirm<br/>
                                3. Copy the transaction ID from the SMS and paste below
                              </p>
                              {txnSent[order.id] ? (
                                <div style={{textAlign:"center",padding:"0.75rem",background:"rgba(76,175,130,0.08)",border:"0.5px solid rgba(76,175,130,0.2)"}}>
                                  <p style={{fontSize:"13px",color:"#0F6E56",fontWeight:500}}>✅ Transaction ID submitted! We&apos;ll verify shortly.</p>
                                </div>
                              ) : (
                                <div style={{display:"flex",gap:"0.5rem"}}>
                                  <input
                                    className="form-input"
                                    style={{flex:1,padding:"0.6rem 0.75rem",fontSize:"13px"}}
                                    placeholder="Enter MTN transaction ID e.g. ABC123456"
                                    value={txnInputs[order.id] || ""}
                                    onChange={e => setTxnInputs(t => ({...t,[order.id]:e.target.value}))}
                                  />
                                  <button
                                    onClick={() => submitTxn(order)}
                                    disabled={submitting === order.id}
                                    style={{background:"#FDB95D",border:"none",padding:"0.6rem 1rem",fontWeight:600,fontSize:"13px",cursor:"pointer",color:"#1E1A16",whiteSpace:"nowrap"}}>
                                    {submitting === order.id ? "..." : "Confirm"}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* AIRTEL MONEY */}
                          <div style={{border:"0.5px solid rgba(201,169,110,0.2)",marginBottom:"0.75rem",overflow:"hidden"}}>
                            <div style={{background:"#E4002B",padding:"0.85rem 1rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>
                              <span style={{fontSize:"20px"}}>📱</span>
                              <div>
                                <div style={{fontSize:"13px",fontWeight:600,color:"white"}}>Airtel Money</div>
                                <div style={{fontSize:"12px",color:"rgba(255,255,255,0.8)"}}>Send to: <strong>{AIRTEL_NUMBER}</strong> ({MOMO_NAME})</div>
                              </div>
                            </div>
                            <div style={{padding:"1rem"}}>
                              <p style={{fontSize:"12px",color:"var(--text-muted)",marginBottom:"0.75rem"}}>
                                1. Dial <strong>*185#</strong> → Send Money → Enter <strong>{AIRTEL_NUMBER}</strong> → Amount: <strong>UGX {owed.toLocaleString()}</strong><br/>
                                2. Enter your PIN and confirm<br/>
                                3. Copy the transaction ID from the SMS and paste below
                              </p>
                              {txnSent[order.id] ? (
                                <div style={{textAlign:"center",padding:"0.75rem",background:"rgba(76,175,130,0.08)"}}>
                                  <p style={{fontSize:"13px",color:"#0F6E56",fontWeight:500}}>✅ Transaction ID submitted!</p>
                                </div>
                              ) : (
                                <div style={{display:"flex",gap:"0.5rem"}}>
                                  <input
                                    className="form-input"
                                    style={{flex:1,padding:"0.6rem 0.75rem",fontSize:"13px"}}
                                    placeholder="Enter Airtel transaction ID"
                                    value={txnInputs[order.id] || ""}
                                    onChange={e => setTxnInputs(t => ({...t,[order.id]:e.target.value}))}
                                  />
                                  <button
                                    onClick={() => submitTxn(order)}
                                    disabled={submitting === order.id}
                                    style={{background:"#E4002B",border:"none",padding:"0.6rem 1rem",fontWeight:600,fontSize:"13px",cursor:"pointer",color:"white",whiteSpace:"nowrap"}}>
                                    {submitting === order.id ? "..." : "Confirm"}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* WHATSAPP FALLBACK */}
                          <a
                            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi! I'd like to pay UGX ${owed.toLocaleString()} for order ${ref}. Please assist me.`)}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",border:"0.5px solid rgba(37,211,102,0.3)",padding:"0.85rem",textDecoration:"none",fontSize:"13px",color:"#25D366",background:"rgba(37,211,102,0.04)"}}>
                            💬 Need help? Chat with us on WhatsApp
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}

        </div>
      </section>
    </main>
  );
}