import { Environment, Lightformer } from "@react-three/drei";

type StudioProps = {
  shadowSize?: number;
  intensity?: number;
};

/** Lighting rig used by every scene: offline HDR (Lightformers), warm key and a yellow rim. */
export const Studio = ({ shadowSize = 2048, intensity = 1 }: StudioProps) => (
  <>
    <hemisphereLight args={["#fff2d0", "#2a1c10", 0.55 * intensity]} />
    <directionalLight
      position={[6, 10, 5]}
      intensity={2.6 * intensity}
      color="#fff0d2"
      castShadow
      shadow-mapSize={[shadowSize, shadowSize]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.04}
      shadow-camera-near={1}
      shadow-camera-far={40}
      shadow-camera-left={-12}
      shadow-camera-right={12}
      shadow-camera-top={12}
      shadow-camera-bottom={-12}
    />
    <directionalLight position={[-8, 4, -6]} intensity={1.6 * intensity} color="#f5b700" />
    <Environment resolution={256} environmentIntensity={0.9}>
      <Lightformer form="rect" intensity={3} color="#fff4de" position={[0, 6, 4]} scale={[14, 4, 1]} rotation-x={Math.PI / 2.4} />
      <Lightformer form="rect" intensity={2} color="#f5b700" position={[-8, 2, -2]} scale={[8, 3, 1]} rotation-y={Math.PI / 2} />
      <Lightformer form="rect" intensity={1.4} color="#cfe3ff" position={[8, 3, 3]} scale={[6, 3, 1]} rotation-y={-Math.PI / 2} />
      <Lightformer form="ring" intensity={1.2} color="#ffffff" position={[0, 8, -6]} scale={6} />
    </Environment>
  </>
);
