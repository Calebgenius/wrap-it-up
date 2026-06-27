"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SIZES = [
  { label: "Small",   min: 3000,  max: 5000,  desc: "Small boxes, envelopes" },
  { label: "Medium",  min: 5000,  max: 10000, desc: "Standard gift boxes, books" },
  { label: "Large",   min: 10000, max: 20000, desc: "Large boxes, big items" },
  { label: "Premium", min: 15000, max: 50000, desc: "Luxury full styling" },
];

const ADDONS = [
  { name: "Handwritten card",        price: 2000,  icon: "💌" },
  { name: "Decorative ribbon & bow", price: 2000,  icon: "🎀" },
  { name: "Artificial flowers",      price: 5000,  icon: "🌸" },
  { name: "Photo packaging",         price: 10000, icon: "📸" },
  { name: "Name printing",           price: 5000,  icon: "🖨️" },
  { name: "Motivational sticker",    price: 1000,  icon: "⭐" },
  { name: "Theme-based design",      price: 10000, icon: "🎨" },
  { name: "Gift bag upgrade",        price: 3000,  icon: "🛍️" },
];

const DELIVERY_ZONES = [
  { zone: "I'll pick it up",        fee: 0 },
  { zone: "Kampala Central",        fee: 5000 },
  { zone: "Kololo / Nakasero",      fee: 8000 },
  { zone: "Ntinda / Bugolobi",      fee: 10000 },
  { zone: "Kira / Namugongo",       fee: 15000 },
  { zone: "Entebbe / Mukono",       fee: 20000 },
  { zone: "Other (quote on request)", fee: 0 },
];

