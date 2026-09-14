import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function SectionHead({
  index,
  label,
  title,
  children,
}: {
  index?: string;
  label: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="section-head">
      <Reveal className="section-head__copy">
        <p className="label label-rule">
          {index ? <span className="label--accent">{index}</span> : null} {label}
        </p>
        <h2 className="h2">{title}</h2>
      </Reveal>
      {children ? (
        <Reveal className="section-head__copy" delay={120}>
          {children}
        </Reveal>
      ) : null}
    </header>
  );
}
