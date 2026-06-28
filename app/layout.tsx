import type { Metadata } from "next";
import "./globals.css";
import ReferralBanner from "../components/ReferralBanner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Wrap It Up — Beautifully Wrapped, Thoughtfully Given",
  description: "Kampala's premium gift wrapping, hamper curation, and delivery service. Professional wrapping for birthdays, weddings, anniversaries and every special occasion.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReferralBanner />
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}