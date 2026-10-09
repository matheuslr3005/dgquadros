import { Component, Suspense } from "react";
import type { MutableRefObject, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { hasWebGL, isCoarsePointer, isSmallScreen } from "../lib/env";

export type SceneCanvasProps = {
  active: boolean;
  children: ReactNode;
  camera?: { position: [number, number, number]; fov?: number };
  eventSource?: MutableRefObject<HTMLElement>;
  fallback?: ReactNode;
  className?: string;
};

type BoundaryState = { failed: boolean };

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, BoundaryState> {
  override state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const DefaultFallback = () => <div className="canvas-fallback">Visualização 3D indisponível</div>;

export const SceneCanvas = ({
  active,
  children,
  camera = { position: [8, 5, 10], fov: 35 },
  eventSource,
  fallback = <DefaultFallback />,
  className,
}: SceneCanvasProps) => {
  if (!hasWebGL()) return <>{fallback}</>;

  const maxDpr = isSmallScreen() || isCoarsePointer() ? 1.5 : 1.8;

  return (
    <SceneBoundary fallback={fallback}>
      <Canvas
        className={className}
        shadows
        dpr={[1, maxDpr]}
        frameloop={active ? "always" : "never"}
        camera={camera}
        eventSource={eventSource}
        eventPrefix={eventSource ? "client" : undefined}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </SceneBoundary>
  );
};
