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
  /** How many arches deep the corridor runs. */
  depth: number;
  /** Large flanking glass panels standing in for walls. */
  panels: number;
  /** Motes travelling the length of the corridor. */
  streamNodes: number;
}

/**
 * Device-aware budgets. Mobile keeps a short two-arch corridor and a
 * handful of motes at a lower pixel ratio — the composition survives,
 * the thermal cost does not.
 */
export const TIER_SETTINGS: Record<Tier, TierSettings> = {
  mobile: { particles: 50, dpr: 1.4, segments: 24, depth: 2, panels: 0, streamNodes: 3 },
  tablet: { particles: 110, dpr: 1.6, segments: 34, depth: 3, panels: 2, streamNodes: 5 },
  desktop: { particles: 180, dpr: 1.85, segments: 46, depth: 4, panels: 3, streamNodes: 7 },
};

export function tierFor(width: number): Tier {
  if (width <= 720) return "mobile";
  if (width <= 1100) return "tablet";
  return "desktop";
}
