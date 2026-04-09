import { Camera } from './Camera';

export interface ViewPreset {
  name: string;
  position: [number, number, number];
  target: [number, number, number];
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

export class OrbitController {
  private camera: Camera;
  private canvas: HTMLCanvasElement;
  
  private options: Required<OrbitControllerOptions>;
  
  private isDragging: boolean = false;
  private isPanning: boolean = false;
  private previousMousePosition: { x: number; y: number } = { x: 0, y: 0 };
  
  private spherical: { radius: number; phi: number; theta: number };
  private target: [number, number, number];
  
  private viewPresets: ViewPreset[] = [];
  private currentPresetIndex: number = -1;
  
  constructor(camera: Camera, canvas: HTMLCanvasElement, options: OrbitControllerOptions = {}) {
    this.camera = camera;
    this.canvas = canvas;
    
    this.options = {
      enableRotate: options.enableRotate ?? true,
      enableZoom: options.enableZoom ?? true,
      enablePan: options.enablePan ?? true,
      rotateSpeed: options.rotateSpeed ?? 1.0,
      zoomSpeed: options.zoomSpeed ?? 1.0,
      panSpeed: options.panSpeed ?? 1.0,
      minDistance: options.minDistance ?? 0.1,
      maxDistance: options.maxDistance ?? 1000,
      minPolarAngle: options.minPolarAngle ?? 0.1,
      maxPolarAngle: options.maxPolarAngle ?? Math.PI - 0.1
    };
    
    const pos = this.camera.position;
    const tgt = this.camera.target;
    
    this.target = [...tgt] as [number, number, number];

    const offset: [number, number, number] = [pos[0] - tgt[0], pos[1] - tgt[1], pos[2] - tgt[2]];
    this.spherical = this.cartesianToSpherical(offset);
    
    this.initDefaultPresets();
    this.attachEventListeners();
  }
  
  private cartesianToSpherical(offset: [number, number, number]): { radius: number; phi: number; theta: number } {
    const radius = Math.sqrt(offset[0] * offset[0] + offset[1] * offset[1] + offset[2] * offset[2]);
    const phi = Math.acos(Math.max(-1, Math.min(1, offset[1] / radius)));
    const theta = Math.atan2(offset[0], offset[2]);
    return { radius, phi, theta };
  }
  
  private sphericalToCartesian(spherical: { radius: number; phi: number; theta: number }): [number, number, number] {
    const { radius, phi, theta } = spherical;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);
    return [x, y, z];
  }
  
  private initDefaultPresets(): void {
    this.viewPresets = [
      { name: 'default', position: [0, 0, 5], target: [0, 0, 0] },
      { name: 'front', position: [0, 0, 10], target: [0, 0, 0] },
      { name: 'back', position: [0, 0, -10], target: [0, 0, 0] },
      { name: 'top', position: [0, 10, 0], target: [0, 0, 0] },
      { name: 'bottom', position: [0, -10, 0], target: [0, 0, 0] },
      { name: 'left', position: [-10, 0, 0], target: [0, 0, 0] },
      { name: 'right', position: [10, 0, 0], target: [0, 0, 0] },
      { name: 'isometric', position: [7.07, 7.07, 7.07], target: [0, 0, 0] }
    ];
  }
  
  private attachEventListeners(): void {
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.onMouseUp.bind(this));
    this.canvas.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
    
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  
  private onMouseDown(event: MouseEvent): void {
    if (event.ctrlKey) return;
    this.isDragging = true;
    this.isPanning = event.button === 2 || event.shiftKey;
    this.previousMousePosition = { x: event.clientX, y: event.clientY };
  }
  
  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    if (event.ctrlKey) {
      this.isDragging = false;
      return;
    }
    
    const deltaX = event.clientX - this.previousMousePosition.x;
    const deltaY = event.clientY - this.previousMousePosition.y;
    
    if (this.isPanning && this.options.enablePan) {
      this.pan(deltaX, deltaY);
    } else if (!this.isPanning && this.options.enableRotate) {
      this.rotate(deltaX, deltaY);
    }
    
