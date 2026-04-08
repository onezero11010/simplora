import { Matrix4 } from '../core/Matrix4';
import { Geometry } from '../geometry/Geometry';
import { Material } from '../material/Material';

export class Mesh {
  private geometry: Geometry;
  private material: Material;
  private position: [number, number, number];
  private rotation: [number, number, number];
  private scale: [number, number, number];
  private modelMatrix: Matrix4;

  constructor(geometry: Geometry, material: Material) {
    this.geometry = geometry;
    this.material = material;
    
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];
    
    this.modelMatrix = Matrix4.identity();
    this.updateModelMatrix();
  }
  
  private updateModelMatrix(): void {
    const translation = Matrix4.translation(this.position[0], this.position[1], this.position[2]);
    const rotationX = Matrix4.rotationX(this.rotation[0]);
    const rotationY = Matrix4.rotationY(this.rotation[1]);
    const rotationZ = Matrix4.rotationZ(this.rotation[2]);
    const scale = Matrix4.scale(this.scale[0], this.scale[1], this.scale[2]);
    
    this.modelMatrix = translation.multiply(rotationX.multiply(rotationY.multiply(rotationZ.multiply(scale))));
  }
  
  public setPosition(x: number, y: number, z: number): void {
    this.position = [x, y, z];
    this.updateModelMatrix();
  }
  
  public setRotation(x: number, y: number, z: number): void {
    this.rotation = [x, y, z];
    this.updateModelMatrix();
  }
  
  public setScale(x: number, y: number, z: number): void {
    this.scale = [x, y, z];
    this.updateModelMatrix();
  }
  
  public getModelMatrix(): Float32Array {
    return this.modelMatrix.elements;
  }
  
  public getGeometry(): Geometry {
    return this.geometry;
  }
  
  public getMaterial(): Material {
    return this.material;
  }
}