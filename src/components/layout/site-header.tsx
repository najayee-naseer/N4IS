"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation, site } from "@/data/site";
import { BrandMark } from "@/components/ui/brand-mark";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(window.scrollY > 12);
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header className="header" data-scrolled={scrolled ? "true" : "false"}>
        <div className="shell">
          <div className="header__inner">
            <Link href="/" className="header__brand" aria-label={`${site.name} — home`} data-cursor="link">
              <BrandMark variant="wordmark" priority sizes="120px" alt="N4IS" />
              <span className="header__brand-meta" aria-hidden="true">
                <b>{site.domain}</b>
                <i>Digital technology studio</i>
              </span>
            </Link>

            <nav className="header__nav" aria-label="Primary">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="header__link"
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  data-cursor="link"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link href="/contact" className="btn btn--primary btn--small header__cta" data-cursor="link">
              <span>Let&apos;s build</span>
              <span className="btn__arrow" aria-hidden="true">↗</span>
            </Link>

            <button
              type="button"
              className="menu-button"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen((value) => !value)}
            >
              <span />
              <span />
            </button>

            <span className="header__progress" style={{ ["--progress" as string]: progress } as React.CSSProperties} aria-hidden="true" />
          </div>
        </div>
      </header>

      <nav id="mobile-navigation" className="mobile-nav" data-open={open ? "true" : "false"} aria-label="Mobile">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="mobile-nav__link"
            aria-current={isCurrent(item.href) ? "page" : undefined}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
          >
            <span>{item.index}</span>
            {item.label}
          </Link>
        ))}
        <div className="mobile-nav__foot">
          <p className="label">{site.tagline}</p>
          <Link href="/contact" className="btn btn--primary" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
            <span>Let&apos;s build</span>
            <span className="btn__arrow" aria-hidden="true">↗</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
