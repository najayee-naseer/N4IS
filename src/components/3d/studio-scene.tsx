"use client";

import { Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createArchGeometry } from "./arch-geometry";
import { createShadowTexture, createStudioEnvironment } from "./studio-light";
import { BRAND, TIER_SETTINGS, type Tier, type TierSettings } from "./theme";

export type SceneVariant = "hero" | "ambient";

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
   Rig — pointer parallax + scroll depth. Slow, never spinning fast.
   ================================================================== */
function Rig({
  reducedMotion,
  scroll,
  children,
}: {
  reducedMotion: boolean;
  scroll: React.RefObject<number>;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node || reducedMotion) return;
    const damp = 1 - Math.pow(0.001, delta);
    node.rotation.y = THREE.MathUtils.lerp(node.rotation.y, state.pointer.x * 0.17, damp);
    node.rotation.x = THREE.MathUtils.lerp(node.rotation.x, -state.pointer.y * 0.11, damp);
    node.position.y = THREE.MathUtils.lerp(node.position.y, scroll.current * 1.15, damp * 0.6);
    node.position.z = THREE.MathUtils.lerp(node.position.z, -scroll.current * 2.1, damp * 0.6);
  });

  return <group ref={group}>{children}</group>;
}

/* ==================================================================
   Artifact — the N4IS arch in ceramic, chrome and glass
   ================================================================== */
function Artifact({ segments, reducedMotion }: { segments: number; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);

  const geometry = useMemo(() => createArchGeometry({ segments }), [segments]);
  const backGeometry = useMemo(
    () => createArchGeometry({ segments: Math.max(16, segments - 14), thickness: 0.92, depth: 0.34 }),
    [segments],
  );
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 28), [geometry]);

  useEffect(
    () => () => {
      geometry.dispose();
      backGeometry.dispose();
      edges.dispose();
    },
    [geometry, backGeometry, edges],
  );

  useFrame((state) => {
    const node = group.current;
    if (!node || reducedMotion) return;
    const t = state.clock.elapsedTime;
    node.rotation.y = Math.sin(t * 0.13) * 0.3;
    node.rotation.z = Math.sin(t * 0.09) * 0.028;
    node.position.y = Math.sin(t * 0.32) * 0.1;
  });

  return (
    <group ref={group} rotation={[0.1, -0.32, 0]}>
      {/* brushed silver layer — echoes the overlap inside the logo mark */}
      <mesh geometry={backGeometry} position={[-0.44, -0.2, -0.92]} scale={0.9}>
        <meshStandardMaterial color={BRAND.silver} metalness={0.82} roughness={0.26} envMapIntensity={1.9} />
      </mesh>

      {/* primary white ceramic solid */}
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color={BRAND.ceramic}
          metalness={0.04}
          roughness={0.32}
          clearcoat={0.9}
          clearcoatRoughness={0.16}
          envMapIntensity={1}
        />
      </mesh>

      {/* the engineered edge — a thin blue technical line */}
      <lineSegments geometry={edges} scale={1.005}>
        <lineBasicMaterial color={BRAND.accent} transparent opacity={0.4} />
      </lineSegments>

      {/* clear glass shell */}
      <mesh geometry={geometry} scale={1.15}>
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={0.05}
          clearcoat={1}
          transparent
          opacity={0.16}
          envMapIntensity={1.5}
          side={THREE.BackSide}
        />
      </mesh>

      {/* the dot from the logo's "i" — the one saturated element */}
      <mesh position={[1.62, 1.42, 0.5]}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial
          color={BRAND.accentBright}
          emissive={BRAND.accent}
          emissiveIntensity={0.55}
          metalness={0.3}
          roughness={0.22}
        />
      </mesh>
    </group>
  );
}

/* ==================================================================
   Architectural frame — the room the artifact is presented in
   ================================================================== */
function ArchitecturalFrame({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);

  const edges = useMemo(() => {
    const box = new THREE.BoxGeometry(5.6, 5.6, 5.6);
    const geometry = new THREE.EdgesGeometry(box);
    box.dispose();
    return geometry;
  }, []);

  useEffect(() => () => edges.dispose(), [edges]);

  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.022;
  });

  return (
    <group ref={group} rotation={[0, 0.5, 0]}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={BRAND.accent} transparent opacity={0.13} />
      </lineSegments>
    </group>
  );
}

/* ==================================================================
   Chrome ring — one polished element to catch the studio light
   ================================================================== */
