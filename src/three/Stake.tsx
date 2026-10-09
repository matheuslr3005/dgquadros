type StakeProps = {
  position: [number, number, number];
  tilt?: number;
};

export const Stake = ({ position, tilt = 0 }: StakeProps) => (
  <group position={position} rotation={[0, 0, tilt]}>
    <mesh position={[0, 0.45, 0]} castShadow>
      <boxGeometry args={[0.06, 0.9, 0.06]} />
      <meshStandardMaterial color="#e8dcc0" roughness={0.8} />
    </mesh>
    <mesh position={[0.17, 0.78, 0]} castShadow>
      <boxGeometry args={[0.34, 0.2, 0.02]} />
      <meshStandardMaterial color="#f5b700" roughness={0.6} emissive="#f5b700" emissiveIntensity={0.25} />
    </mesh>
  </group>
);
