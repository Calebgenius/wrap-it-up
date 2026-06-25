import Link from "next/link";
import LogoSVG from "./LogoSVG";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-brand">
          <LogoSVG width={140} dark />
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li><Link href="/services">Gift Wrapping</Link></li>
            <li><Link href="/services">Hamper Curation</Link></li>
            <li><Link href="/services">Corporate Gifting</Link></li>
            <li><Link href="/services">Event Packages</Link></li>
            <li><Link href="/services">Pickup &amp; Delivery</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link href="/about">About us</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/#order">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Connect</h4>
          <ul>
            <li><a href="https://wa.me/256790084402" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            <li><a href="https://instagram.com/wrapitup.ug" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://tiktok.com/@wrapitup.ug" target="_blank" rel="noopener noreferrer">TikTok</a></li>
          </ul>
        </div>
      </footer>
      <div className="footer-bottom">
        <span className="footer-copy">© 2026 Wrap It Up. Kampala, Uganda.</span>
        <span className="footer-copy">Made with love 🎀</span>
      </div>
    </>
  );
}