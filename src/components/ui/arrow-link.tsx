import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function ArrowLink({
  children,
  className = "",
  ...rest
}: { children: ReactNode } & ComponentProps<typeof Link>) {
  return (
    <Link className={`arrow-link ${className}`.trim()} data-cursor="link" {...rest}>
      {children} <span aria-hidden="true">↗</span>
    </Link>
  );
}

export function ButtonLink({
  children,
  tone = "primary",
  className = "",
  ...rest
}: { children: ReactNode; tone?: "primary" | "line" } & ComponentProps<typeof Link>) {
  return (
    <Link className={`btn btn--${tone} ${className}`.trim()} data-cursor="link" {...rest}>
      <span>{children}</span>
      <span className="btn__arrow" aria-hidden="true">↗</span>
    </Link>
  );
}
