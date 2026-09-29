import "@/styles/site.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BootScreen } from "@/components/layout/boot-screen";
import { StudioCursor } from "@/components/layout/studio-cursor";

/** The public N4IS site. The admin lives outside this group and has none of this chrome. */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <BootScreen />
      <StudioCursor />
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
