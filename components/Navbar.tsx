"use client";
import { useState } from "react";
import Link from "next/link";
import LogoSVG from "./LogoSVG";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo-img">
          <LogoSVG width={130} />
        </Link>

        {/* Desktop links */}
        <ul className="nav-links">
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/gallery">Gallery</Link></li>
          <li><Link href="/#how-it-works">How it works</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>

        <Link href="/#order" className="nav-cta">Order now</Link>

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="mobile-drawer" onClick={() => setOpen(false)}>
          <ul>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/#how-it-works">How it works</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/#order" className="drawer-cta">Order now</Link></li>
          </ul>
        </div>
      )}
    </>
  );
}