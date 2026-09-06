"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navigation } from "@/data/navigation";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link href="/" className="brand" aria-label="N4IS home" onClick={() => setIsOpen(false)}>
          <Image
            className="brand-logo"
            src="/brand/n4is-logo.png"
            alt="N4IS"
            width={144}
            height={42}
            priority
          />
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}
        </nav>

        <button
          className="menu-button"
          type="button"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span /> <span />
        </button>
      </div>

      <nav id="mobile-navigation" className={`mobile-nav ${isOpen ? "is-open" : ""}`} aria-label="Mobile navigation">
        {navigation.map((item, index) => (
          <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} tabIndex={isOpen ? 0 : -1} onClick={() => setIsOpen(false)}>
            <span>0{index + 1}</span>{item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
