export interface WebGLContextOptions {
  alpha?: boolean;
  antialias?: boolean;
  depth?: boolean;
  stencil?: boolean;
  premultipliedAlpha?: boolean;
  preserveDrawingBuffer?: boolean;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface MaterialOptions {
  color?: [number, number, number];
  opacity?: number;
  wireframe?: boolean;
}

export interface CameraOptions {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
}

export interface OrbitControllerOptions {
  enableRotate?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
  rotateSpeed?: number;
  zoomSpeed?: number;
  panSpeed?: number;
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
}

export interface ViewPreset {
  name: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface InteractionControllerOptions {
  enableSelection?: boolean;
  enableHover?: boolean;
  enableDrag?: boolean;
  hoverColor?: [number, number, number];
  selectionColor?: [number, number, number];
}

export type NumberArray = number[];