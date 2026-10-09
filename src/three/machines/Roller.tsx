import { useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group } from "three";
import { chrome, drumSteel, paint, paintDark } from "../materials";
import { BrandPlate, Wheel } from "../parts";

type RollerProps = {
  idle?: boolean;
  spinRef?: MutableRefObject<number>;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

const DRUM_RADIUS = 0.98;

export const Roller = ({ idle = true, spinRef, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: RollerProps) => {
  const drum = useRef<Group>(null);
  const drumRig = useRef<Group>(null);
  const internalSpin = useRef(0);

  useFrame(({ clock }, delta) => {
    const speed = spinRef ? spinRef.current : idle ? 1.4 : 0;
    internalSpin.current += speed * delta;
    if (drum.current) drum.current.rotation.z = -internalSpin.current / DRUM_RADIUS;
    if (drumRig.current) {
      const shake = idle ? Math.sin(clock.elapsedTime * 55) * 0.006 : 0;
      drumRig.current.position.y = DRUM_RADIUS + shake;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* drum */}
      <group ref={drumRig} position={[1.55, DRUM_RADIUS, 0]}>
        <group ref={drum}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={drumSteel} castShadow receiveShadow>
            <cylinderGeometry args={[DRUM_RADIUS, DRUM_RADIUS, 2.15, 56]} />
          </mesh>
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={i} rotation={[0, 0, (i / 8) * Math.PI * 2]} position={[0, 0, 0]} material={chrome}>
              <boxGeometry args={[DRUM_RADIUS * 2.002, 0.02, 2.0]} />
            </mesh>
          ))}
          {[1.08, -1.08].map((z) => (
            <mesh key={z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} material={paint} castShadow>
              <cylinderGeometry args={[0.62, 0.62, 0.06, 32]} />
            </mesh>
          ))}
        </group>
        {[1.2, -1.2].map((z) => (
          <group key={z} position={[0, 0, z]}>
            <RoundedBox args={[0.35, 1.6, 0.18]} radius={0.04} smoothness={2} position={[-0.25, 0.4, 0]} material={paint} castShadow />
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={paintDark}>
              <cylinderGeometry args={[0.18, 0.18, 0.2, 16]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* front frame bridging to rear */}
      <RoundedBox args={[1.4, 0.9, 1.3]} radius={0.1} smoothness={3} position={[0.3, 1.5, 0]} material={paint} castShadow />

      {/* rear body */}
      <RoundedBox args={[2.4, 1.1, 1.8]} radius={0.12} smoothness={4} position={[-1.1, 1.5, 0]} material={paint} castShadow receiveShadow />
      <RoundedBox args={[1.2, 0.7, 1.55]} radius={0.14} smoothness={4} position={[-1.7, 2.25, 0]} material={paint} castShadow />
      <mesh position={[-2.1, 2.9, 0.5]} material={paintDark} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 0.6, 12]} />
      </mesh>
      <RoundedBox args={[0.3, 0.9, 1.7]} radius={0.1} smoothness={3} position={[-2.3, 1.45, 0]} material={paintDark} castShadow />
      <BrandPlate position={[-1.1, 1.55, 0.912]} width={1.1} />
      <BrandPlate position={[-1.1, 1.55, -0.912]} rotation={[0, Math.PI, 0]} width={1.1} />

      {/* open canopy (ROPS) */}
      {[
        [0.0, 0.55],
        [0.0, -0.55],
        [-1.0, 0.55],
        [-1.0, -0.55],
      ].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[(x ?? 0) - 0.15, 2.95, z]} material={paintDark} castShadow>
          <boxGeometry args={[0.08, 1.2, 0.08]} />
        </mesh>
      ))}
      <RoundedBox args={[1.4, 0.08, 1.4]} radius={0.03} smoothness={2} position={[-0.65, 3.6, 0]} material={paintDark} castShadow />
      {/* seat + steering */}
      <RoundedBox args={[0.45, 0.14, 0.5]} radius={0.04} smoothness={2} position={[-0.7, 2.25, 0]} material={paintDark} />
      <RoundedBox args={[0.1, 0.55, 0.5]} radius={0.04} smoothness={2} position={[-0.95, 2.52, 0]} material={paintDark} />
      <mesh position={[-0.1, 2.5, 0]} rotation={[0, 0, 0.4]} material={paintDark}>
        <cylinderGeometry args={[0.04, 0.04, 0.55, 8]} />
      </mesh>
      <mesh position={[0.0, 2.75, 0]} rotation={[0, 0, 0.4 + Math.PI / 2]} material={paintDark}>
        <torusGeometry args={[0.18, 0.025, 8, 20]} />
      </mesh>

      {/* rear wheels */}
      <Wheel radius={0.82} width={0.75} position={[-1.35, 0.82, 1.02]} spinRef={spinRef} />
      <Wheel radius={0.82} width={0.75} position={[-1.35, 0.82, -1.02]} spinRef={spinRef} />
    </group>
  );
};
