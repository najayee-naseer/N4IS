/** Brand values shared between CSS and the WebGL scene. Light theme only. */
export const BRAND = {
  accent: "#0a6bff",
  accentBright: "#00a6ff",
  accentDeep: "#0046c4",
  lavender: "#7686ff",
  ceramic: "#ffffff",
  silver: "#eaf0f7",
  chrome: "#f4f7fb",
  graphite: "#2a3039",
  paper: "#ffffff",
  mist: "#eef4fb",
} as const;

export type Tier = "mobile" | "tablet" | "desktop";

export interface TierSettings {
  particles: number;
  dpr: number;
  segments: number;
  rings: number;
  fragments: number;
  panels: number;
  frame: boolean;
}

/**
 * Device-aware budgets. Mobile drops the architectural frame and most of the
 * glass, keeps the artifact and a handful of motes, and renders at a lower
 * pixel ratio — the composition survives, the thermal cost does not.
 */
export const TIER_SETTINGS: Record<Tier, TierSettings> = {
  mobile: { particles: 60, dpr: 1.4, segments: 22, rings: 1, fragments: 4, panels: 2, frame: false },
  tablet: { particles: 140, dpr: 1.6, segments: 34, rings: 2, fragments: 7, panels: 4, frame: true },
  desktop: { particles: 240, dpr: 1.85, segments: 50, rings: 3, fragments: 11, panels: 6, frame: true },
};

export function tierFor(width: number): Tier {
  if (width <= 720) return "mobile";
  if (width <= 1100) return "tablet";
  return "desktop";
}
