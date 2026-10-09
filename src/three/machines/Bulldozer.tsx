import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Shape } from "three";
import type { Group, Object3D } from "three";
import { paint, paintDark, steel } from "../materials";
import { Beam, BrandPlate, Cabin, Ram, Track } from "../parts";

type BulldozerProps = {
  trackSpeedRef?: MutableRefObject<number>;
  bladeLiftRef?: MutableRefObject<number>;
  idle?: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

const BLADE_WIDTH = 3.3;

export const Bulldozer = ({
  trackSpeedRef,
  bladeLiftRef,
  idle = false,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: BulldozerProps) => {
  const blade = useRef<Group>(null);
  const ramTopA = useRef<Object3D>(null);
  const ramTopB = useRef<Object3D>(null);
  const ramLowA = useRef<Object3D>(null);
  const ramLowB = useRef<Object3D>(null);

  const profile = useMemo(() => {
    const s = new Shape();
    s.moveTo(0.12, 0);
    s.quadraticCurveTo(-0.1, 0.35, -0.42, 1.12);
    s.lineTo(-0.58, 1.1);
    s.quadraticCurveTo(-0.28, 0.4, -0.12, -0.02);
    s.lineTo(0.12, 0);
    return s;
  }, []);

  useFrame(({ clock }) => {
    if (!blade.current) return;
    const lift = bladeLiftRef ? bladeLiftRef.current : idle ? Math.sin(clock.elapsedTime * 0.9) * 0.14 + 0.1 : 0;
    blade.current.position.y = 0.28 + lift;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Track length={3.9} height={1.0} width={0.6} position={[-0.1, 0.5, 1.12]} speedRef={trackSpeedRef} />
      <Track length={3.9} height={1.0} width={0.6} position={[-0.1, 0.5, -1.12]} speedRef={trackSpeedRef} />

      {/* body */}
      <RoundedBox args={[3.0, 0.7, 1.7]} radius={0.08} smoothness={3} position={[-0.1, 1.05, 0]} material={paintDark} castShadow receiveShadow />
      <RoundedBox args={[2.1, 0.62, 1.55]} radius={0.1} smoothness={3} position={[-0.4, 1.55, 0]} material={paint} castShadow receiveShadow />
      {/* hood */}
      <RoundedBox args={[1.5, 0.78, 1.25]} radius={0.14} smoothness={4} position={[0.55, 1.78, 0]} material={paint} castShadow />
      <mesh position={[1.31, 1.78, 0]} material={paintDark}>
        <boxGeometry args={[0.05, 0.62, 1.0]} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[1.34, 1.55 + i * 0.12, 0]} material={steel}>
          <boxGeometry args={[0.03, 0.03, 0.95]} />
        </mesh>
      ))}
      <mesh position={[0.15, 2.45, 0.5]} material={paintDark} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 0.7, 12]} />
      </mesh>
      <Cabin size={[1.25, 1.3, 1.4]} position={[-0.95, 2.35, 0]} />
      <BrandPlate position={[0.45, 1.8, 0.628]} width={0.95} />
      <BrandPlate position={[0.45, 1.8, -0.628]} rotation={[0, Math.PI, 0]} width={0.95} />
      {/* drawbar */}
      <mesh position={[-1.75, 0.85, 0]} material={paintDark} castShadow>
        <boxGeometry args={[0.4, 0.3, 1.2]} />
      </mesh>

      {/* push arms */}
      {[0.78, -0.78].map((z) => (
        <group key={z} position={[0, 0, z]}>
          <Beam from={[0.2, 0.75]} to={[2.55, 0.5]} thickness={0.22} depth={0.2} material={paintDark} />
        </group>
      ))}

      {/* blade */}
      <group ref={blade} position={[2.7, 0.28, 0]}>
        <mesh position={[0, 0, -BLADE_WIDTH / 2]} material={paint} castShadow receiveShadow>
          <extrudeGeometry args={[profile, { depth: BLADE_WIDTH, bevelEnabled: false, curveSegments: 14 }]} />
        </mesh>
        <mesh position={[0.1, 0.03, 0]} material={steel} castShadow>
          <boxGeometry args={[0.12, 0.08, BLADE_WIDTH + 0.1]} />
        </mesh>
        <mesh position={[-0.52, 1.12, 0]} material={paintDark} castShadow>
          <boxGeometry args={[0.1, 0.1, BLADE_WIDTH]} />
        </mesh>
        <object3D ref={ramLowA} position={[-0.3, 0.75, 0.78]} />
        <object3D ref={ramLowB} position={[-0.3, 0.75, -0.78]} />
      </group>
      <object3D ref={ramTopA} position={[1.15, 1.45, 0.78]} />
      <object3D ref={ramTopB} position={[1.15, 1.45, -0.78]} />
      <Ram anchorA={ramTopA} anchorB={ramLowA} radius={0.075} />
      <Ram anchorA={ramTopB} anchorB={ramLowB} radius={0.075} />
    </group>
  );
};
