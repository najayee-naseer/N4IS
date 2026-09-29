import Link from "next/link";
import { navigation, site } from "@/data/site";
import { getProjects, getSettings } from "@/lib/cms/queries";
import { BrandMark } from "@/components/ui/brand-mark";

export async function SiteFooter() {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);

  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__grid">
          <div>
            <BrandMark variant="lockup" sizes="(max-width: 900px) 60vw, 280px" alt="N4IS — ideas for a smarter tomorrow" />
            <p className="footer__statement">
              Building
              <em>what&apos;s next.</em>
            </p>
          </div>

          <div className="footer__col">
            <h3>Navigate</h3>
            <div className="footer__list">
              {navigation.slice(1).map((item) => (
                <Link key={item.href} href={item.href} data-cursor="link">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer__col">
            <h3>Currently building</h3>
            <div className="footer__list">
              {projects.map((project) => (
                <Link key={project.slug} href={`/projects/${project.slug}`} data-cursor="link">
                  {project.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer__col">
            <h3>Contact</h3>
            <div className="footer__list">
              <Link href="/contact" data-cursor="link">
                Start a conversation ↗
              </Link>
              {settings.contactEmail ? (
                <a href={`mailto:${settings.contactEmail}`} data-cursor="link">
                  {settings.contactEmail}
                </a>
              ) : null}
              {settings.socialLinks.length > 0 ? (
                settings.socialLinks.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" data-cursor="link">
                    {link.label} ↗
                  </a>
                ))
              ) : (
                <span>Social destinations will be listed here once they are ready to share.</span>
              )}
            </div>
          </div>
        </div>

        <div className="footer__base">
          <p className="label">{settings.content.process.join(" · ")}</p>
          <p className="label">
            © {new Date().getFullYear()} {settings.siteName} · {site.domain}
          </p>
        </div>
      </div>
    </footer>
  );
}
