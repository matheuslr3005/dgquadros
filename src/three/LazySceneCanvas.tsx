import { lazy, Suspense } from "react";
import type { SceneCanvasProps } from "./SceneCanvas";

const SceneCanvas = lazy(() => import("./SceneCanvas").then((module) => ({ default: module.SceneCanvas })));

/** Keeps three.js out of the initial bundle: the canvas chunk loads while the preloader runs. */
export const LazySceneCanvas = (props: SceneCanvasProps) => (
  <Suspense fallback={null}>
    <SceneCanvas {...props} />
  </Suspense>
);
