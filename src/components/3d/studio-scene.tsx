"use client";

import { Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createArchGeometry } from "./arch-geometry";
import { createShadowTexture, createStudioEnvironment } from "./studio-light";
import { BRAND, TIER_SETTINGS, type Tier, type TierSettings } from "./theme";

export type SceneVariant = "hero" | "ambient" | "return";

/* ==================================================================
   Studio environment — generated once, shared by every material
   ================================================================== */
function useStudioEnvironment() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const texture = createStudioEnvironment(gl);
    if (!texture) return;
    scene.environment = texture;
    return () => {
      scene.environment = null;
      texture.dispose();
    };
  }, [gl, scene]);
}

/** Normalised page scroll, shared by the rig and the lighting. */
function useScrollRef(enabled: boolean) {
  const scroll = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const onScroll = () => {
      scroll.current = window.scrollY / Math.max(window.innerHeight, 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  return scroll;
}

/* ==================================================================
   Rig — the camera drifts through the corridor rather than spinning
   a product. Pointer input nudges position more than rotation, and
   scroll dollies the whole space deeper into the fog.
   ================================================================== */
function Rig({
  reducedMotion,
  scroll,
  depth,
  children,
}: {
  reducedMotion: boolean;
  scroll: React.RefObject<number>;
  depth: number;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node || reducedMotion) return;
    const damp = 1 - Math.pow(0.001, delta);
    const travel = Math.min(1, scroll.current) * (depth * 1.35);
    node.rotation.y = THREE.MathUtils.lerp(node.rotation.y, state.pointer.x * 0.05, damp);
    node.rotation.x = THREE.MathUtils.lerp(node.rotation.x, -state.pointer.y * 0.035, damp);
    node.position.x = THREE.MathUtils.lerp(node.position.x, state.pointer.x * 0.3, damp * 0.7);
    node.position.y = THREE.MathUtils.lerp(node.position.y, -state.pointer.y * 0.14, damp * 0.7);
    node.position.z = THREE.MathUtils.lerp(node.position.z, travel, damp * 0.6);
  });

  return <group ref={group}>{children}</group>;
}

/* ==================================================================
   Portal — one arch of the corridor, derived from the logo's "n".
   The nearest is a solid, engineered ceramic form; every arch behind
   it thins into glass and fog, the way real architecture recedes.
   ================================================================== */
function Portal({
  index,
  segments,
  reducedMotion,
}: {
  index: number;
  segments: number;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const near = index === 0;
  const z = -index * 3.4;

  const geometry = useMemo(
    () => createArchGeometry({ segments: Math.max(16, segments - index * 8), depth: near ? 0.72 : 0.46 }),
    [segments, index, near],
  );
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 28), [geometry]);

  useEffect(
    () => () => {
      geometry.dispose();
      edges.dispose();
    },
    [geometry, edges],
  );

  useFrame((state) => {
    const node = group.current;
    if (!node || reducedMotion) return;
    const t = state.clock.elapsedTime;
    node.rotation.z = Math.sin(t * 0.05 + index * 1.4) * (near ? 0.014 : 0.008);
    node.position.y = Math.sin(t * 0.14 + index * 1.1) * 0.05;
  });

  const fade = Math.max(0.08, 0.6 - index * 0.15);

  return (
    <group ref={group} position={[index % 2 === 0 ? 0.12 : -0.16, 0, z]} scale={1 - index * 0.055}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color={near ? BRAND.ceramic : BRAND.mist}
          metalness={near ? 0.04 : 0.08}
          roughness={near ? 0.3 : 0.42}
          clearcoat={near ? 0.9 : 0.35}
          clearcoatRoughness={0.18}
          transparent={!near}
          opacity={near ? 1 : fade}
          envMapIntensity={near ? 1.05 : 0.65}
        />
      </mesh>
      <lineSegments geometry={edges} scale={1.006}>
        <lineBasicMaterial color={BRAND.accent} transparent opacity={near ? 0.4 : fade * 0.55} />
      </lineSegments>
      {near ? (
        <mesh geometry={geometry} scale={1.14}>
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0}
            roughness={0.05}
            clearcoat={1}
            transparent
            opacity={0.14}
            envMapIntensity={1.4}
            side={THREE.BackSide}
          />
        </mesh>
      ) : null}
    </group>
  );
}

/* ==================================================================
   Corridor — a sequence of arches receding into the fog, with the
   logo's dot as a beacon at the far end. Architecture, not an object.
   ================================================================== */
