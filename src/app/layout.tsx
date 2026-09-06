import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: { default: "N4IS — Building What's Next", template: "%s — N4IS" },
  description: "N4IS is a personal technology studio where ideas are explored, engineered, and turned into real products.",
  metadataBase: new URL("https://n4is.business"),
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0b0c0e",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
