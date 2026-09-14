import * as THREE from "three";

/**
 * A procedural studio environment.
 *
 * Polished silver and glass need something to reflect, and a bright white
 * showroom is exactly a soft gradient dome. Building it from a canvas keeps the
 * scene self-contained — no HDR download, no external request, a few kilobytes
 * of GPU memory — while giving metal and glass real highlights instead of the
 * black they would otherwise render as.
 */
export function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture | null {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#ffffff"); // ceiling light
  gradient.addColorStop(0.42, "#f2f7fd");
  gradient.addColorStop(0.62, "#e4edf7");
  gradient.addColorStop(1, "#cdd9e6"); // floor bounce
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // a soft blue key panel, the way a studio would gel one light
  const key = context.createRadialGradient(22, 30, 1, 22, 30, 26);
  key.addColorStop(0, "rgba(0, 166, 255, 0.55)");
  key.addColorStop(1, "rgba(0, 166, 255, 0)");
  context.fillStyle = key;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromEquirectangular(texture);
  texture.dispose();
  pmrem.dispose();

  return target.texture;
}

/** A soft round shadow so the artifact reads as sitting in a real room. */
export function createShadowTexture(): THREE.Texture | null {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(17, 19, 24, 0.34)");
  gradient.addColorStop(0.45, "rgba(17, 19, 24, 0.14)");
  gradient.addColorStop(1, "rgba(17, 19, 24, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
