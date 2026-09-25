/**
 * Camera stations through the N4IS hall.
 *
 * A station is a place to stand, not an effect: where the camera is, which way
 * it faces, where the lens is shifted to, and how the two light sources are
 * balanced there. The homepage walks the visitor from the entrance down the
 * colonnade to the opening at the far end; inner pages each stand still at one
 * station. Landscape and portrait are composed separately — portrait is not a
 * squeezed landscape.
 */
export interface View {
  pos: [number, number, number];
  /** Heading in radians; 0 faces straight down the hall. */
  yaw: number;
  /** Where the optical axis lands on screen, in units of screen height from centre. */
  shift: [number, number];
  /** Vertical field of view in degrees. */
  fov: number;
  portal: number;
  sun: number;
  /** 0 = the space at full strength, 1 = white. */
  veil: number;
}

export type Station =
  | "hero"
  | "definition"
  | "philosophy"
  | "ecosystem"
  | "projects"
  | "lab"
  | "founder"
  | "return"
  | "page"
  | "quiet";

type Orientation = "landscape" | "portrait";

const LANDSCAPE: Record<Station, View> = {
  // at the entrance: the colonnade enters from the right, the opening far off
  hero: { pos: [2.7, 1.7, 6.5], yaw: 0, shift: [0.64, -0.2], fov: 54, portal: 1, sun: 1, veil: 0 },
  // stepping up to the first arch — the space opens up
  definition: { pos: [3.7, 1.9, 1.5], yaw: 0, shift: [0.5, -0.16], fov: 56, portal: 1, sun: 1, veil: 0.5 },
  // through it, onto the hall's centre line
  philosophy: { pos: [4.7, 2.0, -7.5], yaw: 0, shift: [0.36, -0.14], fov: 58, portal: 1.05, sun: 1, veil: 0.4 },
  // among the arches: the pathways
  ecosystem: { pos: [5.2, 1.9, -12.5], yaw: 0, shift: [0.3, -0.16], fov: 58, portal: 1.1, sun: 1, veil: 0.6 },
  // the studio floor
  projects: { pos: [5.2, 1.8, -17], yaw: 0, shift: [0.26, -0.16], fov: 58, portal: 1.1, sun: 1.05, veil: 0.74 },
  // deeper, bluer
  lab: { pos: [5.2, 1.75, -20], yaw: 0, shift: [0.2, -0.14], fov: 56, portal: 1.4, sun: 0.92, veil: 0.6 },
  // quiet — the light softens
  founder: { pos: [5.2, 1.7, -22], yaw: 0, shift: [0.1, -0.14], fov: 54, portal: 1.1, sun: 0.85, veil: 0.76 },
  // the far end: the gate stands ahead, its light on the left, the way out on the right
  return: { pos: [5.2, 1.7, -25.6], yaw: 0, shift: [-0.55, -0.1], fov: 46, portal: 1.25, sun: 0.95, veil: 0.22 },
  // inner pages
  page: { pos: [2.7, 1.8, 7.5], yaw: 0, shift: [0.72, -0.16], fov: 54, portal: 1, sun: 1, veil: 0.6 },
  quiet: { pos: [5.2, 1.8, -17], yaw: 0, shift: [0.5, -0.14], fov: 56, portal: 0.9, sun: 0.9, veil: 0.8 },
};

const PORTRAIT: Record<Station, View> = {
  hero: { pos: [3.1, 1.5, 3], yaw: 0, shift: [0.18, 0.18], fov: 64, portal: 1.1, sun: 1, veil: 0.12 },
  definition: { pos: [3.4, 2.0, -3], yaw: 0, shift: [0.16, 0.2], fov: 64, portal: 1.1, sun: 1, veil: 0.55 },
  philosophy: { pos: [3.8, 2.1, -9], yaw: 0, shift: [0.14, 0.2], fov: 64, portal: 1.1, sun: 1, veil: 0.4 },
  ecosystem: { pos: [4.2, 1.9, -15], yaw: 0, shift: [0.12, 0.2], fov: 64, portal: 1.15, sun: 1, veil: 0.62 },
  projects: { pos: [4.6, 1.8, -22], yaw: 0, shift: [0.1, 0.2], fov: 64, portal: 1.15, sun: 1, veil: 0.75 },
  lab: { pos: [4.9, 1.7, -28], yaw: 0, shift: [0.1, 0.22], fov: 62, portal: 1.45, sun: 0.9, veil: 0.6 },
  founder: { pos: [5.0, 1.7, -34], yaw: 0, shift: [0.1, 0.2], fov: 62, portal: 1.1, sun: 0.85, veil: 0.75 },
  return: { pos: [5.2, 1.6, -41], yaw: 0, shift: [0, 0.3], fov: 60, portal: 1.7, sun: 0.95, veil: 0.05 },
  page: { pos: [3.4, 1.8, 1], yaw: 0, shift: [0.2, 0.2], fov: 64, portal: 1, sun: 1, veil: 0.66 },
  quiet: { pos: [4.4, 1.8, -18], yaw: 0, shift: [0.12, 0.2], fov: 62, portal: 0.9, sun: 0.9, veil: 0.8 },
};

export function viewFor(station: Station, orientation: Orientation): View {
  return (orientation === "portrait" ? PORTRAIT : LANDSCAPE)[station];
}

export function orientationFor(width: number, height: number): Orientation {
  return width / Math.max(height, 1) < 0.9 ? "portrait" : "landscape";
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function mixViews(a: View, b: View, t: number): View {
  return {
    pos: [lerp(a.pos[0], b.pos[0], t), lerp(a.pos[1], b.pos[1], t), lerp(a.pos[2], b.pos[2], t)],
    yaw: lerp(a.yaw, b.yaw, t),
    shift: [lerp(a.shift[0], b.shift[0], t), lerp(a.shift[1], b.shift[1], t)],
    fov: lerp(a.fov, b.fov, t),
    portal: lerp(a.portal, b.portal, t),
    sun: lerp(a.sun, b.sun, t),
    veil: lerp(a.veil, b.veil, t),
  };
}
