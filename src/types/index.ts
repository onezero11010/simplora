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

export type NumberArray = number[];