import * as THREE from "three";

/**
 * The N4IS artifact.
 *
 * The official logo's most distinctive form is the arch of its lowercase "n".
 * This builds that silhouette as a real extruded solid so the hero object is
 * derived from the brand rather than being a generic primitive. The logo
 * artwork itself is never modified — this is an abstract structure that echoes
 * its geometry.
 */
export function createArchGeometry({
  width = 2.9,
  height = 2.55,
  thickness = 0.82,
  depth = 0.72,
  segments = 48,
}: {
  width?: number;
  height?: number;
  thickness?: number;
  depth?: number;
  segments?: number;
} = {}) {
  const outer = width / 2;
  const inner = outer - thickness;
  const leg = -height;

  const shape = new THREE.Shape();
  shape.moveTo(-outer, leg);
  shape.lineTo(-outer, 0);
  shape.absarc(0, 0, outer, Math.PI, 0, true);
  shape.lineTo(outer, leg);
  shape.lineTo(inner, leg);
  shape.lineTo(inner, 0);
  shape.absarc(0, 0, inner, 0, Math.PI, false);
  shape.lineTo(-inner, leg);
  shape.lineTo(-outer, leg);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    curveSegments: segments,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 3,
  });

  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}
