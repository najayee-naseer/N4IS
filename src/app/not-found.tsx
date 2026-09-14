import { ButtonLink } from "@/components/ui/arrow-link";
import { StudioBackdrop } from "@/components/3d/studio-backdrop";

export default function NotFound() {
  return (
    <main id="main-content" className="page">
      <StudioBackdrop fixed variant="ambient" markers={["N4IS / 404", "NOTHING HERE"]} scene={false} />
      <div className="shell" style={{ position: "relative", zIndex: 1 }}>
        <div className="notfound">
          <p className="label label-rule">Error 404</p>
          <h1 className="display">
            This page
            <br />
            isn&apos;t built.
          </h1>
          <p className="lead">The address does not match anything in Work, the Lab, or the rest of the studio.</p>
          <ButtonLink href="/">Back to N4IS</ButtonLink>
        </div>
      </div>
    </main>
  );
}
