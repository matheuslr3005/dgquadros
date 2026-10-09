import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { BufferGeometry, CylinderGeometry, InstancedMesh, Object3D, Quaternion, Shape, Vector3 } from "three";
import type { Group, Material, Mesh } from "three";
import { chrome, glass, light, paint, paintDark, rubber, steel, trackShoe } from "./materials";

type Vec3 = [number, number, number];

/* ------------------------------------------------------------------ */
/* Beam: a box laid between two points of the XY plane (side profile). */
/* ------------------------------------------------------------------ */

type BeamProps = {
  from: [number, number];
  to: [number, number];
  thickness?: number;
  depth?: number;
  material?: Material;
  radius?: number;
};

export const Beam = ({ from, to, thickness = 0.28, depth = 0.3, material = paint, radius = 0.05 }: BeamProps) => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.hypot(dx, dy);
  return (
    <group position={[from[0], from[1], 0]} rotation={[0, 0, Math.atan2(dy, dx)]}>
      <RoundedBox args={[length + thickness, thickness, depth]} radius={radius} smoothness={3} position={[length / 2, 0, 0]} castShadow receiveShadow material={material} />
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* Wheel                                                               */
/* ------------------------------------------------------------------ */

type WheelProps = {
  radius: number;
  width: number;
  position?: Vec3;
  spinRef?: { current: number };
  rimMaterial?: Material;
  lug?: number;
};

export const Wheel = ({ radius, width, position = [0, 0, 0], spinRef, rimMaterial = paint, lug = 1 }: WheelProps) => {
  const group = useRef<Group>(null);
  const treads = useMemo(() => Array.from({ length: 18 }, (_, i) => (i / 18) * Math.PI * 2), []);

  useFrame(() => {
    if (group.current && spinRef) group.current.rotation.z = spinRef.current / radius;
  });

  return (
    <group position={position}>
      <group ref={group}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow material={rubber}>
          <cylinderGeometry args={[radius, radius, width, 36]} />
        </mesh>
        {treads.map((angle) => (
          <mesh
            key={angle}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
            rotation={[0, 0, angle]}
            material={rubber}
            castShadow
          >
            <boxGeometry args={[radius * 0.12 * lug, radius * 0.18 * lug, width * 0.96]} />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, width / 2 - 0.01]} material={rimMaterial}>
          <cylinderGeometry args={[radius * 0.62, radius * 0.62, 0.04, 28]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -width / 2 + 0.01]} material={rimMaterial}>
          <cylinderGeometry args={[radius * 0.62, radius * 0.62, 0.04, 28]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, width / 2 + 0.01]} material={chrome}>
          <cylinderGeometry args={[radius * 0.18, radius * 0.18, 0.06, 16]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -width / 2 - 0.01]} material={chrome}>
          <cylinderGeometry args={[radius * 0.18, radius * 0.18, 0.06, 16]} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            position={[Math.cos((i / 5) * Math.PI * 2) * radius * 0.38, Math.sin((i / 5) * Math.PI * 2) * radius * 0.38, width / 2 + 0.02]}
            rotation={[Math.PI / 2, 0, 0]}
            material={steel}
          >
            <cylinderGeometry args={[radius * 0.045, radius * 0.045, 0.04, 8]} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* Track: stadium-shaped crawler with moving shoes                     */
/* ------------------------------------------------------------------ */

type TrackProps = {
  length: number;
  height: number;
  width: number;
  position?: Vec3;
  speedRef?: { current: number };
};

const SHOE_COUNT = 64;

export const Track = ({ length, height, width, position = [0, 0, 0], speedRef }: TrackProps) => {
  const instanced = useRef<InstancedMesh>(null);
  const offset = useRef(0);
  const dummy = useMemo(() => new Object3D(), []);
  const r = height / 2;
  const straight = Math.max(length - height, 0.01);
  const perimeter = 2 * straight + 2 * Math.PI * r;

  const place = (travel: number) => {
    const mesh = instanced.current;
    if (!mesh) return;
    for (let i = 0; i < SHOE_COUNT; i += 1) {
      let s = (((i / SHOE_COUNT) * perimeter + travel) % perimeter + perimeter) % perimeter;
      let x: number;
      let y: number;
      let angle: number;
      if (s < straight) {
        x = -straight / 2 + s;
        y = r;
        angle = 0;
      } else if ((s -= straight) < Math.PI * r) {
        const t = s / r;
        x = straight / 2 + Math.sin(t) * r;
        y = Math.cos(t) * r;
        angle = -t;
      } else if ((s -= Math.PI * r) < straight) {
        x = straight / 2 - s;
        y = -r;
        angle = -Math.PI;
      } else {
        s -= straight;
        const t = s / r;
        x = -straight / 2 - Math.sin(t) * r;
        y = -Math.cos(t) * r;
        angle = -Math.PI - t;
      }
      dummy.position.set(x, y, 0);
      dummy.rotation.set(0, 0, angle);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  };

  useEffect(() => {
    place(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    const speed = speedRef?.current ?? 0;
    if (speed === 0) return;
    offset.current += speed * delta;
    place(offset.current);
  });

  const wheelPositions = useMemo(() => {
    const count = Math.max(2, Math.round(straight / 0.55));
    return Array.from({ length: count }, (_, i) => -straight / 2 + (i / (count - 1)) * straight);
  }, [straight]);

  return (
    <group position={position}>
      <instancedMesh ref={instanced} args={[undefined, undefined, SHOE_COUNT]} castShadow receiveShadow material={trackShoe}>
        <boxGeometry args={[(perimeter / SHOE_COUNT) * 0.92, 0.08, width]} />
      </instancedMesh>
      {/* sprocket + idler */}
      {[-straight / 2, straight / 2].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]} material={paintDark} castShadow>
          <cylinderGeometry args={[r * 0.86, r * 0.86, width * 0.84, 24]} />
        </mesh>
      ))}
      {wheelPositions.map((x) => (
        <mesh key={x} position={[x, -r * 0.35, 0]} rotation={[Math.PI / 2, 0, 0]} material={steel}>
          <cylinderGeometry args={[r * 0.4, r * 0.4, width * 0.9, 16]} />
        </mesh>
      ))}
      {/* track frame */}
      <mesh position={[0, 0.02, 0]} material={paintDark} castShadow>
        <boxGeometry args={[straight, r * 0.7, width * 0.7]} />
      </mesh>
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* Hydraulic ram that follows two moving anchors                       */
/* ------------------------------------------------------------------ */

type RamProps = {
  anchorA: React.RefObject<Object3D>;
  anchorB: React.RefObject<Object3D>;
  radius?: number;
};

const worldA = new Vector3();
const worldB = new Vector3();
const UP = new Vector3(0, 1, 0);
const dirVec = new Vector3();
const quat = new Quaternion();

export const Ram = ({ anchorA, anchorB, radius = 0.075 }: RamProps) => {
  const group = useRef<Group>(null);
  const barrel = useRef<Mesh>(null);
  const rod = useRef<Mesh>(null);
  const barrelGeometry = useMemo<BufferGeometry>(() => new CylinderGeometry(1, 1, 1, 14), []);
  const rodGeometry = useMemo<BufferGeometry>(() => new CylinderGeometry(1, 1, 1, 12), []);

  useFrame(() => {
    const a = anchorA.current;
    const b = anchorB.current;
    const g = group.current;
    const parent = g?.parent;
    if (!a || !b || !g || !parent || !barrel.current || !rod.current) return;
    a.getWorldPosition(worldA);
    b.getWorldPosition(worldB);
    parent.worldToLocal(worldA);
    parent.worldToLocal(worldB);
    dirVec.subVectors(worldB, worldA);
    const length = dirVec.length();
    if (length < 0.001) return;
    dirVec.normalize();
    g.position.copy(worldA);
    quat.setFromUnitVectors(UP, dirVec);
    g.quaternion.copy(quat);
    const barrelLength = length * 0.55;
    barrel.current.scale.set(radius * 1.35, barrelLength, radius * 1.35);
    barrel.current.position.set(0, barrelLength / 2, 0);
    const rodLength = length * 0.55;
    rod.current.scale.set(radius * 0.7, rodLength, radius * 0.7);
    rod.current.position.set(0, length - rodLength / 2, 0);
  });

  return (
    <group ref={group}>
      <mesh ref={barrel} geometry={barrelGeometry} material={paintDark} castShadow />
      <mesh ref={rod} geometry={rodGeometry} material={chrome} castShadow />
    </group>
  );
};

/* ------------------------------------------------------------------ */
/* Cabin (generic boxy operator cabin with windows)                    */
/* ------------------------------------------------------------------ */

type CabinProps = {
  size?: Vec3;
  position?: Vec3;
  frontFacing?: 1 | -1;
};

export const Cabin = ({ size = [1.1, 1.15, 1.0], position = [0, 0, 0], frontFacing = 1 }: CabinProps) => {
  const [w, h, d] = size;
  return (
    <group position={position}>
      <RoundedBox args={[w, h, d]} radius={0.07} smoothness={3} castShadow receiveShadow material={paint} />
      {/* windows */}
      <mesh position={[(w / 2 - 0.005) * frontFacing, h * 0.08, 0]} rotation={[0, (Math.PI / 2) * frontFacing, 0]} material={glass}>
        <planeGeometry args={[d * 0.82, h * 0.6]} />
      </mesh>
      <mesh position={[0, h * 0.08, d / 2 + 0.005]} material={glass}>
        <planeGeometry args={[w * 0.78, h * 0.6]} />
      </mesh>
      <mesh position={[0, h * 0.08, -d / 2 - 0.005]} rotation={[0, Math.PI, 0]} material={glass}>
        <planeGeometry args={[w * 0.78, h * 0.6]} />
      </mesh>
      <mesh position={[(-w / 2 + 0.005) * frontFacing, h * 0.08, 0]} rotation={[0, (-Math.PI / 2) * frontFacing, 0]} material={glass}>
        <planeGeometry args={[d * 0.82, h * 0.6]} />
      </mesh>
      {/* roof */}
      <RoundedBox args={[w * 1.12, 0.08, d * 1.12]} radius={0.03} smoothness={2} position={[0.04 * frontFacing, h / 2 + 0.04, 0]} material={paintDark} castShadow />
      <mesh position={[(w / 2) * frontFacing, h / 2 - 0.02, 0.28]} material={light}>
        <boxGeometry args={[0.08, 0.06, 0.18]} />
      </mesh>
      <mesh position={[(w / 2) * frontFacing, h / 2 - 0.02, -0.28]} material={light}>
        <boxGeometry args={[0.08, 0.06, 0.18]} />
      </mesh>
    </group>
  );
};

/** Brand plate on the machine side (acts as the "decal" from the plan). */
export const BrandPlate = ({ position, rotation = [0, 0, 0], width = 0.9 }: { position: Vec3; rotation?: Vec3; width?: number }) => (
  <group position={position} rotation={rotation}>
    <mesh material={paintDark}>
      <planeGeometry args={[width, width * 0.3]} />
    </mesh>
    <mesh position={[-width * 0.36, 0, 0.002]} material={paint}>
      <planeGeometry args={[width * 0.18, width * 0.18]} />
    </mesh>
    <mesh position={[width * 0.1, width * 0.04, 0.002]} material={paint}>
      <planeGeometry args={[width * 0.5, width * 0.05]} />
    </mesh>
    <mesh position={[width * 0.1, -width * 0.05, 0.002]} material={paint}>
      <planeGeometry args={[width * 0.34, width * 0.025]} />
    </mesh>
  </group>
);

/* ------------------------------------------------------------------ */
/* Bucket: scoop with its opening toward -y and teeth toward +x        */
/* ------------------------------------------------------------------ */

type BucketProps = {
  width?: number;
  radius?: number;
  teeth?: number;
};

export const Bucket = ({ width = 0.9, radius = 0.47, teeth = 5 }: BucketProps) => {
  const shapes = useMemo(() => {
    const shell = new Shape();
    shell.absarc(0, 0, radius, 0, Math.PI, false);
    shell.absarc(0, 0, radius - 0.07, Math.PI, 0, true);
    const plate = new Shape();
    plate.absarc(0, 0, radius, 0, Math.PI, false);
    plate.lineTo(radius, 0);
    return { shell, plate };
  }, [radius]);

  const toothOffsets = useMemo(
    () => Array.from({ length: teeth }, (_, i) => (teeth === 1 ? 0 : (i / (teeth - 1) - 0.5) * (width - 0.14))),
    [teeth, width],
  );

  return (
    <group>
      <group position={[radius - 0.02, 0, 0]}>
        <mesh position={[0, 0, -width / 2]} material={paint} castShadow receiveShadow>
          <extrudeGeometry args={[shapes.shell, { depth: width, bevelEnabled: false, curveSegments: 24 }]} />
        </mesh>
        <mesh position={[0, 0, width / 2]} material={paintDark} castShadow>
          <extrudeGeometry args={[shapes.plate, { depth: 0.05, bevelEnabled: false, curveSegments: 24 }]} />
        </mesh>
        <mesh position={[0, 0, -width / 2 - 0.05]} material={paintDark} castShadow>
          <extrudeGeometry args={[shapes.plate, { depth: 0.05, bevelEnabled: false, curveSegments: 24 }]} />
        </mesh>
      </group>
      {toothOffsets.map((z) => (
        <mesh key={z} position={[radius * 2 + 0.06, 0, z]} rotation={[0, 0, -Math.PI / 2]} material={steel} castShadow>
          <coneGeometry args={[0.07, 0.22, 4]} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={steel}>
        <cylinderGeometry args={[0.08, 0.08, width * 0.68, 12]} />
      </mesh>
    </group>
  );
};
