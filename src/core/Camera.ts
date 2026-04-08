import { Matrix4 } from './Matrix4';

export class Camera {
  public fov: number;
  public aspect: number;
  public near: number;
  public far: number;
  
  public position: [number, number, number];
  public target: [number, number, number];
  public up: [number, number, number];
  
  private projectionMatrix: Matrix4;
  private viewMatrix: Matrix4;

  constructor(fov: number = Math.PI / 4, aspect: number = 1, near: number = 0.1, far: number = 100) {
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    
    this.position = [0, 0, 5];
    this.target = [0, 0, 0];
    this.up = [0, 1, 0];
    
    this.projectionMatrix = Matrix4.perspective(fov, aspect, near, far);
    this.viewMatrix = Matrix4.lookAt(this.position, this.target, this.up);
  }
  
  public updateProjectionMatrix(): void {
    this.projectionMatrix = Matrix4.perspective(this.fov, this.aspect, this.near, this.far);
  }
  
  public updateViewMatrix(): void {
    this.viewMatrix = Matrix4.lookAt(this.position, this.target, this.up);
  }
  
  public setPosition(x: number, y: number, z: number): void {
    this.position = [x, y, z];
    this.updateViewMatrix();
  }
  
  public setTarget(x: number, y: number, z: number): void {
    this.target = [x, y, z];
    this.updateViewMatrix();
  }
  
  public getProjectionMatrix(): Float32Array {
    return this.projectionMatrix.elements;
  }
  
  public getViewMatrix(): Float32Array {
    return this.viewMatrix.elements;
  }
}