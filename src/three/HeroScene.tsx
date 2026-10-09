import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { IcosahedronGeometry, Object3D, Vector3 } from "three";
import type { BufferGeometry, Group } from "three";
import { gsap } from "../lib/gsap";
import { prefersReducedMotion } from "../lib/env";
import { Dust } from "./Dust";
import type { DustHandle } from "./Dust";
import { Excavator, EXCAVATOR_REST_POSE } from "./machines/Excavator";
import type { ExcavatorPose } from "./machines/Excavator";
import { soil, soilDark } from "./materials";
import { Stake } from "./Stake";
import { Studio } from "./Studio";

type HeroSceneProps = {
  /** 0 → hero fully visible, 1 → hero scrolled away. */
  scrollRef: MutableRefObject<number>;
  /** Increments every time the user clicks the scene: triggers an extra dig. */
  pokeRef: MutableRefObject<number>;
  compact?: boolean;
};

const MACHINE_POSITION: [number, number, number] = [0.5, 0, 0.4];

const makeMoundGeometry = (seed: number, radius: number): BufferGeometry => {
  const geometry = new IcosahedronGeometry(radius, 2);
  const position = geometry.getAttribute("position");
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const wobble = 1 + Math.sin(x * 3.1 + seed) * 0.09 + Math.cos(z * 2.7 + seed * 2) * 0.09 + Math.sin(y * 5 + seed) * 0.05;
    position.setXYZ(i, x * wobble * 1.25, Math.max(y, -0.02) * wobble * 0.62, z * wobble);
  }
  geometry.computeVertexNormals();
  return geometry;
};

export const HeroScene = ({ scrollRef, pokeRef, compact = false }: HeroSceneProps) => {
  const machine = useRef<Group>(null);
  const pose = useRef<ExcavatorPose>({ ...EXCAVATOR_REST_POSE });
  const target = useRef<ExcavatorPose>({ ...EXCAVATOR_REST_POSE });
  const tip = useRef<Object3D>(null);
  const dust = useRef<DustHandle>(null);
  const trackSpeed = useRef(0);
  const lastPoke = useRef(0);
  const wasLow = useRef(false);
  const cooldown = useRef(0);
  const tipWorld = useMemo(() => new Vector3(), []);
  const { camera, pointer } = useThree();

  const mounds = useMemo(() => ({ main: makeMoundGeometry(1, 1.5), small: makeMoundGeometry(9, 0.7) }), []);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const timeline = gsap.timeline({ repeat: -1, defaults: { duration: reduced ? 0 : 1.5, ease: "sine.inOut" } });
    const t = target.current;
    timeline
      .to(t, { swing: 0.12, boom: 0.2, stick: -0.95, bucket: 0.0 })
      .to(t, { swing: 0.12, boom: -0.02, stick: -1.3, bucket: -0.15 })
      .to(t, { swing: 0.12, boom: -0.08, stick: -1.95, bucket: -1.25, duration: reduced ? 0 : 1.2 })
      .to(t, { swing: 0.12, boom: 0.55, stick: -1.75, bucket: -1.35 })
      .to(t, { swing: -0.95, boom: 0.45, stick: -1.5, bucket: -1.35, duration: reduced ? 0 : 2.0 })
      .to(t, { swing: -0.95, boom: 0.22, stick: -1.2, bucket: 0.15, duration: reduced ? 0 : 0.9 }, "+=0.15")
      .call(() => {
        if (tip.current) {
          tip.current.getWorldPosition(tipWorld);
          dust.current?.burst(tipWorld, 36, 1.1);
        }
      })
      .to(t, { swing: 0.12, boom: 0.2, stick: -0.95, bucket: 0.0, duration: reduced ? 0 : 2.1 }, "+=0.2");
    if (reduced) timeline.pause(0);
    return () => {
      timeline.kill();
    };
  }, [tipWorld]);

  useFrame((_, delta) => {
    const t = target.current;
    const p = pose.current;
    // Smooth follow of the timeline target, plus a light pointer-driven swing.
    const follow = 1 - Math.pow(0.0008, delta);
    p.swing += (t.swing + pointer.x * 0.12 - p.swing) * follow;
    p.boom += (t.boom - p.boom) * follow;
    p.stick += (t.stick - p.stick) * follow;
    p.bucket += (t.bucket - p.bucket) * follow;

    if (pokeRef.current !== lastPoke.current) {
      lastPoke.current = pokeRef.current;
      if (tip.current) {
        tip.current.getWorldPosition(tipWorld);
        dust.current?.burst(tipWorld, 46, 1.4);
      }
    }

    // Dust when the bucket touches the ground.
    cooldown.current -= delta;
    if (tip.current) {
      tip.current.getWorldPosition(tipWorld);
      const low = tipWorld.y < 0.28;
      if (low && !wasLow.current && cooldown.current <= 0) {
        dust.current?.burst(tipWorld, 22, 0.8);
        cooldown.current = 0.8;
      }
      wasLow.current = low;
    }

    const scroll = scrollRef.current;
    if (machine.current) {
      machine.current.rotation.y = 0.28 + scroll * 1.1 + pointer.x * 0.06;
      machine.current.position.y = -scroll * 0.6;
    }
    trackSpeed.current = 0;

    const radius = compact ? 29 : 19;
    const targetX = (compact ? 2.2 : 1.8) + pointer.x * 0.9 - scroll * 3;
    const targetY = (compact ? 6.2 : 5.4) + pointer.y * 0.5 + scroll * 2.2;
    camera.position.x += (targetX - camera.position.x) * Math.min(1, delta * 2.4);
    camera.position.y += (targetY - camera.position.y) * Math.min(1, delta * 2.4);
    camera.position.z = radius - scroll * 1.5;
    camera.lookAt(compact ? 2.3 : 0.4, (compact ? 3.3 : 3.3) - scroll * 0.4, 0);
  });

  return (
    <>
      <fog attach="fog" args={["#1c1d1f", 25, 48]} />
      <Studio shadowSize={compact ? 1024 : 2048} />

      {/* work platform */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <cylinderGeometry args={[9.5, 9.8, 0.6, 72]} />
        <meshStandardMaterial color="#4a3322" roughness={1} />
      </mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[9.5, 72]} />
        <meshStandardMaterial color="#5c3e25" roughness={1} />
      </mesh>
      <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[9.3, 9.5, 120]} />
        <meshBasicMaterial color="#f5b700" />
      </mesh>

      {/* dirt piles */}
      <mesh geometry={mounds.main} material={soil} position={[5.9, 0, 0.5]} castShadow receiveShadow />
      <mesh geometry={mounds.small} material={soilDark} position={[7.4, 0, -1.0]} rotation={[0, 1.2, 0]} castShadow receiveShadow />
      <Stake position={[-3.4, 0, -2.6]} tilt={0.06} />
      <Stake position={[8.2, 0, 2.8]} tilt={0.08} />
      <Stake position={[-1.4, 0, -3.4]} tilt={-0.05} />

      <group ref={machine} position={MACHINE_POSITION}>
        <Excavator poseRef={pose} trackSpeedRef={trackSpeed} tipRef={tip} />
      </group>

      <Dust ref={dust} max={240} color="#c29a66" />
      <Sparkles count={compact ? 24 : 60} scale={[18, 6, 12]} position={[0, 3, 0]} size={3} speed={0.25} opacity={0.7} color="#f5b700" />
    </>
  );
};
