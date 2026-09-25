/**
 * The N4IS hall — one raymarched architectural space.
 *
 * A colonnade of white ceramic arches, each cut to the profile of the logo's
 * "n", recedes down the hall toward a bright opening in the far facade. The
 * opening is the scene's blue light source: it rims the arches, pools on the
 * polished stone floor and scatters into the haze. A low sun behind and to
 * the left models every arch in light and shade and throws shafts through the
 * colonnade. A curved glass wall sweeps in behind the arches from the right,
 * and far beyond the facade a colossal arch stands in the haze — the logo's
 * form, found rather than shown.
 *
 * Everything is resolved in one fragment shader so the space has real
 * occlusion, shadow, reflection and atmospheric perspective — the things that
 * make an image read as a photograph rather than as UI.
 *
 * Units are metres. The floor is y = 0, the hall runs down -z.
 */

export const VERTEX_SHADER = /* glsl */ `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

export const FRAGMENT_SHADER = /* glsl */ `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform vec3 uCamPos;
uniform float uYaw;      // camera heading around y — pitch is always 0, verticals stay vertical
uniform vec2 uShift;     // lens shift: where the optical axis lands on screen
uniform float uTanHalf;  // tan(vertical fov / 2)
uniform float uPortal;   // strength of the blue opening
uniform float uSun;      // strength of the daylight
uniform float uVeil;     // lift toward white so dense content stays readable
uniform int uQuality;    // 0 mobile · 1 tablet · 2 desktop

out vec4 fragColor;

#define HALL_X 5.2
#define ARCH_W 2.9       // inner half-width
#define ARCH_H 4.8       // spring line
#define ARCH_T 0.95      // band thickness in the arch plane
#define ARCH_D 0.85      // depth along the hall
#define ARCH_Z0 -6.0
#define ARCH_SP 5.6
#define ARCH_N 9.0
#define PORTAL_Z (ARCH_Z0 - ARCH_N * ARCH_SP)
#define PORTAL_W (ARCH_W * 0.92)

// the curved glass wall
#define GLASS_C vec2(HALL_X + 68.0, -38.0)
#define GLASS_R 61.0
#define GLASS_TOP 13.0

#define MAT_FLOOR 1.0
#define MAT_ARCH 2.0
#define MAT_FACADE 3.0

const vec3 SUN_DIR = normalize(vec3(-0.74, 0.52, 0.26));
const vec3 SUN_COL = vec3(1.0, 0.975, 0.94);
const vec3 BLUE = vec3(0.04, 0.3, 1.0);
const vec3 CYAN = vec3(0.16, 0.62, 1.0);
const vec3 HAZE = vec3(0.95, 0.968, 1.0);

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

/* ---------- profile of the "n": legs + semicircular crown ---------- */
float archProfile(vec2 p, float w, float h, float t) {
  p.x = abs(p.x);
  float mid = w + t * 0.5;
  if (p.y > h) return abs(length(p - vec2(0.0, h)) - mid) - t * 0.5;
  return abs(p.x - mid) - t * 0.5;
}

/* the opening itself: inside < 0 */
float archHole(vec2 p, float w, float h) {
  p.x = abs(p.x);
  if (p.y > h) return length(p - vec2(0.0, h)) - w;
  return p.x - w;
}

float extrude(float d2, float z, float halfDepth) {
  vec2 w = vec2(d2, abs(z) - halfDepth);
  return min(max(w.x, w.y), 0.0) + length(max(w, 0.0));
}

float sdArches(vec3 p) {
  vec3 q = p - vec3(HALL_X, 0.0, 0.0);
  float i = clamp(floor((ARCH_Z0 - q.z) / ARCH_SP + 0.5), 0.0, ARCH_N - 1.0);
  q.z -= ARCH_Z0 - i * ARCH_SP;
  return extrude(archProfile(q.xy, ARCH_W, ARCH_H, ARCH_T), q.z, ARCH_D * 0.5) - 0.045;
}

/* the gate at the end of the hall — a monolith with the logo's crown,
   pierced by the same "n" as the colonnade */
float sdFacade(vec3 p) {
  vec3 q = p - vec3(HALL_X, 0.0, PORTAL_Z);
  float mass = extrude(archHole(q.xy, 8.5, 6.5), q.z, 1.6) - 0.08;
  float hole = extrude(archHole(q.xy, PORTAL_W, ARCH_H), q.z, 3.0);
  return max(mass, -hole);
}

