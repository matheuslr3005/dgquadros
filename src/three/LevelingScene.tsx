import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { BufferAttribute, Color, PlaneGeometry, Vector3 } from "three";
import type { Group, Mesh } from "three";
import { Dust } from "./Dust";
import type { DustHandle } from "./Dust";
import { Bulldozer } from "./machines/Bulldozer";
import { Stake } from "./Stake";
import { Studio } from "./Studio";

type LevelingSceneProps = {
  /** 0 → untouched terrain, 1 → fully leveled. */
  progressRef: MutableRefObject<number>;
  /** Written every frame with the leveled share of the terrain (0..1). */
  levelRef: MutableRefObject<number>;
  compact?: boolean;
};

const WIDTH = 22;
const DEPTH = 10;
const SEG_X = 176;
const SEG_Z = 80;
const BLADE_REACH = 2.75;
const START_X = -14;
const END_X = 8.4;

const hash = (x: number, y: number): number => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const smooth = (t: number): number => t * t * (3 - 2 * t);
const noise = (x: number, y: number): number => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
};
const fbm = (x: number, y: number): number => noise(x, y) * 0.55 + noise(x * 2.1, y * 2.1) * 0.3 + noise(x * 4.3, y * 4.3) * 0.15;
const smoothstep = (edge0: number, edge1: number, value: number): number => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

const ROUGH_LOW = new Color("#4d3118");
const ROUGH_HIGH = new Color("#96673a");
const LEVELED = new Color("#d6c5a2");
const LEVELED_TRACK = new Color("#bfa982");
const scratch = new Color();
const scratchLeveled = new Color();

