import { type WebGLContextOptions } from '../types/index';

export class WebGLRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;

  constructor(canvas: HTMLCanvasElement, options: WebGLContextOptions = {}) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl', options) as WebGLRenderingContext;
    
    if (!this.gl) {
      throw new Error('WebGL not supported');
    }
    
    this.initGL();
  }
  
  private initGL(): void {
    const gl = this.gl;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
  }
  
  public setSize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }
  
  public clear(): void {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }
  
  public render(scene: any, camera: any): void {
    this.clear();
    scene.render(this.gl, camera);
  }
  
  public getGL(): WebGLRenderingContext {
    return this.gl;
  }
}