function Corridor({ depth, segments, reducedMotion }: { depth: number; segments: number; reducedMotion: boolean }) {
  const beacon = useRef<THREE.Mesh>(null);
  const beaconZ = -(depth - 1) * 3.4 - 0.4;

  useFrame((state) => {
    if (!beacon.current || reducedMotion) return;
    const pulse = 0.65 + Math.sin(state.clock.elapsedTime * 0.9) * 0.2;
    (beacon.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
  });

  return (
    <>
      {Array.from({ length: depth }, (_, i) => (
        <Portal key={i} index={i} segments={segments} reducedMotion={reducedMotion} />
      ))}
      <mesh ref={beacon} position={[0.1, 0.7, beaconZ]}>
        <sphereGeometry args={[0.15, 20, 20]} />
        <meshStandardMaterial
          color={BRAND.accentBright}
          emissive={BRAND.accent}
          emissiveIntensity={0.7}
          metalness={0.25}
          roughness={0.2}
        />
      </mesh>
      <pointLight position={[0.1, 0.7, beaconZ]} intensity={9} color={BRAND.accentBright} distance={7} decay={2} />
    </>
  );
}

/* ==================================================================
   Side panels — large, slow glass surfaces flanking the corridor,
   standing in for walls rather than debris orbiting a product.
   ================================================================== */
function SidePanels({ count, depth, reducedMotion }: { count: number; depth: number; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);

  const panels = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const side = i % 2 === 0 ? 1 : -1;
        return {
          position: [side * (2.5 + (i % 2) * 0.35), -0.35 + ((i * 37) % 100) / 140, -((i + 0.7) / count) * depth * 3.3] as [
            number,
            number,
            number,
          ],
          rotation: [0, side * 0.4, 0] as [number, number, number],
          size: [2.1, 3.2] as [number, number],
          phase: i * 1.1,
        };
      }),
    [count, depth],
  );

  useFrame((state) => {
    const node = group.current;
    if (!node || reducedMotion) return;
    const t = state.clock.elapsedTime;
    node.children.forEach((child, i) => {
      child.position.y = panels[i].position[1] + Math.sin(t * 0.2 + panels[i].phase) * 0.12;
    });
  });

  return (
    <group ref={group}>
      {panels.map((panel, i) => (
        <mesh key={i} position={panel.position} rotation={panel.rotation}>
          <planeGeometry args={panel.size} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0}
            roughness={0.08}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transparent
            opacity={0.1}
            envMapIntensity={1.4}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ==================================================================
   Energy stream — thin blue motes travelling the length of the
   corridor, toward camera: the "blue energy" moving through the space.
   ================================================================== */
function EnergyStream({ count, depth, reducedMotion }: { count: number; depth: number; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const span = depth * 3.4 + 2.4;

  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        offset: (i / count) * span,
        x: (i % 2 === 0 ? 1 : -1) * (0.58 + (i % 3) * 0.06),
        y: -0.2 + Math.sin(i * 1.7) * 0.3,
      })),
    [count, span],
  );

  useFrame((state) => {
    const node = group.current;
    if (!node) return;
    const speed = reducedMotion ? 0 : 1.1;
    node.children.forEach((child, i) => {
      const item = items[i];
      const z = (((state.clock.elapsedTime * speed + item.offset) % span) - span) + 1.6;
      child.position.set(item.x, item.y, z);
    });
  });

  return (
    <group ref={group}>
      {items.map((item, i) => (
        <mesh key={i} position={[item.x, item.y, -item.offset]}>
          <sphereGeometry args={[0.026, 8, 8]} />
          <meshBasicMaterial color={BRAND.accentBright} transparent opacity={0.75} />
        </mesh>
      ))}
    </group>
  );
}

/* ==================================================================
   Particles — tiny motes drifting close to camera, the near layer
   of depth in front of the architecture.
   ================================================================== */