/* a canopy overhead, behind the viewer and out of frame — only its shadow
   is ever seen, falling across the near floor as it would in a real building */
float sdCanopy(vec3 p) {
  vec3 q = p - vec3(-4.0, 9.4, 30.0);
  vec3 d = abs(q) - vec3(40.0, 0.3, 24.0);
  return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

vec2 map(vec3 p) {
  vec2 res = vec2(p.y, MAT_FLOOR);
  float a = sdArches(p);
  if (a < res.x) res = vec2(a, MAT_ARCH);
  float f = sdFacade(p);
  if (f < res.x) res = vec2(f, MAT_FACADE);
  float c = sdCanopy(p);
  if (c < res.x) res = vec2(c, MAT_FACADE);
  return res;
}

vec3 calcNormal(vec3 p) {
  const vec2 k = vec2(1.0, -1.0);
  const float e = 0.002;
  return normalize(
    k.xyy * map(p + k.xyy * e).x + k.yyx * map(p + k.yyx * e).x +
    k.yxy * map(p + k.yxy * e).x + k.xxx * map(p + k.xxx * e).x);
}

vec2 march(vec3 ro, vec3 rd, float tmax, int steps) {
  float t = 0.02;
  for (int i = 0; i < 180; i++) {
    if (i >= steps) break;
    vec2 h = map(ro + rd * t);
    if (h.x < 0.0008 * t) return vec2(t, h.y);
    t += h.x;
    if (t > tmax) break;
  }
  return vec2(-1.0, 0.0);
}

float softShadow(vec3 ro, vec3 rd, float k, int steps) {
  float res = 1.0;
  float t = 0.04;
  for (int i = 0; i < 48; i++) {
    if (i >= steps) break;
    float h = map(ro + rd * t).x;
    res = min(res, k * h / t);
    t += clamp(h, 0.05, 1.6);
    if (res < 0.002 || t > 45.0) break;
  }
  res = clamp(res, 0.0, 1.0);
  return res * res * (3.0 - 2.0 * res);
}

float ambientOcclusion(vec3 p, vec3 n) {
  float occ = 0.0;
  float sca = 1.0;
  for (int i = 0; i < 5; i++) {
    float h = 0.03 + 0.24 * float(i);
    occ += (h - map(p + n * h).x) * sca;
    sca *= 0.74;
  }
  return clamp(1.0 - 1.15 * occ, 0.0, 1.0);
}

vec3 portalCenter() { return vec3(HALL_X, ARCH_H * 0.62, PORTAL_Z + 1.0); }

/* sky / haze seen where a ray escapes the building */
vec3 sky(vec3 rd) {
  float up = clamp(rd.y, 0.0, 1.0);
  vec3 col = mix(HAZE * 2.45, vec3(0.74, 0.85, 1.0) * 2.1, pow(up, 0.8) * 0.9);
  // the sun's own glow, soft and wide
  float s = clamp(dot(rd, SUN_DIR), 0.0, 1.0);
  col += SUN_COL * (pow(s, 8.0) * 0.35 + pow(s, 64.0) * 0.6) * uSun;
  return col;
}

/* light pouring through the opening at the end of the hall */
vec3 beyondPortal(vec3 ro, vec3 rd) {
  vec3 pc = portalCenter();
  // brighter than anything around it: a white core falling off to cyan at the jambs
  float core = exp(-length(cross(rd, normalize(pc - ro))) * 22.0);
  vec3 light = mix(vec3(0.46, 0.76, 1.0) * 2.7, vec3(0.9, 0.97, 1.0) * 3.4, core);
  return light * (0.8 + 0.2 * uPortal);
}

/* where a ray that escapes everything opaque ends up */
vec3 background(vec3 ro, vec3 rd) {
  if (rd.z < 0.0) {
    float tp = (PORTAL_Z - ro.z) / rd.z;
    vec3 pp = ro + rd * tp;
    if (pp.y > 0.0 && archHole(pp.xy - vec2(HALL_X, 0.0), PORTAL_W, ARCH_H) < 0.0) return beyondPortal(ro, rd);
  }
  return sky(rd);
}

/* the haze between the viewer and the surface, lit by both sources */
vec3 applyAtmosphere(vec3 col, vec3 ro, vec3 rd, float t) {
  // exponential height fog: dense along the floor, thinning toward the roofline,
  // so the horizon dissolves instead of ending in a line
  const float a = 0.016;
  const float b = 0.1;
  float ry = abs(rd.y) < 1e-4 ? 1e-4 : rd.y;
  float fog = a * exp(-ro.y * b) * (1.0 - exp(-t * ry * b)) / (ry * b);
  fog = 1.0 - exp(-fog);

  float s = clamp(dot(rd, SUN_DIR), 0.0, 1.0);
  vec3 fogCol = HAZE * 2.4 + SUN_COL * pow(s, 6.0) * 0.4 * uSun;
  col = mix(col, fogCol, fog);

  // the opening lights the haze around it: closest approach of the view ray
  vec3 pc = portalCenter();
  float tc = clamp(dot(pc - ro, rd), 0.0, t);
  float dc = length(ro + rd * tc - pc);
  float near = smoothstep(2.0, 18.0, tc);
  vec3 tint = vec3(0.42, 0.72, 1.0) * 2.35;
  float g = (exp(-dc * 0.2) * 0.7 + exp(-dc * 0.035) * 0.45) * near * uPortal;
  col = mix(col, tint, clamp(g, 0.0, 0.85));
  return col;
}

/* sunlight caught in the haze, broken into shafts by the arches */
vec3 sunShafts(vec3 ro, vec3 rd, float t, int samples) {
  if (samples == 0) return vec3(0.0);
  float tEnd = min(t, 70.0);
  float dt = tEnd / float(samples);
  float jitter = hash12(gl_FragCoord.xy);
  float acc = 0.0;
  for (int i = 0; i < 32; i++) {
    if (i >= samples) break;
    vec3 p = ro + rd * (dt * (float(i) + jitter));
    // is the sun visible from here? a few long hops through the colonnade
    float vis = 1.0;
    float st = 0.2;
    for (int j = 0; j < 7; j++) {
      float h = sdArches(p + SUN_DIR * st);
      vis = min(vis, clamp(h * 3.0, 0.0, 1.0));
      st += max(h, 0.4);
      if (vis < 0.02 || st > 16.0) break;
    }
    acc += vis * exp(-p.y * 0.18);
  }
  acc *= dt;
  float phase = 0.25 + pow(clamp(dot(rd, SUN_DIR), 0.0, 1.0), 4.0) * 1.4;
  return SUN_COL * acc * phase * 0.011 * uSun;
}

/* ---------- materials ---------- */
vec3 floorTone(vec3 p, float t) {
  // large stone slabs — joints barely there, fading with distance
  vec2 g = p.xz / vec2(3.6, 3.6);
  vec2 f = abs(fract(g) - 0.5);
  float w = fwidth(g.x) + fwidth(g.y);
  float joint = 1.0 - smoothstep(0.0, 0.01 + w, 0.5 - max(f.x, f.y));
  joint *= exp(-t * 0.04);
  float tone = 0.87 - joint * 0.09;
  tone -= 0.014 * hash12(floor(g) + 3.1);
  return vec3(tone * 0.99, tone * 0.992, tone);
}

float archJoints(vec3 p, float t) {
  vec3 q = p - vec3(HALL_X, 0.0, 0.0);
  // legs: courses every 1.2 m; crown: the same module measured around the curve
  float mid = ARCH_W + ARCH_T * 0.5;
  float u = q.y < ARCH_H ? q.y / 1.2 : (ARCH_H / 1.2 + atan(q.y - ARCH_H, abs(q.x)) * -mid / 1.2 + 1.5708 * mid / 1.2);
  float w = fwidth(u) + 0.004;
  float line = 1.0 - smoothstep(0.012, 0.012 + w * 1.2, abs(fract(u) - 0.5) * -1.0 + 0.5);
  // a shadow gap where each leg meets the floor
  float plinth = smoothstep(0.1, 0.0, q.y) * 0.08;
  return 1.0 - line * 0.07 * exp(-t * 0.03) - plinth;
}

vec3 lightSurface(vec3 p, vec3 n, vec3 rd, vec3 albedo, float rough, float occ, float sh) {
  vec3 pc = portalCenter();
  vec3 lp = pc - p;
  float ld = length(lp);
  lp /= ld;

  float dif = clamp(dot(n, SUN_DIR), 0.0, 1.0) * sh;
  float skyAmt = clamp(0.6 + 0.4 * n.y, 0.0, 1.0);
  // light bouncing up off the pale floor
  float bounce = clamp(0.4 - 0.4 * n.y, 0.0, 1.0);
  // light bouncing off sunlit surfaces nearby, roughly opposite the sun
  float fill = clamp(dot(n, normalize(vec3(-SUN_DIR.x, 0.0, -SUN_DIR.z))), 0.0, 1.0);

  vec3 hal = normalize(SUN_DIR - rd);
  float spec = pow(clamp(dot(n, hal), 0.0, 1.0), mix(120.0, 10.0, rough)) * dif;
  float fres = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 5.0);

  // the opening lights whatever faces it, falling off with distance
  // a large, soft source: wrap the falloff so side faces catch it too
  float pdif = clamp((dot(n, lp) + 0.45) / 1.45, 0.0, 1.0);
  float patten = 1.0 / (1.0 + ld * ld * 0.012);
  float rim = pow(clamp(1.0 - abs(dot(n, -rd)), 0.0, 1.0), 2.5) * pdif;

  vec3 col = vec3(0.0);
  col += albedo * SUN_COL * dif * 2.3 * uSun;
  col += albedo * vec3(0.84, 0.91, 1.0) * skyAmt * 0.52 * occ * occ;
  col += albedo * vec3(0.97, 0.97, 0.98) * bounce * 0.34 * occ;
  col += albedo * vec3(0.98, 0.97, 0.95) * fill * 0.16 * occ * uSun;
  col += albedo * mix(BLUE, CYAN, 0.5) * pdif * patten * 7.0 * uPortal * (0.4 + 0.6 * occ);
  col += CYAN * rim * patten * 3.2 * uPortal;
  col += SUN_COL * spec * (1.0 - rough) * 2.4 * uSun;
  col += vec3(0.86, 0.92, 1.0) * fres * 0.3 * occ;
  return col;
}

