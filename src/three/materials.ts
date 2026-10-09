import { MeshPhysicalMaterial, MeshStandardMaterial } from "three";

export const PALETTE = {
  yellow: "#f5b700",
  graphite: "#1c1d1f",
  sand: "#f2efe8",
  earth: "#8c5a2b",
} as const;

export const paint = new MeshPhysicalMaterial({
  color: PALETTE.yellow,
  roughness: 0.38,
  metalness: 0.15,
  clearcoat: 0.6,
  clearcoatRoughness: 0.35,
});

export const paintDark = new MeshStandardMaterial({ color: "#2a2c30", roughness: 0.55, metalness: 0.35 });
export const steel = new MeshStandardMaterial({ color: "#8a8f96", roughness: 0.3, metalness: 0.85 });
export const chrome = new MeshStandardMaterial({ color: "#d7dade", roughness: 0.12, metalness: 1 });
export const rubber = new MeshStandardMaterial({ color: "#121314", roughness: 0.92, metalness: 0 });
export const trackShoe = new MeshStandardMaterial({ color: "#26282b", roughness: 0.7, metalness: 0.5 });
export const glass = new MeshPhysicalMaterial({
  color: "#1f4658",
  roughness: 0.08,
  metalness: 0.4,
  transparent: true,
  opacity: 0.88,
  clearcoat: 1,
});
export const light = new MeshStandardMaterial({
  color: "#fff4c4",
  emissive: "#ffd45c",
  emissiveIntensity: 1.4,
});
export const soil = new MeshStandardMaterial({ color: "#7a4d24", roughness: 1, flatShading: true });
export const soilDark = new MeshStandardMaterial({ color: "#5d3a1a", roughness: 1, flatShading: true });
export const sandStone = new MeshStandardMaterial({ color: "#cdbf9f", roughness: 0.95, flatShading: true });
export const drumSteel = new MeshStandardMaterial({ color: "#a3a8ae", roughness: 0.5, metalness: 0.55 });
