import { useRef } from "react";
import type { MutableRefObject, RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group, Object3D } from "three";
import { paint, paintDark, steel } from "../materials";
import { Beam, BrandPlate, Bucket, Cabin, Ram, Track } from "../parts";

export type ExcavatorPose = {
  swing: number;
  boom: number;
  stick: number;
  bucket: number;
};

export const EXCAVATOR_REST_POSE: ExcavatorPose = { swing: 0, boom: 0.05, stick: -1.25, bucket: -0.35 };

type ExcavatorProps = {
  poseRef: MutableRefObject<ExcavatorPose>;
  trackSpeedRef?: MutableRefObject<number>;
  tipRef?: RefObject<Object3D>;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

const BOOM_PIVOT: [number, number, number] = [1.0, 0.62, -0.2];
const BOOM_END: [number, number] = [3.05, 0.2];
const STICK_LENGTH = 1.8;

export const Excavator = ({
  poseRef,
  trackSpeedRef,
  tipRef,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: ExcavatorProps) => {
  const upper = useRef<Group>(null);
  const boom = useRef<Group>(null);
  const stick = useRef<Group>(null);
  const bucket = useRef<Group>(null);

  const boomRamTopA = useRef<Object3D>(null);
  const boomRamTopB = useRef<Object3D>(null);
  const boomRamLowA = useRef<Object3D>(null);
  const boomRamLowB = useRef<Object3D>(null);
  const stickRamTop = useRef<Object3D>(null);
  const stickRamLow = useRef<Object3D>(null);
  const bucketRamTop = useRef<Object3D>(null);
  const bucketRamLow = useRef<Object3D>(null);

  useFrame(() => {
    const pose = poseRef.current;
    if (upper.current) upper.current.rotation.y = pose.swing;
    if (boom.current) boom.current.rotation.z = pose.boom;
    if (stick.current) stick.current.rotation.z = pose.stick;
    if (bucket.current) bucket.current.rotation.z = pose.bucket;
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* undercarriage */}
      <Track length={3.5} height={0.78} width={0.62} position={[0, 0.39, 0.98]} speedRef={trackSpeedRef} />
      <Track length={3.5} height={0.78} width={0.62} position={[0, 0.39, -0.98]} speedRef={trackSpeedRef} />
      <RoundedBox args={[2.2, 0.42, 1.5]} radius={0.06} smoothness={3} position={[0, 0.62, 0]} material={paintDark} castShadow receiveShadow />
      <mesh position={[0, 0.88, 0]} material={steel} castShadow>
        <cylinderGeometry args={[0.95, 0.95, 0.1, 40]} />
      </mesh>

      {/* upper structure */}
      <group ref={upper} position={[0, 0.93, 0]}>
        <RoundedBox args={[2.25, 0.62, 1.75]} radius={0.08} smoothness={3} position={[-0.3, 0.36, 0]} material={paint} castShadow receiveShadow />
        {/* engine hood */}
        <RoundedBox args={[1.2, 0.42, 1.55]} radius={0.1} smoothness={4} position={[-0.75, 0.88, 0]} material={paint} castShadow />
        {/* counterweight */}
        <RoundedBox args={[0.85, 0.95, 1.72]} radius={0.16} smoothness={4} position={[-1.55, 0.52, 0]} material={paintDark} castShadow />
        <mesh position={[-0.7, 1.35, -0.55]} material={paintDark} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.55, 12]} />
        </mesh>
        {/* grille slits */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[-0.75 - 0.2 + i * 0.13, 1.1, 0.0]} material={paintDark}>
            <boxGeometry args={[0.04, 0.02, 1.2]} />
          </mesh>
        ))}
        <Cabin size={[1.05, 1.2, 0.85]} position={[0.42, 0.97, 0.46]} />
        <BrandPlate position={[-0.35, 0.4, 0.882]} width={1.0} />
        <BrandPlate position={[-0.35, 0.4, -0.882]} rotation={[0, Math.PI, 0]} width={1.0} />

        {/* boom */}
        <group position={BOOM_PIVOT}>
          <group ref={boom}>
            <Beam from={[0, 0]} to={[1.45, 0.78]} thickness={0.34} depth={0.34} />
            <Beam from={[1.45, 0.78]} to={BOOM_END} thickness={0.28} depth={0.34} />
            <mesh rotation={[Math.PI / 2, 0, 0]} material={steel} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.5, 16]} />
            </mesh>
            <object3D ref={boomRamLowA} position={[0.95, 0.12, 0.17]} />
            <object3D ref={boomRamLowB} position={[0.95, 0.12, -0.17]} />
            <object3D ref={stickRamTop} position={[1.45, 0.95, 0]} />
            <mesh position={[1.45, 0.88, 0]} material={paint} castShadow>
              <boxGeometry args={[0.18, 0.2, 0.3]} />
            </mesh>

            {/* stick */}
            <group position={[BOOM_END[0], BOOM_END[1], 0]}>
              <group ref={stick}>
                <Beam from={[0, 0]} to={[STICK_LENGTH, 0]} thickness={0.26} depth={0.28} />
                <mesh position={[0.35, -0.22, 0]} material={paint} castShadow>
                  <boxGeometry args={[0.3, 0.22, 0.3]} />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]} material={steel} castShadow>
                  <cylinderGeometry args={[0.1, 0.1, 0.44, 14]} />
                </mesh>
                <object3D ref={stickRamLow} position={[0.4, -0.32, 0]} />
                <object3D ref={bucketRamTop} position={[1.1, -0.28, 0]} />

                {/* bucket */}
                <group position={[STICK_LENGTH, 0, 0]}>
                  <group ref={bucket}>
                    <Bucket width={1.0} radius={0.52} teeth={5} />
                    <object3D ref={bucketRamLow} position={[0.1, 0.42, 0]} />
                    <mesh rotation={[Math.PI / 2, 0, 0]} material={steel}>
                      <cylinderGeometry args={[0.08, 0.08, 0.6, 12]} />
                    </mesh>
                    <object3D ref={tipRef} position={[1.2, 0, 0]} />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>

        <object3D ref={boomRamTopA} position={[0.8, 0.15, -0.03]} />
        <object3D ref={boomRamTopB} position={[0.8, 0.15, -0.37]} />
      </group>

      {/* hydraulic rams (children of the machine root so they live in world-ish space) */}
      <RamGroup
        pairs={[
          [boomRamTopA, boomRamLowA],
          [boomRamTopB, boomRamLowB],
          [stickRamTop, stickRamLow],
          [bucketRamTop, bucketRamLow],
        ]}
      />
    </group>
  );
};

type RamGroupProps = {
  pairs: [RefObject<Object3D>, RefObject<Object3D>][];
};

const RamGroup = ({ pairs }: RamGroupProps) => (
  <>
    {pairs.map(([a, b], index) => (
      <Ram key={index} anchorA={a} anchorB={b} radius={index < 2 ? 0.085 : 0.075} />
    ))}
  </>
);
