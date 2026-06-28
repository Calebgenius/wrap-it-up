"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://yqiyxvnytgddydzeoboo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxaXl4dm55dGdkZHlkemVvYm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzOTU1MTYsImV4cCI6MjA5Nzk3MTUxNn0.2jJ6dH1Z3IJ16mtlZDHG8J33pypjDA34MU6nS1mL9Yg"
);

export default function ReferralBanner() {
  const [ref, setRef]     = useState("");
  const [valid, setValid] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Check URL for referral code e.g. ?ref=SARAH10
    const params = new URLSearchParams(window.location.search);
    const code   = params.get("ref");
    if (code) {
      setRef(code.toUpperCase());
      checkCode(code.toUpperCase());
      localStorage.setItem("wiu_ref", code.toUpperCase());
    } else {
      const saved = localStorage.getItem("wiu_ref");
      if (saved) { setRef(saved); checkCode(saved); }
    }
  }, []);

  async function checkCode(code: string) {
    const { data } = await supabase
      .from("referrals")
      .select("*")
      .eq("code", code)
      .eq("active", true)
      .single();
    setValid(!!data);
    setChecked(true);
  }

  if (!ref || !valid || !checked) return null;

  return (
    <div style={{
      background:"linear-gradient(135deg, var(--dark) 0%, #2A2010 100%)",
      padding:"0.85rem 2rem",
      display:"flex",alignItems:"center",justifyContent:"center",gap:"0.75rem",
      borderBottom:"0.5px solid rgba(201,169,110,0.3)",
    }}>
      <span style={{fontSize:"16px"}}>🎁</span>
      <p style={{fontSize:"13px",color:"var(--white)",letterSpacing:"0.05em"}}>
        You were referred! Use code <strong style={{color:"var(--gold)"}}>{ref}</strong> at checkout for a special discount.
      </p>
    </div>
  );
}