vec3 shadeSimple(vec3 p, vec3 rd, float m) {
  vec3 n = calcNormal(p);
  vec3 albedo = m == MAT_FLOOR ? vec3(0.9) : vec3(0.93, 0.94, 0.95);
  float sh = step(0.0, dot(n, SUN_DIR));
  return lightSurface(p, n, rd, albedo, 0.5, 0.8, sh * 0.8);
}

vec3 render(vec3 ro, vec3 rd, out float depth) {
  int steps = uQuality == 2 ? 150 : (uQuality == 1 ? 110 : 80);
  float tmax = 320.0;
  vec2 hit = march(ro, rd, tmax, steps);
  depth = hit.x < 0.0 ? tmax : hit.x;

  if (hit.x < 0.0) return applyAtmosphere(background(ro, rd), ro, rd, tmax);

  float t = hit.x;
  vec3 p = ro + rd * t;
  vec3 n = calcNormal(p);
  float m = hit.y;

  int shSteps = uQuality == 2 ? 40 : (uQuality == 1 ? 28 : 18);
  float sh = softShadow(p + n * 0.01, SUN_DIR, 9.0, shSteps);
  float occ = ambientOcclusion(p, n);

  vec3 col;
  if (m == MAT_FLOOR) {
    vec3 albedo = floorTone(p, t);
    col = lightSurface(p, n, rd, albedo, 0.4, occ, sh);

    // polished stone: a soft reflection of the room that blurs away with distance
    vec3 rr = reflect(rd, n);
    float fres = 0.04 + 0.96 * pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 5.0);
    vec3 ro2 = p + n * 0.02;
    vec3 refl;
    vec2 rh = march(ro2, rr, 80.0, uQuality == 2 ? 70 : 40);
    if (rh.x > 0.0) {
      refl = shadeSimple(ro2 + rr * rh.x, rr, rh.y);
      refl = applyAtmosphere(refl, ro2, rr, rh.x);
      refl = mix(refl, sky(rr), 1.0 - exp(-rh.x * 0.08));
    } else {
      refl = mix(applyAtmosphere(background(ro2, rr), ro2, rr, 200.0), sky(rr), 0.45);
    }
    col = mix(col, refl, clamp(0.2 + fres * 0.55, 0.0, 0.7));
  } else if (m == MAT_ARCH) {
    // white ceramic panels with a clear glaze; the joints give the eye its scale
    col = lightSurface(p, n, rd, vec3(0.95, 0.952, 0.955) * archJoints(p, t), 0.18, occ, sh);
  } else {
    col = lightSurface(p, n, rd, vec3(0.93, 0.935, 0.94), 0.55, occ, sh);
  }

  return applyAtmosphere(col, ro, rd, t);
}

