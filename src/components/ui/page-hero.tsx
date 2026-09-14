import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function PageHero({
  label,
  title,
  lead,
  support,
  children,
}: {
  label: string;
  title: string;
  lead: string;
  support?: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-hero">
      <Reveal as="p" className="label label-rule" variant="fade">
        {label}
      </Reveal>
      <Reveal delay={60}>
        <h1 className="page-hero__title">{title}</h1>
      </Reveal>
      <Reveal className="page-hero__copy" delay={140}>
        <p className="lead">{lead}</p>
        {support ? <p className="muted">{support}</p> : null}
      </Reveal>
      {children}
    </header>
  );
}
