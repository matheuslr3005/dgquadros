import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, NormalBlending, ShaderMaterial } from "three";
import type { Points, Vector3 } from "three";

export type DustHandle = {
  burst: (origin: Vector3, count?: number, power?: number) => void;
};

type DustProps = {
  max?: number;
  color?: string;
  glow?: boolean;
};

const VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  varying float vAlpha;
  uniform float uScale;
  void main() {
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uScale / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT = /* glsl */ `
  varying float vAlpha;
  uniform vec3 uColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

export const Dust = forwardRef<DustHandle, DustProps>(({ max = 220, color = "#b98a55", glow = false }, ref) => {
  const points = useRef<Points>(null);
  const state = useMemo(
    () => ({
      velocity: new Float32Array(max * 3),
      life: new Float32Array(max),
      maxLife: new Float32Array(max).fill(1),
      baseSize: new Float32Array(max),
      cursor: 0,
    }),
    [max],
  );

  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(max * 3).fill(-999), 3));
    g.setAttribute("aSize", new BufferAttribute(new Float32Array(max), 1));
    g.setAttribute("aAlpha", new BufferAttribute(new Float32Array(max), 1));
    return g;
  }, [max]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: glow ? AdditiveBlending : NormalBlending,
        uniforms: { uColor: { value: new Color(color) }, uScale: { value: 600 } },
      }),
    [color, glow],
  );

  useImperativeHandle(
    ref,
    () => ({
      burst: (origin, count = 28, power = 1) => {
        const position = geometry.getAttribute("position") as BufferAttribute;
        for (let n = 0; n < count; n += 1) {
          const i = state.cursor;
          state.cursor = (state.cursor + 1) % max;
          position.setXYZ(i, origin.x + (Math.random() - 0.5) * 0.3, origin.y + Math.random() * 0.1, origin.z + (Math.random() - 0.5) * 0.3);
          const angle = Math.random() * Math.PI * 2;
          const speed = (0.4 + Math.random() * 1.1) * power;
          state.velocity[i * 3] = Math.cos(angle) * speed;
          state.velocity[i * 3 + 1] = (0.6 + Math.random() * 1.6) * power;
          state.velocity[i * 3 + 2] = Math.sin(angle) * speed;
          state.life[i] = 0;
          state.maxLife[i] = 0.9 + Math.random() * 1.1;
          state.baseSize[i] = 0.35 + Math.random() * 0.6;
        }
      },
    }),
    [geometry, max, state],
  );

  useFrame(({ size, camera }, delta) => {
    const dt = Math.min(delta, 0.05);
    const position = geometry.getAttribute("position") as BufferAttribute;
    const sizeAttr = geometry.getAttribute("aSize") as BufferAttribute;
    const alphaAttr = geometry.getAttribute("aAlpha") as BufferAttribute;
    const fovScale = "fov" in camera ? size.height / (2 * Math.tan(((camera.fov as number) * Math.PI) / 360)) : 600;
    material.uniforms["uScale"]!.value = fovScale;
    for (let i = 0; i < max; i += 1) {
      const maxLife = state.maxLife[i] ?? 1;
      if ((state.life[i] ?? maxLife) >= maxLife) {
        alphaAttr.setX(i, 0);
        continue;
      }
      state.life[i] = (state.life[i] ?? 0) + dt;
      const t = (state.life[i] ?? 0) / maxLife;
      state.velocity[i * 3 + 1] = (state.velocity[i * 3 + 1] ?? 0) - 2.2 * dt;
      state.velocity[i * 3] = (state.velocity[i * 3] ?? 0) * (1 - 0.8 * dt);
      state.velocity[i * 3 + 2] = (state.velocity[i * 3 + 2] ?? 0) * (1 - 0.8 * dt);
      position.setXYZ(
        i,
        position.getX(i) + (state.velocity[i * 3] ?? 0) * dt,
        Math.max(0.02, position.getY(i) + (state.velocity[i * 3 + 1] ?? 0) * dt),
        position.getZ(i) + (state.velocity[i * 3 + 2] ?? 0) * dt,
      );
      sizeAttr.setX(i, (state.baseSize[i] ?? 0.5) * (0.5 + t * 1.6));
      alphaAttr.setX(i, (1 - t) * (1 - t) * 0.65);
    }
    position.needsUpdate = true;
    sizeAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
});

Dust.displayName = "Dust";
