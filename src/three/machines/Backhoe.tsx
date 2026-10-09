import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Shape } from "three";
import type { Group } from "three";
import { paint, paintDark, steel } from "../materials";
import { Beam, BrandPlate, Bucket, Cabin, Wheel } from "../parts";

type BackhoeProps = {
  idle?: boolean;
  wheelSpinRef?: MutableRefObject<number>;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

export const Backhoe = ({
  idle = true,
  wheelSpinRef,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: BackhoeProps) => {
  const loaderArm = useRef<Group>(null);
  const loaderBucket = useRef<Group>(null);
  const hoeSwing = useRef<Group>(null);
  const hoeBoom = useRef<Group>(null);
  const hoeStick = useRef<Group>(null);
  const hoeBucket = useRef<Group>(null);

  const frontBucketProfile = useMemo(() => {
    const s = new Shape();
    s.moveTo(0, 0);
    s.lineTo(0.95, 0.04);
    s.lineTo(0.98, 0.1);
    s.lineTo(0.3, 0.2);
    s.lineTo(-0.2, 0.95);
    s.lineTo(-0.34, 0.9);
    s.lineTo(-0.2, 0.15);
    s.lineTo(0, 0);
    return s;
  }, []);

  useFrame(({ clock }) => {
    if (!idle) return;
    const t = clock.elapsedTime;
    if (loaderArm.current) loaderArm.current.rotation.z = -0.35 + Math.sin(t * 0.7) * 0.28;
    if (loaderBucket.current) loaderBucket.current.rotation.z = 0.2 + Math.sin(t * 0.7 + 1.2) * 0.3;
    if (hoeSwing.current) hoeSwing.current.rotation.y = Math.sin(t * 0.45) * 0.5;
    if (hoeBoom.current) hoeBoom.current.rotation.z = 0.7 + Math.sin(t * 0.9) * 0.18;
    if (hoeStick.current) hoeStick.current.rotation.z = -1.25 + Math.sin(t * 0.9 + 0.9) * 0.35;
    if (hoeBucket.current) hoeBucket.current.rotation.z = -0.4 + Math.sin(t * 0.9 + 1.8) * 0.5;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* wheels */}
      <Wheel radius={0.92} width={0.6} position={[-0.75, 0.92, 1.0]} spinRef={wheelSpinRef} />
      <Wheel radius={0.92} width={0.6} position={[-0.75, 0.92, -1.0]} spinRef={wheelSpinRef} />
      <Wheel radius={0.62} width={0.5} position={[1.7, 0.62, 0.95]} spinRef={wheelSpinRef} />
      <Wheel radius={0.62} width={0.5} position={[1.7, 0.62, -0.95]} spinRef={wheelSpinRef} />

      {/* chassis + body */}
      <RoundedBox args={[3.7, 0.5, 1.5]} radius={0.06} smoothness={3} position={[0.2, 1.0, 0]} material={paintDark} castShadow receiveShadow />
      <RoundedBox args={[1.5, 0.85, 1.28]} radius={0.16} smoothness={4} position={[1.3, 1.65, 0]} material={paint} castShadow />
      <mesh position={[2.06, 1.62, 0]} material={paintDark}>
        <boxGeometry args={[0.05, 0.6, 0.95]} />
      </mesh>
      <RoundedBox args={[1.6, 0.4, 1.35]} radius={0.08} smoothness={3} position={[-0.55, 1.4, 0]} material={paint} castShadow />
      {/* fenders */}
      {[1.0, -1.0].map((z) => (
        <RoundedBox key={z} args={[2.0, 0.12, 0.78]} radius={0.05} smoothness={2} position={[-0.75, 1.88, z]} material={paint} castShadow />
      ))}
      <Cabin size={[1.5, 1.35, 1.4]} position={[-0.5, 2.38, 0]} />
      <BrandPlate position={[1.25, 1.7, 0.642]} width={0.9} />
      <BrandPlate position={[1.25, 1.7, -0.642]} rotation={[0, Math.PI, 0]} width={0.9} />
      <mesh position={[1.7, 2.35, 0.4]} material={paintDark} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.55, 12]} />
      </mesh>

      {/* front loader */}
      <group position={[0.9, 1.45, 0]}>
        <group ref={loaderArm}>
          {[0.82, -0.82].map((z) => (
            <group key={z} position={[0, 0, z]}>
              <Beam from={[0, 0]} to={[2.1, -0.55]} thickness={0.22} depth={0.2} />
            </group>
          ))}
          <group position={[2.1, -0.55, 0]}>
            <group ref={loaderBucket}>
              <mesh position={[0, -0.3, -1.1]} material={paint} castShadow receiveShadow>
                <extrudeGeometry args={[frontBucketProfile, { depth: 2.2, bevelEnabled: false }]} />
              </mesh>
              <mesh position={[0.35, -0.28, 0]} material={steel}>
                <boxGeometry args={[0.8, 0.05, 2.2]} />
              </mesh>
              {[1.1, -1.1].map((z) => (
                <mesh key={z} position={[-0.1, 0.05, z]} material={paintDark}>
                  <boxGeometry args={[0.7, 0.8, 0.06]} />
                </mesh>
              ))}
            </group>
          </group>
        </group>
      </group>

      {/* rear hoe */}
      <group position={[-1.95, 1.3, 0]} rotation={[0, Math.PI, 0]}>
        <mesh material={paintDark} castShadow>
          <boxGeometry args={[0.5, 0.8, 0.7]} />
        </mesh>
        <group ref={hoeSwing}>
          <group position={[0.1, 0.3, 0]}>
            <group ref={hoeBoom} rotation={[0, 0, 0.7]}>
              <Beam from={[0, 0]} to={[1.1, 1.1]} thickness={0.3} depth={0.3} />
              <Beam from={[1.1, 1.1]} to={[2.3, 0.9]} thickness={0.26} depth={0.3} />
              <group position={[2.3, 0.9, 0]}>
                <group ref={hoeStick} rotation={[0, 0, -1.25]}>
                  <Beam from={[0, 0]} to={[1.45, 0]} thickness={0.22} depth={0.24} />
                  <group position={[1.45, 0, 0]}>
                    <group ref={hoeBucket} rotation={[0, 0, -0.4]} scale={0.7}>
                      <Bucket width={0.7} radius={0.42} teeth={4} />
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
      {/* stabilizers */}
      {[1.15, -1.15].map((z) => (
        <group key={z} position={[-2.15, 1.0, z]}>
          <mesh position={[0, -0.05, 0]} material={paintDark} castShadow>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
          </mesh>
          <mesh position={[0, -0.55, 0]} material={steel} castShadow>
            <boxGeometry args={[0.16, 0.8, 0.16]} />
          </mesh>
          <mesh position={[0, -0.95, 0]} material={paintDark} castShadow>
            <boxGeometry args={[0.55, 0.08, 0.5]} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
