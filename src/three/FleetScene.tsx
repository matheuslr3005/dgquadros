import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import type { Group } from "three";
import { gsap } from "../lib/gsap";
import { FLEET } from "../data/fleet";
import type { MachineId } from "../data/fleet";
import { Studio } from "./Studio";
import { Backhoe } from "./machines/Backhoe";
import { Bulldozer } from "./machines/Bulldozer";
import { DumpTruck } from "./machines/DumpTruck";
import { Excavator, EXCAVATOR_REST_POSE } from "./machines/Excavator";
import type { ExcavatorPose } from "./machines/Excavator";
import { Roller } from "./machines/Roller";

type FleetSceneProps = {
  machine: MachineId;
};

const DEFAULT_TRACK_SPEED = 0;

const ExcavatorShowcase = () => {
  const pose = useRef<ExcavatorPose>({ ...EXCAVATOR_REST_POSE });
  const speed = useRef(DEFAULT_TRACK_SPEED);

  useEffect(() => {
    const timeline = gsap.timeline({ repeat: -1, defaults: { duration: 1.6, ease: "sine.inOut" } });
    timeline
      .to(pose.current, { swing: 0.5, boom: 0.35, stick: -1.0, bucket: -0.2 })
      .to(pose.current, { swing: 0.2, boom: 0.0, stick: -1.55, bucket: -1.25 })
      .to(pose.current, { swing: -0.7, boom: 0.45, stick: -1.5, bucket: -1.3 })
      .to(pose.current, { swing: -0.7, boom: 0.3, stick: -1.1, bucket: 0.1 }, "+=0.2")
      .to(pose.current, { ...EXCAVATOR_REST_POSE });
    return () => {
      timeline.kill();
    };
  }, []);

  return <Excavator poseRef={pose} trackSpeedRef={speed} position={[-0.6, 0, 0]} />;
};

const renderMachine = (machine: MachineId, speedRef: MutableRefObject<number>) => {
  switch (machine) {
    case "retroescavadeira":
      return <Backhoe />;
    case "escavadeira":
      return <ExcavatorShowcase />;
    case "trator":
      return <Bulldozer trackSpeedRef={speedRef} idle />;
    case "rolo":
      return <Roller />;
    case "cacamba":
      return <DumpTruck />;
  }
};

export const FleetScene = ({ machine }: FleetSceneProps) => {
  const stage = useRef<Group>(null);
  const trackSpeed = useRef(0);
  const item = FLEET.find((entry) => entry.id === machine) ?? FLEET[0];

  useEffect(() => {
    const node = stage.current;
    if (!node || !item) return;
    node.rotation.y = item.heading - 1.2;
    node.scale.setScalar(0.001);
    const tween = gsap.to(node.scale, { x: item.scale, y: item.scale, z: item.scale, duration: 0.9, ease: "back.out(1.6)" });
    const spin = gsap.to(node.rotation, { y: item.heading, duration: 1.2, ease: "power3.out" });
    return () => {
      tween.kill();
      spin.kill();
    };
  }, [item]);

  useFrame(() => {
    trackSpeed.current = machine === "trator" ? 1.2 : 0;
  });

  return (
    <>
      <Studio shadowSize={1024} />
      {/* turntable */}
      <mesh position={[0, -0.14, 0]} receiveShadow>
        <cylinderGeometry args={[4.6, 4.8, 0.28, 72]} />
        <meshStandardMaterial color="#26272a" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.35, 4.5, 96]} />
        <meshBasicMaterial color="#f5b700" />
      </mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4.35, 72]} />
        <meshStandardMaterial color="#323438" roughness={0.9} metalness={0.2} />
      </mesh>
      {Array.from({ length: 24 }, (_, i) => (
        <mesh key={i} position={[Math.cos((i / 24) * Math.PI * 2) * 4.7, 0.01, Math.sin((i / 24) * Math.PI * 2) * 4.7]} rotation={[-Math.PI / 2, 0, (i / 24) * Math.PI * 2]}>
          <planeGeometry args={[0.16, 0.05]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#f5b700" : "#1c1d1f"} />
        </mesh>
      ))}
      <ContactShadows position={[0, 0.02, 0]} opacity={0.5} scale={14} blur={2.4} far={4} />

      <group ref={stage}>{renderMachine(machine, trackSpeed)}</group>

      <OrbitControls
        makeDefault
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4.2}
        maxPolarAngle={Math.PI / 2.15}
        autoRotate
        autoRotateSpeed={0.9}
        target={[0, 1.4, 0]}
        rotateSpeed={0.7}
        enableDamping
      />
    </>
  );
};
