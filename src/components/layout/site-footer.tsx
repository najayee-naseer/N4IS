import Link from "next/link";
import { navigation } from "@/data/navigation";
export function SiteFooter() { return <footer className="site-footer"><div><p className="footer-mark">N4IS</p><p className="footer-statement">BUILDING WHAT&apos;S NEXT.</p></div><nav aria-label="Footer navigation">{navigation.slice(1).map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav><p className="footer-philosophy">IDEAS → TECHNOLOGY → REAL WORLD</p><p className="footer-note">© {new Date().getFullYear()} N4IS. A personal technology studio.</p></footer>; }
