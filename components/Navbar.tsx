"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo-img">
          <Image src="/logo-transparent.png" alt="Wrap It Up" width={110} height={110} style={{objectFit:"contain"}} priority />
        </Link>

        <ul className="nav-links">
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/gallery">Gallery</Link></li>
          <li><Link href="/#how-it-works">How it works</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/corporate">Corporate</Link></li>
        </ul>

        <Link href="/#order" className="nav-cta">Order now</Link>

        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {open && (
        <div className="mobile-drawer" onClick={() => setOpen(false)}>
          <ul>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/#how-it-works">How it works</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/corporate">Corporate</Link></li>
            <li><Link href="/track">Track order</Link></li>
            <li><Link href="/school">School packages</Link></li>
            <li><Link href="/#order" className="drawer-cta">Order now</Link></li>
          </ul>
        </div>
      )}
    </>
  );
}