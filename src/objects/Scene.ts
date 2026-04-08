import { Mesh } from './Mesh';
import { Camera } from '../core/Camera';
import { Shader } from '../core/Shader';

export class Scene {
  private meshes: Mesh[];

  constructor() {
    this.meshes = [];
  }
  
  public add(mesh: Mesh): void {
    this.meshes.push(mesh);
  }
  
  public remove(mesh: Mesh): void {
    const index = this.meshes.indexOf(mesh);
    if (index > -1) {
      this.meshes.splice(index, 1);
    }
  }
  
  public getMeshes(): Mesh[] {
    return this.meshes;
  }
  
  public render(gl: WebGLRenderingContext, camera: Camera): void {
    this.meshes.forEach(mesh => {
      this.renderMesh(gl, mesh, camera);
    });
  }
  
  private renderMesh(gl: WebGLRenderingContext, mesh: Mesh, camera: Camera): void {
    const geometry = mesh.getGeometry();
    const material = mesh.getMaterial();
    
    const vertices = geometry.getVertices();
    const normals = geometry.getNormals();
    const indices = geometry.getIndices();
    
    const vertexShaderSource = `
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      
      uniform mat4 uModelMatrix;
      uniform mat4 uViewMatrix;
      uniform mat4 uProjectionMatrix;
      
      varying vec3 vNormal;
      
      void main() {
        gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
        vNormal = aNormal;
      }
    `;
    
    const fragmentShaderSource = `
      precision mediump float;
      
      uniform vec3 uColor;
      uniform float uOpacity;
      
      varying vec3 vNormal;
      
      void main() {
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        float diff = max(dot(normalize(vNormal), lightDir), 0.0);
        vec3 lighting = uColor * (0.3 + 0.7 * diff);
        gl_FragColor = vec4(lighting, uOpacity);
      }
    `;
    
    const shader = new Shader(gl, vertexShaderSource, fragmentShaderSource);
    shader.use();
    
    // 创建并绑定顶点缓冲区
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    // 获取并设置位置属性
    const positionLocation = shader.getAttribLocation('aPosition');
    if (positionLocation >= 0) {
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    } else {
      console.warn('aPosition attribute location not found');
    }
    
    // 创建并绑定法线缓冲区
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    
    // 获取并设置法线属性
    const normalLocation = shader.getAttribLocation('aNormal');
    if (normalLocation >= 0) {
      gl.enableVertexAttribArray(normalLocation);
      gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
    } else {
      console.warn('aNormal attribute location not found');
    }
    
    // 创建并绑定索引缓冲区
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    shader.setMatrix4('uModelMatrix', mesh.getModelMatrix());
    shader.setMatrix4('uViewMatrix', camera.getViewMatrix());
    shader.setMatrix4('uProjectionMatrix', camera.getProjectionMatrix());
    shader.setVec3('uColor', material.getColor());
    shader.setFloat('uOpacity', material.getOpacity());
    
    if (material.isWireframe()) {
      for (let i = 0; i < indices.length; i += 3) {
        gl.drawElements(gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, i * 2);
      }
    } else {
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }
    
    gl.deleteBuffer(positionBuffer);
    gl.deleteBuffer(normalBuffer);
    gl.deleteBuffer(indexBuffer);
    shader.dispose();
  }
}