    this.previousMousePosition = { x: event.clientX, y: event.clientY };
  }
  
  private onMouseUp(): void {
    this.isDragging = false;
    this.isPanning = false;
  }
  
  private onWheel(event: WheelEvent): void {
    if (!this.options.enableZoom) return;
    
    event.preventDefault();
    
    const delta = event.deltaY > 0 ? 1 : -1;
    this.zoom(delta);
  }
  
  private rotate(deltaX: number, deltaY: number): void {
    const rotateSpeed = this.options.rotateSpeed * 0.005;
    
    this.spherical.theta -= deltaX * rotateSpeed;
    this.spherical.phi -= deltaY * rotateSpeed;
    
    this.spherical.phi = Math.max(this.options.minPolarAngle, Math.min(this.options.maxPolarAngle, this.spherical.phi));
    
    this.updateCameraPosition();
  }
  
  private zoom(delta: number): void {
    const zoomSpeed = this.options.zoomSpeed * 0.1;
    
    this.spherical.radius += delta * zoomSpeed * this.spherical.radius;
    this.spherical.radius = Math.max(this.options.minDistance, Math.min(this.options.maxDistance, this.spherical.radius));
    
    this.updateCameraPosition();
  }
  
  private pan(deltaX: number, deltaY: number): void {
    const panSpeed = this.options.panSpeed * 0.01;
    const offset = this.sphericalToCartesian(this.spherical);
    
    const right = this.normalize([offset[2], 0, -offset[0]]);
    // const up = [0, 1, 0];

    this.target[0] -= right[0] * deltaX * panSpeed;
    this.target[1] += deltaY * panSpeed;
    this.target[2] -= right[2] * deltaX * panSpeed;
    
    this.camera.setTarget(this.target[0], this.target[1], this.target[2]);
    this.updateCameraPosition();
  }
  
  private normalize(v: [number, number, number]): [number, number, number] {
    const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    if (len === 0) return [0, 0, 0];
    return [v[0] / len, v[1] / len, v[2] / len];
  }
  
  private updateCameraPosition(): void {
    const offset = this.sphericalToCartesian(this.spherical);
    const position: [number, number, number] = [
      this.target[0] + offset[0],
      this.target[1] + offset[1],
      this.target[2] + offset[2]
    ];
    
    this.camera.position = position;
    this.camera.setTarget(this.target[0], this.target[1], this.target[2]);
  }
  
  public addViewPreset(preset: ViewPreset): void {
    this.viewPresets.push(preset);
  }
  
  public getViewPresets(): ViewPreset[] {
    return [...this.viewPresets];
  }
  
  public switchToPreset(index: number): void {
    if (index < 0 || index >= this.viewPresets.length) {
      console.warn(`Preset index ${index} out of range`);
      return;
    }
    
    const preset = this.viewPresets[index];
    this.camera.position = [...preset.position] as [number, number, number];
    this.camera.setTarget(preset.target[0], preset.target[1], preset.target[2]);
    
    this.target = [...preset.target] as [number, number, number];
    const offset: [number, number, number] = [
      preset.position[0] - preset.target[0],
      preset.position[1] - preset.target[1],
      preset.position[2] - preset.target[2]
    ];
    this.spherical = this.cartesianToSpherical(offset);
    
    this.currentPresetIndex = index;
  }
  
  public switchToPresetByName(name: string): void {
    const index = this.viewPresets.findIndex(p => p.name === name);
    if (index !== -1) {
      this.switchToPreset(index);
    } else {
      console.warn(`Preset with name "${name}" not found`);
    }
  }
  
  public getCurrentPreset(): ViewPreset | null {
    if (this.currentPresetIndex >= 0 && this.currentPresetIndex < this.viewPresets.length) {
      return { ...this.viewPresets[this.currentPresetIndex] };
    }
    return null;
  }
  
  public nextPreset(): void {
    const nextIndex = (this.currentPresetIndex + 1) % this.viewPresets.length;
    this.switchToPreset(nextIndex);
  }
  
  public previousPreset(): void {
    const prevIndex = this.currentPresetIndex <= 0 ? this.viewPresets.length - 1 : this.currentPresetIndex - 1;
    this.switchToPreset(prevIndex);
  }
  
  public setEnableRotate(enabled: boolean): void {
    this.options.enableRotate = enabled;
  }
  
  public setEnableZoom(enabled: boolean): void {
    this.options.enableZoom = enabled;
  }
  
  public setEnablePan(enabled: boolean): void {
    this.options.enablePan = enabled;
  }
  
  public setRotateSpeed(speed: number): void {
    this.options.rotateSpeed = speed;
  }
  
  public setZoomSpeed(speed: number): void {
    this.options.zoomSpeed = speed;
  }
  
  public setPanSpeed(speed: number): void {
    this.options.panSpeed = speed;
  }
  
  public setDistanceLimits(min: number, max: number): void {
    this.options.minDistance = min;
    this.options.maxDistance = max;
  }
  
  public setPolarAngleLimits(min: number, max: number): void {
    this.options.minPolarAngle = min;
    this.options.maxPolarAngle = max;
  }
  
  public dispose(): void {
    this.canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.removeEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.removeEventListener('mouseleave', this.onMouseUp.bind(this));
    this.canvas.removeEventListener('wheel', this.onWheel.bind(this));
  }
}