export default function PriceCalculator() {
  const router = useRouter();
  const [size, setSize] = useState<typeof SIZES[0] | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [delivery, setDelivery] = useState<typeof DELIVERY_ZONES[0] | null>(null);
  const [qty, setQty] = useState(1);

  function toggleAddon(name: string) {
    setSelectedAddons(prev =>
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  }

  const addonTotal  = selectedAddons.reduce((s, name) => {
    const a = ADDONS.find(a => a.name === name);
    return s + (a?.price || 0);
  }, 0);

  const sizeMin     = (size?.min || 0) * qty;
  const sizeMax     = (size?.max || 0) * qty;
  const addonsTot   = addonTotal * qty;
  const deliveryFee = delivery?.fee || 0;
  const totalMin    = sizeMin + addonsTot + deliveryFee;
  const totalMax    = sizeMax + addonsTot + deliveryFee;

  const fmt = (n: number) => n.toLocaleString();

  const whatsappMsg = () => {
    const msg = `Hi Wrap It Up! 🎁\n\nI'd like a quote:\n- Size: ${size?.label}\n- Quantity: ${qty}\n- Add-ons: ${selectedAddons.join(", ") || "None"}\n- Delivery: ${delivery?.zone}\n- Estimated total: UGX ${fmt(totalMin)} – ${fmt(totalMax)}\n\nPlease confirm!`;
    window.open(`https://wa.me/256700000000?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div style={{background:"var(--white)",border:"0.5px solid rgba(201,169,110,0.2)",padding:"2rem"}}>

      {/* STEP 1 — SIZE */}
      <div style={{marginBottom:"2rem"}}>
        <p style={{fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"1rem",fontWeight:500}}>
          Step 1 — Pick your wrap size
        </p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
          {SIZES.map(s => (
            <button key={s.label}
              onClick={() => setSize(s)}
              style={{
                border: size?.label === s.label ? "1.5px solid #1E1A16" : "0.5px solid rgba(201,169,110,0.3)",
                background: size?.label === s.label ? "#1E1A16" : "transparent",
                padding:"0.9rem",cursor:"pointer",textAlign:"left",transition:"all 0.15s"
              }}>
              <div style={{fontSize:"13px",fontWeight:500,color:size?.label===s.label?"#C9A96E":"#1E1A16"}}>{s.label}</div>
              <div style={{fontSize:"11px",color:size?.label===s.label?"rgba(255,255,255,0.6)":"#6B5F50",marginTop:"3px"}}>{s.desc}</div>
              <div style={{fontSize:"12px",color:"#C9A96E",marginTop:"6px",fontWeight:500}}>UGX {fmt(s.min)} – {fmt(s.max)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* STEP 2 — QUANTITY */}
      <div style={{marginBottom:"2rem"}}>
        <p style={{fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"1rem",fontWeight:500}}>
          Step 2 — How many gifts?
        </p>
        <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
          <button onClick={() => setQty(q => Math.max(1, q-1))}
            style={{width:"36px",height:"36px",border:"0.5px solid rgba(201,169,110,0.4)",background:"transparent",cursor:"pointer",fontSize:"18px",color:"#6B5F50"}}>−</button>
          <span style={{fontSize:"24px",fontWeight:"300",color:"#1E1A16",minWidth:"30px",textAlign:"center"}}>{qty}</span>
          <button onClick={() => setQty(q => q+1)}
            style={{width:"36px",height:"36px",border:"0.5px solid rgba(201,169,110,0.4)",background:"transparent",cursor:"pointer",fontSize:"18px",color:"#6B5F50"}}>+</button>
          <span style={{fontSize:"13px",color:"#6B5F50"}}>gift{qty>1?"s":""}</span>
        </div>
      </div>

      {/* STEP 3 — ADD-ONS */}
      <div style={{marginBottom:"2rem"}}>
        <p style={{fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"1rem",fontWeight:500}}>
          Step 3 — Add extras (optional)
        </p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"}}>
          {ADDONS.map(a => {
            const active = selectedAddons.includes(a.name);
            return (
              <button key={a.name} onClick={() => toggleAddon(a.name)}
                style={{
                  border: active ? "1.5px solid #C9A96E" : "0.5px solid rgba(201,169,110,0.2)",
                  background: active ? "rgba(201,169,110,0.08)" : "transparent",
                  padding:"0.7rem 0.9rem",cursor:"pointer",textAlign:"left",
                  display:"flex",alignItems:"center",gap:"0.5rem"
                }}>
                <span style={{fontSize:"16px"}}>{a.icon}</span>
                <div>
                  <div style={{fontSize:"12px",color:"#1E1A16",fontWeight:active?500:400}}>{a.name}</div>
                  <div style={{fontSize:"11px",color:"#C9A96E"}}>+{fmt(a.price)}</div>
                </div>
                {active && <span style={{marginLeft:"auto",color:"#C9A96E",fontSize:"16px"}}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 4 — DELIVERY */}
      <div style={{marginBottom:"2rem"}}>
        <p style={{fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"1rem",fontWeight:500}}>
          Step 4 — Delivery
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:"0.4rem"}}>
          {DELIVERY_ZONES.map(z => (
            <button key={z.zone} onClick={() => setDelivery(z)}
              style={{
                border: delivery?.zone===z.zone ? "1.5px solid #1E1A16" : "0.5px solid rgba(201,169,110,0.2)",
                background: delivery?.zone===z.zone ? "#1E1A16" : "transparent",
                padding:"0.7rem 1rem",cursor:"pointer",
                display:"flex",justifyContent:"space-between",alignItems:"center"
              }}>
              <span style={{fontSize:"13px",color:delivery?.zone===z.zone?"#fff":"#1E1A16"}}>{z.zone}</span>
              <span style={{fontSize:"12px",color:delivery?.zone===z.zone?"#C9A96E":"#6B5F50"}}>
                {z.fee===0 ? (z.zone.includes("pick") ? "Free" : "Quote") : `+${fmt(z.fee)}`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* TOTAL */}
      {size && (
        <div style={{background:"#1E1A16",padding:"1.5rem",marginBottom:"1.5rem"}}>
          <p style={{fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.4)",marginBottom:"0.5rem"}}>
            Your estimate
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:"0.4rem",marginBottom:"1rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"rgba(255,255,255,0.6)"}}>
              <span>Wrapping ({qty}× {size.label})</span>
              <span>UGX {fmt(sizeMin)} – {fmt(sizeMax)}</span>
            </div>
            {addonsTot > 0 && (
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"rgba(255,255,255,0.6)"}}>
                <span>Add-ons</span>
                <span>UGX {fmt(addonsTot)}</span>
              </div>
            )}
            {deliveryFee > 0 && (
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px",color:"rgba(255,255,255,0.6)"}}>
                <span>Delivery</span>
                <span>UGX {fmt(deliveryFee)}</span>
              </div>
            )}
            <div style={{borderTop:"0.5px solid rgba(201,169,110,0.3)",paddingTop:"0.75rem",marginTop:"0.25rem",display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:"15px",color:"#fff",fontWeight:500}}>Total estimate</span>
              <span style={{fontSize:"15px",color:"#C9A96E",fontWeight:500}}>
                UGX {fmt(totalMin)}{totalMin!==totalMax?` – ${fmt(totalMax)}`:""}
              </span>
            </div>
          </div>
          <button onClick={whatsappMsg}
            style={{width:"100%",background:"#25D366",border:"none",color:"#fff",padding:"0.85rem",cursor:"pointer",fontSize:"13px",letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:500}}>
            📱 Send this quote via WhatsApp
          </button>
        </div>
      )}

      {!size && (
        <p style={{textAlign:"center",fontSize:"13px",color:"var(--text-muted)",padding:"1rem"}}>
          ↑ Pick a size above to see your estimate
        </p>
      )}

    </div>
  );
}