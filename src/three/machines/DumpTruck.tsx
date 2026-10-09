import { useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group, Object3D } from "three";
import { glass, light, paint, paintDark, steel } from "../materials";
import { BrandPlate, Ram, Wheel } from "../parts";

type DumpTruckProps = {
  idle?: boolean;
  wheelSpinRef?: MutableRefObject<number>;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

const BED_LENGTH = 5.0;
const BED_WIDTH = 2.3;

export const DumpTruck = ({
  idle = true,
  wheelSpinRef,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: DumpTruckProps) => {
  const bed = useRef<Group>(null);
  const ramTop = useRef<Object3D>(null);
  const ramLow = useRef<Object3D>(null);

  useFrame(({ clock }) => {
    if (!bed.current) return;
    const cycle = idle ? Math.max(0, Math.sin(clock.elapsedTime * 0.55)) : 0;
    bed.current.rotation.z = cycle * 0.62;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* chassis rails */}
      {[0.55, -0.55].map((z) => (
        <mesh key={z} position={[-0.3, 1.0, z]} material={paintDark} castShadow receiveShadow>
          <boxGeometry args={[6.4, 0.28, 0.24]} />
        </mesh>
      ))}
      {[-0.4, 1.0, 2.2].map((x) => (
        <mesh key={x} position={[x, 1.0, 0]} material={paintDark}>
          <boxGeometry args={[0.2, 0.2, 1.1]} />
        </mesh>
      ))}

      {/* wheels: front single, rear tandem dual */}
      {[1, -1].map((side) => (
        <group key={side}>
          <Wheel radius={0.66} width={0.38} position={[2.5, 0.66, side * 1.06]} lug={0.45} spinRef={wheelSpinRef} />
          {[-0.95, -2.2].map((x) => (
            <group key={x}>
              <Wheel radius={0.66} width={0.36} position={[x, 0.66, side * 1.0]} lug={0.45} spinRef={wheelSpinRef} />
              <Wheel radius={0.66} width={0.36} position={[x, 0.66, side * 1.42]} lug={0.45} spinRef={wheelSpinRef} />
            </group>
          ))}
        </group>
      ))}
      {[2.5, -0.95, -2.2].map((x) => (
        <mesh key={x} position={[x, 0.66, 0]} rotation={[Math.PI / 2, 0, 0]} material={steel}>
          <cylinderGeometry args={[0.1, 0.1, 2.2, 12]} />
        </mesh>
      ))}

      {/* cab-over */}
      <RoundedBox args={[1.7, 2.0, 2.15]} radius={0.16} smoothness={4} position={[2.55, 2.22, 0]} material={paint} castShadow receiveShadow />
      <mesh position={[3.41, 2.55, 0]} rotation={[0, Math.PI / 2, 0]} material={glass}>
        <planeGeometry args={[1.8, 0.85]} />
      </mesh>
      {[0.7, -0.7].map((z) => (
        <mesh key={z} position={[2.8, 2.55, z > 0 ? 1.083 : -1.083]} rotation={[0, z > 0 ? 0 : Math.PI, 0]} material={glass}>
          <planeGeometry args={[1.0, 0.8]} />
        </mesh>
      ))}
      <mesh position={[3.41, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} material={paintDark}>
        <planeGeometry args={[1.5, 0.55]} />
      </mesh>
      {[0.75, -0.75].map((z) => (
        <mesh key={z} position={[3.42, 1.5, z]} material={light}>
          <boxGeometry args={[0.05, 0.18, 0.28]} />
        </mesh>
      ))}
      <RoundedBox args={[0.35, 0.3, 2.3]} radius={0.06} smoothness={2} position={[3.35, 1.1, 0]} material={paintDark} castShadow />
      <BrandPlate position={[2.45, 1.85, 1.083]} width={0.9} />
      <BrandPlate position={[2.45, 1.85, -1.083]} rotation={[0, Math.PI, 0]} width={0.9} />
      <mesh position={[1.62, 2.8, 0.85]} material={paintDark} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 1.5, 10]} />
      </mesh>

      {/* tipper bed */}
      <group position={[-3.15, 1.2, 0]}>
        <group ref={bed}>
          <mesh position={[BED_LENGTH / 2, 0.06, 0]} material={paintDark} castShadow receiveShadow>
            <boxGeometry args={[BED_LENGTH, 0.12, BED_WIDTH]} />
          </mesh>
          {[1, -1].map((side) => (
            <group key={side}>
              <mesh position={[BED_LENGTH / 2, 0.75, side * (BED_WIDTH / 2 - 0.05)]} material={paint} castShadow receiveShadow>
                <boxGeometry args={[BED_LENGTH, 1.35, 0.1]} />
              </mesh>
              {Array.from({ length: 6 }, (_, i) => (
                <mesh key={i} position={[0.5 + i * 0.8, 0.75, side * (BED_WIDTH / 2 + 0.02)]} material={paintDark}>
                  <boxGeometry args={[0.12, 1.35, 0.08]} />
                </mesh>
              ))}
              <mesh position={[BED_LENGTH / 2, 1.45, side * (BED_WIDTH / 2 - 0.05)]} material={steel}>
                <boxGeometry args={[BED_LENGTH, 0.08, 0.16]} />
              </mesh>
            </group>
          ))}
          <mesh position={[BED_LENGTH - 0.05, 1.05, 0]} material={paint} castShadow>
            <boxGeometry args={[0.1, 2.0, BED_WIDTH]} />
          </mesh>
          <mesh position={[BED_LENGTH + 0.1, 2.05, 0]} material={paintDark} castShadow>
            <boxGeometry args={[0.5, 0.2, BED_WIDTH]} />
          </mesh>
          <object3D ref={ramLow} position={[3.0, 0, 0]} />
        </group>
      </group>
      <object3D ref={ramTop} position={[0.1, 1.0, 0]} />
      <Ram anchorA={ramTop} anchorB={ramLow} radius={0.11} />

      {/* rear hinge + mudflaps */}
      <mesh position={[-3.15, 1.15, 0]} rotation={[Math.PI / 2, 0, 0]} material={steel}>
        <cylinderGeometry args={[0.09, 0.09, 2.2, 12]} />
      </mesh>
    </group>
  );
};