function Particles({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 1.4 + Math.random() * 5.2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6.5;
      positions[i * 3 + 2] = Math.random() * -12 + 3;
    }
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return buffer;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    if (!points.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    points.current.rotation.y = t * 0.01;
    points.current.position.y = Math.sin(t * 0.1) * 0.2;
  });

  return (
    <points ref={points}>
      <primitive object={geometry} attach="geometry" />
      <pointsMaterial size={0.034} color={BRAND.accent} transparent opacity={0.38} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ==================================================================
   Contact shadow — a soft ellipse on the floor of the corridor
   ================================================================== */
function ContactShadow({ y = -2.6 }: { y?: number }) {
  const texture = useMemo(() => createShadowTexture(), []);
  useEffect(() => () => texture?.dispose(), [texture]);
  if (!texture) return null;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, -2]}>
      <planeGeometry args={[9, 14]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

/* ==================================================================
   Lighting — bright studio, with a blue key that shifts on scroll
   ================================================================== */
function StudioLighting({
  reducedMotion,
  scroll,
  boost = false,
}: {
  reducedMotion: boolean;
  scroll: React.RefObject<number>;
  boost?: boolean;
}) {
  const key = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    const damp = 1 - Math.pow(0.004, delta);
    const t = Math.min(1, scroll.current);
    if (key.current) {
      key.current.position.x = THREE.MathUtils.lerp(key.current.position.x, 5 - t * 4.5, damp);
      key.current.position.y = THREE.MathUtils.lerp(key.current.position.y, 7 + t * 2.5, damp);
    }
    if (rim.current) {
      rim.current.intensity = THREE.MathUtils.lerp(rim.current.intensity, (boost ? 1.3 : 0.9) + t * 0.7, damp);
    }
  });

  return (
    <>
      <hemisphereLight args={["#ffffff", "#e8eff7", 2.1]} />
      <ambientLight intensity={0.75} color="#ffffff" />
      <directionalLight ref={key} position={[5, 7, 6]} intensity={2.1} color="#ffffff" />
      <directionalLight ref={rim} position={[-6, 2, 3]} intensity={0.9} color={BRAND.accentBright} />
      <directionalLight position={[0, -4, 5]} intensity={0.7} color="#ffffff" />
      <pointLight position={[-3, 1.5, 2]} intensity={boost ? 26 : 16} color={BRAND.accent} distance={17} decay={2} />
      <pointLight position={[2.5, -1.5, -3]} intensity={boost ? 15 : 9} color={BRAND.lavender} distance={14} decay={2} />
    </>
  );
}

/* ==================================================================
   Contents
   ================================================================== */
/** Framing per device tier and mode — mobile pushes the corridor back and off
 * to the side so it reads as atmosphere behind the type, not a collision with
 * it. "return" mirrors the hero framing and starts deeper in the corridor, as
 * if the visitor is now looking back at the portal from further inside. */
const FRAMING: Record<"hero" | "return", Record<Tier, { scale: number; position: [number, number, number] }>> = {
  hero: {
    mobile: { scale: 0.6, position: [1.5, -0.1, -2.4] },
    tablet: { scale: 0.66, position: [1.5, -0.2, -1.8] },
    desktop: { scale: 1, position: [0.55, -0.35, 0] },
  },
  return: {
    mobile: { scale: 0.56, position: [-1.4, -0.05, -3.6] },
    tablet: { scale: 0.64, position: [-1.35, -0.15, -3.1] },
    desktop: { scale: 0.92, position: [-0.7, -0.3, -2.6] },
  },
};

function Contents({
  settings,
  tier,
  reducedMotion,
  variant,
}: {
  settings: TierSettings;
  tier: Tier;
  reducedMotion: boolean;
  variant: SceneVariant;
}) {
  useStudioEnvironment();
  const scroll = useScrollRef(!reducedMotion);
  const ambient = variant === "ambient";
  const boost = variant === "return";
  const framing = FRAMING[variant === "return" ? "return" : "hero"][tier];

  return (
    <>
      <StudioLighting reducedMotion={reducedMotion} scroll={scroll} boost={boost} />
      <Rig reducedMotion={reducedMotion} scroll={scroll} depth={settings.depth}>
        <group scale={ambient ? 0.46 : framing.scale} position={ambient ? [3.4, -0.2, -1.5] : framing.position}>
          <Corridor depth={settings.depth} segments={settings.segments} reducedMotion={reducedMotion} />
          <SidePanels count={settings.panels} depth={settings.depth} reducedMotion={reducedMotion} />
          <EnergyStream count={settings.streamNodes} depth={settings.depth} reducedMotion={reducedMotion} />
          <Particles count={settings.particles} reducedMotion={reducedMotion} />
          <ContactShadow />
        </group>
      </Rig>
    </>
  );
}

/* ==================================================================
   Scene — one canvas per page
   ================================================================== */
export default function StudioScene({
  tier,
  reducedMotion,
  variant = "hero",
}: {
  tier: Tier;
  reducedMotion: boolean;
  variant?: SceneVariant;
}) {
  const settings = TIER_SETTINGS[tier];
  const ambient = variant === "ambient";

  return (
    <Canvas
      dpr={[1, settings.dpr]}
      camera={{ position: [0, 0.35, ambient ? 11.5 : 8.6], fov: 42, near: 0.1, far: 52 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reducedMotion ? "demand" : "always"}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* the corridor fades to white, never to black */}
      <fog attach="fog" args={["#fbfdff", 9, 27]} />
      <Suspense fallback={null}>
        <Contents settings={settings} tier={tier} reducedMotion={reducedMotion} variant={variant} />
      </Suspense>
    </Canvas>
  );
}
