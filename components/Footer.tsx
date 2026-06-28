import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-brand">
          <Image src="/logo-transparent.png" alt="Wrap It Up" width={140} height={140} style={{objectFit:"contain"}} />
          <p className="footer-tagline" style={{marginTop:"0.75rem"}}>Beautifully wrapped, thoughtfully given</p>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li><Link href="/services">Gift Wrapping</Link></li>
            <li><Link href="/services">Hamper Curation</Link></li>
            <li><Link href="/services">School Packages</Link></li>
            <li><Link href="/corporate">Corporate Gifting</Link></li>
            <li><Link href="/services">Event Packages</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link href="/about">About us</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/corporate">Corporate</Link></li>
            <li><Link href="/#order">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Connect</h4>
          <ul>
            <li><a href="https://wa.me/256750016270" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            <li><a href="https://instagram.com/wrapitup.ug" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://tiktok.com/@wrapitup.ug" target="_blank" rel="noopener noreferrer">TikTok</a></li>
            <li><a href="https://facebook.com/wrapitup.ug" target="_blank" rel="noopener noreferrer">Facebook</a></li>
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