function ChromeRing({ reducedMotion }: { reducedMotion: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.z = t * 0.06;
    mesh.current.rotation.x = 1.22 + Math.sin(t * 0.18) * 0.07;
  });

  return (
    <mesh ref={mesh} rotation={[1.22, 0, 0]} position={[0, -0.3, 0]}>
      <torusGeometry args={[3.05, 0.032, 12, 120]} />
      <meshStandardMaterial color={BRAND.chrome} metalness={0.92} roughness={0.14} envMapIntensity={2.2} />
    </mesh>
  );
}

/* ==================================================================
   Glass panels — translucent surfaces floating through the room
   ================================================================== */
function GlassPanels({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);

  const panels = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + 0.6;
        const radius = 3.9 + (i % 3) * 0.85;
        return {
          position: [Math.cos(angle) * radius, ((i * 41) % 100) / 24 - 2, Math.sin(angle) * radius * 0.62] as [number, number, number],
          rotation: [Math.sin(i) * 0.22, -angle + Math.PI / 2, Math.cos(i * 1.7) * 0.16] as [number, number, number],
          size: [1.5 + ((i * 23) % 70) / 60, 2.1 + ((i * 31) % 80) / 55] as [number, number],
          phase: i * 0.9,
          tint: i % 3 === 0 ? BRAND.accentBright : "#ffffff",
        };
      }),
    [count],
  );

  useFrame((state) => {
    const node = group.current;
    if (!node || reducedMotion) return;
    const t = state.clock.elapsedTime;
    node.rotation.y = t * 0.016;
    node.children.forEach((child, index) => {
      child.position.y = panels[index].position[1] + Math.sin(t * 0.3 + panels[index].phase) * 0.16;
    });
  });

  return (
    <group ref={group}>
      {panels.map((panel, index) => (
        <mesh key={index} position={panel.position} rotation={panel.rotation}>
          <planeGeometry args={panel.size} />
          <meshPhysicalMaterial
            color={panel.tint}
            metalness={0}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transparent
            opacity={panel.tint === "#ffffff" ? 0.14 : 0.1}
            envMapIntensity={1.6}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ==================================================================
   Orbits — thin technical paths with travelling nodes
   ================================================================== */
function Orbit({
  radius,
  tilt,
  speed,
  reducedMotion,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  reducedMotion: boolean;
}) {
  const node = useRef<THREE.Mesh>(null);
  const angle = useRef(radius);

  const geometry = useMemo(() => {
    const points: number[] = [];
    const steps = 96;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      points.push(Math.cos(a) * radius, 0, Math.sin(a) * radius);
    }
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return buffer;
  }, [radius]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (!node.current) return;
    if (!reducedMotion) angle.current += delta * speed;
    node.current.position.set(Math.cos(angle.current) * radius, 0, Math.sin(angle.current) * radius);
  });

  return (
    <group rotation={tilt}>
      <line>
        <primitive object={geometry} attach="geometry" />
        <lineBasicMaterial color={BRAND.accent} transparent opacity={0.26} />
      </line>
      <mesh ref={node}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial color={BRAND.accent} />
      </mesh>
    </group>
  );
}

/* ==================================================================
   Fragments — floating glass, chrome and blue geometry
   ================================================================== */
function Fragments({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);

  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        const r = 3.4 + ((i * 37) % 100) / 45;
        return {
          position: [Math.cos(a) * r, ((i * 53) % 100) / 22 - 2.2, Math.sin(a) * r * 0.7] as [number, number, number],
          scale: 0.09 + ((i * 17) % 100) / 850,
          rotation: [a, a * 1.7, a * 0.4] as [number, number, number],
          kind: i % 3,
        };
      }),
    [count],
  );

  useFrame((state) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.026;
  });

  return (
    <group ref={group}>
      {items.map((item, index) => (
        <mesh key={index} position={item.position} rotation={item.rotation} scale={item.scale}>
          <boxGeometry args={[1, 1, 0.22]} />
          {item.kind === 0 ? (
            <meshPhysicalMaterial
              color="#ffffff"
              metalness={0}
              roughness={0.08}
              clearcoat={1}
              transparent
              opacity={0.3}
              envMapIntensity={1.5}
            />
          ) : (
            <meshStandardMaterial
              color={item.kind === 1 ? BRAND.silver : BRAND.accent}
              metalness={item.kind === 1 ? 0.68 : 0.2}
              roughness={item.kind === 1 ? 0.32 : 0.35}
              envMapIntensity={2.1}
              transparent
              opacity={item.kind === 1 ? 0.9 : 0.75}
            />
          )}
        </mesh>
      ))}
    </group>
  );
}