export const LevelingScene = ({ progressRef, levelRef, compact = false }: LevelingSceneProps) => {
  const terrain = useRef<Mesh>(null);
  const dozer = useRef<Group>(null);
  const laser = useRef<Mesh>(null);
  const dust = useRef<DustHandle>(null);
  const trackSpeed = useRef(0);
  const bladeLift = useRef(-0.08);
  const smoothProgress = useRef(0);
  const lastX = useRef(START_X);
  const lastEdge = useRef(Number.NaN);
  const dustTimer = useRef(0);
  const bladeWorld = useMemo(() => new Vector3(), []);
  const { camera, pointer } = useThree();

  const { geometry, rough } = useMemo(() => {
    const plane = new PlaneGeometry(WIDTH, DEPTH, SEG_X, SEG_Z);
    plane.rotateX(-Math.PI / 2);
    const position = plane.getAttribute("position");
    const heights = new Float32Array(position.count);
    for (let i = 0; i < position.count; i += 1) {
      const x = position.getX(i);
      const z = position.getZ(i);
      const base = (fbm(x * 0.42 + 4, z * 0.42 + 9) - 0.5) * 1.7;
      const lumps = (noise(x * 1.9, z * 1.9) - 0.5) * 0.36;
      heights[i] = Math.max(0.18, base + lumps + 0.55);
    }
    plane.setAttribute("color", new BufferAttribute(new Float32Array(position.count * 3), 3));
    return { geometry: plane, rough: heights };
  }, []);

  const applyTerrain = (edge: number) => {
    const position = geometry.getAttribute("position") as BufferAttribute;
    const color = geometry.getAttribute("color") as BufferAttribute;
    for (let i = 0; i < position.count; i += 1) {
      const x = position.getX(i);
      const z = position.getZ(i);
      const flat = smoothstep(edge + 1.1, edge - 0.15, x);
      const berm = Math.exp(-Math.pow(x - (edge + 0.55), 2) / 0.32) * smoothstep(2.1, 1.5, Math.abs(z)) * 0.55 * (1 - flat);
      const base = rough[i] ?? 0;
      const height = base * (1 - flat) + berm;
      position.setY(i, height);

      const shade = Math.min(1, Math.max(0, base / 1.3));
      scratch.copy(ROUGH_LOW).lerp(ROUGH_HIGH, shade);
      const grain = (hash(x * 9.1, z * 9.1) - 0.5) * 0.08;
      scratch.offsetHSL(0, 0, grain);
      const stripe = 0.5 + 0.5 * Math.sin(z * 11 + hash(Math.floor(z * 4), 3) * 2);
      scratchLeveled.copy(LEVELED).lerp(LEVELED_TRACK, smoothstep(0.55, 1, stripe) * 0.55);
      scratch.lerp(scratchLeveled, flat);
      color.setXYZ(i, scratch.r, scratch.g, scratch.b);
    }
    position.needsUpdate = true;
    color.needsUpdate = true;
    geometry.computeVertexNormals();
  };

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    smoothProgress.current += (progressRef.current - smoothProgress.current) * Math.min(1, dt * 5);
    const p = smoothProgress.current;
    const x = START_X + (END_X - START_X) * p;
    const edge = x + BLADE_REACH;

    if (dozer.current) dozer.current.position.set(x, 0, 0);

    const velocity = (x - lastX.current) / Math.max(dt, 0.001);
    lastX.current = x;
    trackSpeed.current += (velocity - trackSpeed.current) * Math.min(1, dt * 10);

    if (Math.abs(edge - lastEdge.current) > 0.0015 || Number.isNaN(lastEdge.current)) {
      lastEdge.current = edge;
      applyTerrain(edge);
    }
    levelRef.current = Math.min(1, Math.max(0, (edge + WIDTH / 2 - 1) / WIDTH));

    if (laser.current) {
      const length = Math.max(0.001, edge + WIDTH / 2 - 0.4);
      laser.current.scale.x = length;
      laser.current.position.x = -WIDTH / 2 + length / 2;
    }

    dustTimer.current -= dt;
    if (Math.abs(velocity) > 0.4 && dustTimer.current <= 0 && dust.current) {
      bladeWorld.set(edge + 0.1, 0.25, (Math.random() - 0.5) * 3);
      dust.current.burst(bladeWorld, 5, 0.55);
      dustTimer.current = 0.06;
    }

    const targetX = pointer.x * 1.6;
    const targetY = (compact ? 14.5 : 12.6) + pointer.y * 0.6;
    camera.position.x += (targetX - camera.position.x) * Math.min(1, dt * 2);
    camera.position.y += (targetY - camera.position.y) * Math.min(1, dt * 2);
    camera.position.z = compact ? 15 : 10.8;
    camera.lookAt(0, 0, compact ? -0.5 : -1.7);
  });

  return (
    <>
      <fog attach="fog" args={["#f2efe8", 22, 40]} />
      <Studio shadowSize={compact ? 1024 : 2048} intensity={1.05} />

      <mesh ref={terrain} geometry={geometry} receiveShadow>
        <meshStandardMaterial vertexColors flatShading roughness={1} />
      </mesh>
      {/* terrain base so the cut edge reads as solid ground */}
      <mesh position={[0, -0.97, 0]} receiveShadow>
        <boxGeometry args={[WIDTH, 1.8, DEPTH]} />
        <meshStandardMaterial color="#3b2615" roughness={1} />
      </mesh>

      {/* laser level line */}
      <mesh ref={laser} position={[-WIDTH / 2, 0.95, -DEPTH / 2 + 0.2]}>
        <boxGeometry args={[1, 0.05, 0.05]} />
        <meshBasicMaterial color="#f5b700" />
      </mesh>
      <Stake position={[-WIDTH / 2 + 0.3, 0, -DEPTH / 2 + 0.2]} />
      <Stake position={[0, 0, -DEPTH / 2 + 0.2]} tilt={0.04} />
      <Stake position={[WIDTH / 2 - 0.3, 0, -DEPTH / 2 + 0.2]} tilt={-0.05} />

      <group ref={dozer} position={[START_X, 0, 0]}>
        <Bulldozer trackSpeedRef={trackSpeed} bladeLiftRef={bladeLift} />
      </group>
      <Dust ref={dust} max={160} color="#e2cfa8" />
    </>
  );
};