/* ---------- the curved glass wall, intersected analytically ---------- */
vec4 glassWall(vec3 ro, vec3 rd, float tOpaque) {
  vec2 oc = ro.xz - GLASS_C;
  vec2 d = rd.xz;
  float A = dot(d, d);
  float B = dot(oc, d);
  float C = dot(oc, oc) - GLASS_R * GLASS_R;
  float disc = B * B - A * C;
  if (disc < 0.0) return vec4(0.0);
  float sq = sqrt(disc);
  for (int k = 0; k < 2; k++) {
    float t = (-B + (k == 0 ? -sq : sq)) / A;
    if (t <= 0.0 || t > tOpaque) continue;
    vec3 p = ro + rd * t;
    // only the western sweep of the circle, and only below the roofline
    if (p.y < 0.0 || p.y > GLASS_TOP) continue;
    if (p.x - GLASS_C.x > -20.0 || p.z > 4.0 || p.z < PORTAL_Z) continue;
    vec3 n = normalize(vec3(p.x - GLASS_C.x, 0.0, p.z - GLASS_C.y));
    if (dot(n, rd) > 0.0) n = -n;

    float fres = 0.05 + 0.95 * pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 5.0);
    vec3 rr = reflect(rd, n);
    vec3 refl = sky(rr);
    // the blue opening reflected in the glass
    vec3 pc = portalCenter();
    refl += CYAN * 2.4 * pow(clamp(dot(rr, normalize(pc - p)), 0.0, 1.0), 24.0) * uPortal;

    // brushed-silver mullions every 3 m along the curve, a transom at the spring line
    float arc = atan(p.z - GLASS_C.y, p.x - GLASS_C.x) * GLASS_R;
    float fw = fwidth(arc) + 0.002;
    float mull = 1.0 - smoothstep(0.06, 0.06 + fw * 1.5, abs(fract(arc / 3.0) - 0.5) * 3.0);
    float fwy = fwidth(p.y) + 0.002;
    float tran = 1.0 - smoothstep(0.05, 0.05 + fwy * 1.5, min(abs(p.y - ARCH_H), abs(p.y - 9.4)));
    float cap = smoothstep(GLASS_TOP - 0.35 - fwy, GLASS_TOP - 0.35, p.y);
    float frame = max(max(mull, tran), cap);

    float fog = 1.0 - exp(-t * 0.008);
    // frosted: the room behind is softened toward a cool grey-blue
    vec3 glassCol = vec3(0.86, 0.92, 1.0) * 2.25 + refl * fres * 0.8;
    float alpha = 0.55 + fres * 0.4;
    // the mullions read as fine silhouettes against the bright exterior, with a glint where the sun catches them
    vec3 silver = vec3(0.52, 0.56, 0.62) * 1.35 + SUN_COL * 0.35 * pow(clamp(dot(reflect(rd, n), SUN_DIR), 0.0, 1.0), 6.0);
    glassCol = mix(glassCol, silver, frame);
    alpha = mix(alpha, 0.95, frame);
    glassCol = mix(glassCol, HAZE * 2.4, fog);
    alpha *= 1.0 - fog * 0.6;
    return vec4(glassCol, alpha);
  }
  return vec4(0.0);
}