/* ==================================================================
   Particles — tiny blue motes drifting in the light
   ================================================================== */
function Particles({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 2.6 + Math.random() * 6.6;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8.5;
      positions[i * 3 + 2] = Math.sin(a) * r * 0.8;
    }
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return buffer;
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    if (!points.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    points.current.rotation.y = t * 0.018;
    points.current.position.y = Math.sin(t * 0.12) * 0.24;
  });

  return (
    <points ref={points}>
      <primitive object={geometry} attach="geometry" />
      <pointsMaterial size={0.036} color={BRAND.accent} transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ==================================================================
   Contact shadow — a soft ellipse on the studio floor
   ================================================================== */
function ContactShadow({ y = -2.7 }: { y?: number }) {
  const texture = useMemo(() => createShadowTexture(), []);
  useEffect(() => () => texture?.dispose(), [texture]);
  if (!texture) return null;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <planeGeometry args={[8, 5.6]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

/* ==================================================================
   Lighting — bright studio, with a blue key that shifts on scroll
   ================================================================== */
function StudioLighting({ reducedMotion, scroll }: { reducedMotion: boolean; scroll: React.RefObject<number> }) {
  const key = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    const damp = 1 - Math.pow(0.004, delta);
    const t = Math.min(1, scroll.current);
    // the key light swings overhead as the page moves, the cyan rim lifts
    if (key.current) {
      key.current.position.x = THREE.MathUtils.lerp(key.current.position.x, 5 - t * 4.5, damp);
      key.current.position.y = THREE.MathUtils.lerp(key.current.position.y, 7 + t * 2.5, damp);
    }
    if (rim.current) {
      rim.current.intensity = THREE.MathUtils.lerp(rim.current.intensity, 0.9 + t * 0.7, damp);
    }
  });

  return (
    <>
      <hemisphereLight args={["#ffffff", "#e8eff7", 2.1]} />
      <ambientLight intensity={0.8} color="#ffffff" />
      <directionalLight ref={key} position={[5, 7, 6]} intensity={2.1} color="#ffffff" />
      <directionalLight ref={rim} position={[-6, 2, 3]} intensity={0.9} color={BRAND.accentBright} />
      <directionalLight position={[0, -4, 5]} intensity={0.7} color="#ffffff" />
      {/* a broad, soft blue wash that gently illuminates the white ceramic */}
      <pointLight position={[-3.5, 1.5, 4.5]} intensity={22} color={BRAND.accent} distance={20} decay={2} />
      <pointLight position={[4, -2, 3]} intensity={12} color={BRAND.lavender} distance={16} decay={2} />
    </>
  );
}

/* ==================================================================
   Contents
   ================================================================== */
function Contents({
  settings,
  reducedMotion,
  ambient,
}: {
  settings: TierSettings;
  reducedMotion: boolean;
  ambient: boolean;
}) {
  useStudioEnvironment();
  const scroll = useScrollRef(!reducedMotion);

  return (
    <>
      <StudioLighting reducedMotion={reducedMotion} scroll={scroll} />
      <Rig reducedMotion={reducedMotion} scroll={scroll}>
        <group scale={ambient ? 0.52 : 1} position={ambient ? [3.6, -0.4, -5] : [0, 0, 0]}>
          <Artifact segments={settings.segments} reducedMotion={reducedMotion} />
          <ContactShadow />
          <ChromeRing reducedMotion={reducedMotion} />
          {settings.frame ? <ArchitecturalFrame reducedMotion={reducedMotion} /> : null}
          <GlassPanels count={settings.panels} reducedMotion={reducedMotion} />
          {Array.from({ length: settings.rings }, (_, i) => (
            <Orbit
              key={i}
              radius={4.1 + i * 1.35}
              tilt={[1.24 + i * 0.12, i * 0.5, i * -0.24]}
              speed={0.14 - i * 0.035}
              reducedMotion={reducedMotion}
            />
          ))}
          <Fragments count={settings.fragments} reducedMotion={reducedMotion} />
          <Particles count={settings.particles} reducedMotion={reducedMotion} />
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
      camera={{ position: [0, 0, ambient ? 12 : 9.3], fov: 40, near: 0.1, far: 46 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reducedMotion ? "demand" : "always"}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* the room fades to white, never to black */}
      <fog attach="fog" args={["#ffffff", 13, 34]} />
      <Suspense fallback={null}>
        <Contents settings={settings} reducedMotion={reducedMotion} ambient={ambient} />
      </Suspense>
    </Canvas>
  );
}
