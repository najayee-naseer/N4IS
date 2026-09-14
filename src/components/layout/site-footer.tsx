import Link from "next/link";
import { activeProjects } from "@/data/projects";
import { navigation, process, site } from "@/data/site";
import { BrandMark } from "@/components/ui/brand-mark";

export function SiteFooter() {
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
              {activeProjects.map((project) => (
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
              <span>Social destinations will be listed here once they are ready to share.</span>
            </div>
          </div>
        </div>

        <div className="footer__base">
          <p className="label">{process.join(" · ")}</p>
          <p className="label">
            © {new Date().getFullYear()} {site.name} · {site.domain}
          </p>
        </div>
      </div>
    </footer>
  );
}
