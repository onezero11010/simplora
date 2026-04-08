export class Shader {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private uniformLocations: Map<string, WebGLUniformLocation | null>;

  constructor(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
    this.gl = gl;
    this.program = this.createProgram(vertexSource, fragmentSource);
    this.uniformLocations = new Map();
  }
  
  private createShader(type: number, source: string): WebGLShader {
    const gl = this.gl;
    const shader = gl.createShader(type);
    if (!shader) {
      throw new Error('Failed to create shader');
    }
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error('Shader compile error: ' + error);
    }
    
    return shader;
  }
  
  private createProgram(vertexSource: string, fragmentSource: string): WebGLProgram {
    const gl = this.gl;
    const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentSource);
    
    const program = gl.createProgram();
    if (!program) {
      throw new Error('Failed to create program');
    }
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
      throw new Error('Program link error: ' + error);
    }
    
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    
    return program;
  }
  
  public use(): void {
    this.gl.useProgram(this.program);
  }
  
  public getUniformLocation(name: string): WebGLUniformLocation | null {
    if (!this.uniformLocations.has(name)) {
      const location = this.gl.getUniformLocation(this.program, name);
      this.uniformLocations.set(name, location);
    }
    return this.uniformLocations.get(name) || null;
  }
  
  public getAttribLocation(name: string): number {
    // Don't cache attribute locations - always get fresh value
    const location = this.gl.getAttribLocation(this.program, name);
    
    // 添加调试信息，帮助诊断属性位置问题
    if (location === -1) {
      console.warn(`Attribute '${name}' not found in shader program. This may be due to:`);
      console.warn(`1. Attribute not declared in vertex shader`);
      console.warn(`2. Attribute declared but not used (optimized out by compiler)`);
      console.warn(`3. Shader compilation/linking errors`);
    }
    
    return location;
  }
  
  public setMatrix4(name: string, matrix: Float32Array): void {
    const location = this.getUniformLocation(name);
    if (location) {
      this.gl.uniformMatrix4fv(location, false, matrix);
    }
  }
  
  public setVec3(name: string, vec3: [number, number, number]): void {
    const location = this.getUniformLocation(name);
    if (location) {
      this.gl.uniform3f(location, vec3[0], vec3[1], vec3[2]);
    }
  }
  
  public setFloat(name: string, value: number): void {
    const location = this.getUniformLocation(name);
    if (location) {
      this.gl.uniform1f(location, value);
    }
  }
  
  public dispose(): void {
    this.gl.deleteProgram(this.program);
  }
}