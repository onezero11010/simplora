import { type MaterialOptions } from '../types/index';

export class Material {
  protected color: [number, number, number];
  protected opacity: number;
  protected wireframe: boolean;

  constructor(options: MaterialOptions = {}) {
    this.color = options.color || [1.0, 1.0, 1.0];
    this.opacity = options.opacity !== undefined ? options.opacity : 1.0;
    this.wireframe = options.wireframe || false;
  }
  
  public setColor(r: number, g: number, b: number): void {
    this.color = [r, g, b];
  }
  
  public getColor(): [number, number, number] {
    return this.color;
  }
  
  public setOpacity(opacity: number): void {
    this.opacity = opacity;
  }
  
  public getOpacity(): number {
    return this.opacity;
  }
  
  public setWireframe(wireframe: boolean): void {
    this.wireframe = wireframe;
  }
  
  public isWireframe(): boolean {
    return this.wireframe;
  }
}