vec3 tonemap(vec3 c) {
  // extended Reinhard with a white point — keeps bright haze pure white
  const float W = 2.4;
  c = c * (1.0 + c / (W * W)) / (1.0 + c);
  c = pow(clamp(c, 0.0, 1.0), vec3(1.0 / 2.2));
  // cool the shadows a touch, the way daylight fill does
  return mix(c * vec3(0.965, 0.985, 1.025), c, smoothstep(0.55, 0.98, c));
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;

  float cy = cos(uYaw), sy = sin(uYaw);
  vec3 fw = vec3(sy, 0.0, -cy);
  vec3 rt = vec3(cy, 0.0, sy);
  vec3 up = vec3(0.0, 1.0, 0.0);
  vec2 s = (uv - uShift) * uTanHalf;
  vec3 rd = normalize(fw + rt * s.x + up * s.y);
  vec3 ro = uCamPos;

  float depth;
  vec3 col = render(ro, rd, depth);

  vec4 glass = glassWall(ro, rd, depth);
  col = mix(col, glass.rgb, glass.a);

  col += sunShafts(ro, rd, depth, uQuality == 2 ? 24 : (uQuality == 1 ? 14 : 0));

  col = tonemap(col);

  // lift toward white where content needs the floor to itself
  col = mix(col, vec3(1.0), uVeil);

  // dither against banding in the long, soft gradients
  col += (hash12(gl_FragCoord.xy + 7.0) - 0.5) / 255.0;
  fragColor = vec4(col, 1.0);
}
`;
