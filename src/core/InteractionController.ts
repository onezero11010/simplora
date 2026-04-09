import { Camera } from './Camera';
import { Mesh } from '../objects/Mesh';
import { Scene } from '../objects/Scene';
import { Matrix4 } from './Matrix4';

export interface InteractionControllerOptions {
  enableSelection?: boolean;
  enableHover?: boolean;
  enableDrag?: boolean;
  hoverColor?: [number, number, number];
  selectionColor?: [number, number, number];
}

export type SelectionCallback = (mesh: Mesh | null) => void;
export type HoverCallback = (mesh: Mesh | null) => void;

export class InteractionController {
  private camera: Camera;
  private canvas: HTMLCanvasElement;
  private scene: Scene;
  private gl: WebGLRenderingContext;
  
  private options: Required<InteractionControllerOptions>;
  
  private isDragging: boolean = false;
  private hasDragged: boolean = false;
  private previousMousePosition: { x: number; y: number } = { x: 0, y: 0 };
  
  private hoveredMesh: Mesh | null = null;
  private selectedMesh: Mesh | null = null;
  private draggedMesh: Mesh | null = null;
  
  private hoverOriginalColors: Map<Mesh, [number, number, number]> = new Map();
  private selectionOriginalColors: Map<Mesh, [number, number, number]> = new Map();
  
  private selectionCallback: SelectionCallback | null = null;
  private hoverCallback: HoverCallback | null = null;
  
  private selectionFramebuffer: WebGLFramebuffer | null = null;
  private selectionTexture: WebGLTexture | null = null;
  private selectionDepthBuffer: WebGLRenderbuffer | null = null;
  
  constructor(camera: Camera, canvas: HTMLCanvasElement, scene: Scene, gl: WebGLRenderingContext, options: InteractionControllerOptions = {}) {
    this.camera = camera;
    this.canvas = canvas;
    this.scene = scene;
    this.gl = gl;
    
    this.options = {
      enableSelection: options.enableSelection ?? true,
      enableHover: options.enableHover ?? true,
      enableDrag: options.enableDrag ?? true,
      hoverColor: options.hoverColor ?? [1.0, 1.0, 0.0],
      selectionColor: options.selectionColor ?? [1.0, 0.0, 0.0]
    };
    
    this.initSelectionBuffer();
    this.attachEventListeners();
  }
  
  private initSelectionBuffer(): void {
    const gl = this.gl;
    
    this.selectionFramebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.selectionFramebuffer);
    
    this.selectionTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.selectionTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.canvas.width, this.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.selectionTexture, 0);
    
    this.selectionDepthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.selectionDepthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.canvas.width, this.canvas.height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.selectionDepthBuffer);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  
  private updateSelectionBuffer(): void {
    const gl = this.gl;
    
    if (this.selectionTexture) {
      gl.bindTexture(gl.TEXTURE_2D, this.selectionTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.canvas.width, this.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }
    
    if (this.selectionDepthBuffer) {
      gl.bindRenderbuffer(gl.RENDERBUFFER, this.selectionDepthBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.canvas.width, this.canvas.height);
    }
  }
  
  private mouseMoveHandler!: (event: MouseEvent) => void;
  private mouseDownHandler!: (event: MouseEvent) => void;
  private mouseUpHandler!: () => void;
  private clickHandler!: (event: MouseEvent) => void;
  
  private attachEventListeners(): void {
    this.mouseMoveHandler = this.onMouseMove.bind(this);
    this.mouseDownHandler = this.onMouseDown.bind(this);
    this.mouseUpHandler = this.onMouseUp.bind(this);
    this.clickHandler = this.onClick.bind(this);
    
    this.canvas.addEventListener('mousemove', this.mouseMoveHandler);
    this.canvas.addEventListener('mousedown', this.mouseDownHandler);
    this.canvas.addEventListener('mouseup', this.mouseUpHandler);
    this.canvas.addEventListener('mouseleave', this.mouseUpHandler);
    this.canvas.addEventListener('click', this.clickHandler);
  }
  
  private onMouseMove(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
      if (this.options.enableHover && this.hoveredMesh) {
        this.handleHover(null);
      }
      return;
    }
    
    if (this.isDragging && this.draggedMesh && this.options.enableDrag) {
      if (!event.ctrlKey) {
        this.isDragging = false;
        this.draggedMesh = null;
      } else {
        const deltaX = event.clientX - this.previousMousePosition.x;
        const deltaY = event.clientY - this.previousMousePosition.y;
        
        if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
          this.hasDragged = true;
          this.dragObject(deltaX, deltaY);
          this.previousMousePosition = { x: event.clientX, y: event.clientY };
        }
      }
    } else if (this.options.enableHover) {
      const mesh = this.getMeshAtPosition(x, y);
      this.handleHover(mesh);
    }
  }
  
  private onMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return;
    if (!event.ctrlKey) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
      return;
    }
    
    const mesh = this.getMeshAtPosition(x, y);
    
    if (mesh && this.options.enableDrag) {
      this.isDragging = true;
      this.hasDragged = false;
      this.draggedMesh = mesh;
      this.previousMousePosition = { x: event.clientX, y: event.clientY };
      
      if (this.options.enableHover) {
        this.handleHover(mesh);
      }
    }
  }
  
  private onMouseUp(): void {
    this.isDragging = false;
    this.draggedMesh = null;
  }
  
  private onClick(event: MouseEvent): void {
    if (!this.options.enableSelection) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
      return;
    }
    
    const mesh = this.getMeshAtPosition(x, y);
    
    // 只有在没有拖拽操作时才处理点击选择
    if (!this.hasDragged) {
      this.handleSelection(mesh);
    }
    this.hasDragged = false;
  }
  
  private getMeshAtPosition(x: number, y: number): Mesh | null {
    const meshes = this.scene.getMeshes();
    
    if (meshes.length === 0) return null;
    
    const rect = this.canvas.getBoundingClientRect();
    const ndcX = (x / rect.width) * 2 - 1;
    const ndcY = -(y / rect.height) * 2 + 1;
    
    // 创建从相机位置发出的射线
    const rayOrigin = this.camera.position;
    const rayDirection = this.screenToWorldRay(ndcX, ndcY);
    
    let closestMesh: Mesh | null = null;
    let closestDistance = Infinity;
    
    // 检查每个物体的边界球，使用更精确的检测
    for (const mesh of meshes) {
      const distance = this.raySphereIntersection(rayOrigin, rayDirection, mesh);
      if (distance >= 0 && distance < closestDistance) {
        closestDistance = distance;
        closestMesh = mesh;
      }
    }
    
    return closestMesh;
  }
  
  private screenToWorldRay(ndcX: number, ndcY: number): [number, number, number] {
    // 获取投影矩阵和视图矩阵
    const projectionMatrix = this.camera.getProjectionMatrix();
    const viewMatrix = this.camera.getViewMatrix();
    
    // 计算逆投影矩阵和逆视图矩阵
    const invProjection = new Float32Array(16);
    const invView = new Float32Array(16);
    
    Matrix4.invert(projectionMatrix, invProjection);
    Matrix4.invert(viewMatrix, invView);
    
    // 将 NDC 坐标转换为世界坐标
    const nearPoint = this.transformPoint(ndcX, ndcY, -1, invProjection, invView);
    const farPoint = this.transformPoint(ndcX, ndcY, 1, invProjection, invView);
    
    // 计算射线方向
    const direction: [number, number, number] = [
      farPoint[0] - nearPoint[0],
      farPoint[1] - nearPoint[1],
      farPoint[2] - nearPoint[2]
    ];
    
    // 标准化方向向量
    const length = Math.sqrt(direction[0] * direction[0] + direction[1] * direction[1] + direction[2] * direction[2]);
    if (length > 0) {
      direction[0] /= length;
      direction[1] /= length;
      direction[2] /= length;
    }
    
    return direction;
  }
  
  private transformPoint(x: number, y: number, z: number, invProjection: Float32Array, invView: Float32Array): [number, number, number] {
    // 应用逆投影矩阵
    const clipCoords = [x, y, z, 1.0];
    const eyeCoords = this.multiplyMatrixVector(invProjection, clipCoords);
    
    // 透视除法
    eyeCoords[0] /= eyeCoords[3];
    eyeCoords[1] /= eyeCoords[3];
    eyeCoords[2] /= eyeCoords[3];
    
    // 应用逆视图矩阵
    const worldCoords = this.multiplyMatrixVector(invView, [eyeCoords[0], eyeCoords[1], eyeCoords[2], 1.0]);
    
    return [worldCoords[0], worldCoords[1], worldCoords[2]];
  }
  
  private multiplyMatrixVector(matrix: Float32Array, vector: number[]): number[] {
    const result = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i] += matrix[j * 4 + i] * vector[j];
      }
    }
    return result;
  }
  
  private raySphereIntersection(rayOrigin: [number, number, number], rayDirection: [number, number, number], mesh: Mesh): number {
    // 获取物体的世界位置和缩放信息
    const modelMatrix = mesh.getModelMatrix();
    const center: [number, number, number] = [modelMatrix[12], modelMatrix[13], modelMatrix[14]];
    
    // 根据物体的缩放计算动态半径
    const scaleX = Math.sqrt(modelMatrix[0] * modelMatrix[0] + modelMatrix[1] * modelMatrix[1] + modelMatrix[2] * modelMatrix[2]);
    const scaleY = Math.sqrt(modelMatrix[4] * modelMatrix[4] + modelMatrix[5] * modelMatrix[5] + modelMatrix[6] * modelMatrix[6]);
    const scaleZ = Math.sqrt(modelMatrix[8] * modelMatrix[8] + modelMatrix[9] * modelMatrix[9] + modelMatrix[10] * modelMatrix[10]);
    
    // 使用平均缩放作为半径基准，乘以一个基础半径值
    const avgScale = (scaleX + scaleY + scaleZ) / 3;
    const radius = Math.max(0.5, avgScale * 0.8); // 最小半径为0.5，避免过小物体无法选中
    
    // 计算射线与球的交点
    const oc: [number, number, number] = [
      rayOrigin[0] - center[0],
      rayOrigin[1] - center[1],
      rayOrigin[2] - center[2]
    ];
    
    const a = rayDirection[0] * rayDirection[0] + rayDirection[1] * rayDirection[1] + rayDirection[2] * rayDirection[2];
    const b = 2 * (oc[0] * rayDirection[0] + oc[1] * rayDirection[1] + oc[2] * rayDirection[2]);
    const c = oc[0] * oc[0] + oc[1] * oc[1] + oc[2] * oc[2] - radius * radius;
    
    const discriminant = b * b - 4 * a * c;
    
    if (discriminant < 0) {
      return -1; // 没有交点
    }
    
    const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
    
    // 返回最近的正交点
    if (t1 > 0 && t2 > 0) {
      return Math.min(t1, t2);
    } else if (t1 > 0) {
      return t1;
    } else if (t2 > 0) {
      return t2;
    }
    return -1;
  }
  
  // private indexToColor(index: number): [number, number, number] {
  //   const r = (index & 0xFF) / 255;
  //   const g = ((index >> 8) & 0xFF) / 255;
  //   const b = ((index >> 16) & 0xFF) / 255;
  //   return [r, g, b];
  // }
  
  // private colorToIndex(r: number, g: number, b: number): number {
  //   return r + (g << 8) + (b << 16);
  // }
  
  private handleHover(mesh: Mesh | null): void {
    if (this.hoveredMesh === mesh) return;
    
    if (this.hoveredMesh) {
      const originalColor = this.hoverOriginalColors.get(this.hoveredMesh);
      if (originalColor) {
        this.hoveredMesh.getMaterial().setColor(originalColor[0], originalColor[1], originalColor[2]);
        this.hoverOriginalColors.delete(this.hoveredMesh);
      }
    }
    
    this.hoveredMesh = mesh;
    
    if (mesh && this.selectedMesh !== mesh) {
      const currentColor = mesh.getMaterial().getColor();
      this.hoverOriginalColors.set(mesh, [...currentColor]);
      mesh.getMaterial().setColor(this.options.hoverColor[0], this.options.hoverColor[1], this.options.hoverColor[2]);
    }
    
    if (this.hoverCallback) {
      this.hoverCallback(mesh);
    }
  }
  
  private handleSelection(mesh: Mesh | null): void {
    if (this.selectedMesh === mesh && mesh !== null) {
      if (this.selectedMesh) {
        const originalColor = this.selectionOriginalColors.get(this.selectedMesh);
        if (originalColor) {
          this.selectedMesh.getMaterial().setColor(originalColor[0], originalColor[1], originalColor[2]);
          this.selectionOriginalColors.delete(this.selectedMesh);
        }
      }
      this.selectedMesh = null;
      if (this.selectionCallback) {
        this.selectionCallback(null);
      }
      return;
    }
    
    if (this.selectedMesh) {
      const originalColor = this.selectionOriginalColors.get(this.selectedMesh);
      if (originalColor) {
        this.selectedMesh.getMaterial().setColor(originalColor[0], originalColor[1], originalColor[2]);
        this.selectionOriginalColors.delete(this.selectedMesh);
      }
    }
    
    this.selectedMesh = mesh;
    
    if (mesh) {
      let originalColor = this.hoverOriginalColors.get(mesh);
      if (!originalColor) {
        originalColor = [...mesh.getMaterial().getColor()];
      }
      this.selectionOriginalColors.set(mesh, originalColor);
      mesh.getMaterial().setColor(this.options.selectionColor[0], this.options.selectionColor[1], this.options.selectionColor[2]);
    }
    
    if (this.selectionCallback) {
      this.selectionCallback(mesh);
    }
  }
  
  private dragObject(deltaX: number, deltaY: number): void {
    if (!this.draggedMesh) return;
    
    // 动态灵敏度，基于相机距离和物体大小
    const currentPos = this.draggedMesh.getModelMatrix();
    const objectPosition: [number, number, number] = [currentPos[12], currentPos[13], currentPos[14]];
    
    // 计算相机到物体的距离
    const cameraToObject = [
      objectPosition[0] - this.camera.position[0],
      objectPosition[1] - this.camera.position[1],
      objectPosition[2] - this.camera.position[2]
    ];
    const distance = Math.sqrt(
      cameraToObject[0] * cameraToObject[0] + 
      cameraToObject[1] * cameraToObject[1] + 
      cameraToObject[2] * cameraToObject[2]
    );
    
    // 基于距离的动态灵敏度
    const baseSensitivity = 0.005;
    const sensitivity = baseSensitivity * Math.max(0.1, distance * 0.1);
    
    const viewMatrix = this.camera.getViewMatrix();
    const viewInverse = new Float32Array(16);
    Matrix4.invert(viewMatrix, viewInverse);
    
    // 获取正确的世界坐标系方向向量
    const worldRight = [viewInverse[0], viewInverse[4], viewInverse[8]];
    const worldUp = [viewInverse[1], viewInverse[5], viewInverse[9]];
    
    // 标准化方向向量
    const rightLength = Math.sqrt(worldRight[0] * worldRight[0] + worldRight[1] * worldRight[1] + worldRight[2] * worldRight[2]);
    const upLength = Math.sqrt(worldUp[0] * worldUp[0] + worldUp[1] * worldUp[1] + worldUp[2] * worldUp[2]);
    
    if (rightLength > 0) {
      worldRight[0] /= rightLength;
      worldRight[1] /= rightLength;
      worldRight[2] /= rightLength;
    }
    
    if (upLength > 0) {
      worldUp[0] /= upLength;
      worldUp[1] /= upLength;
      worldUp[2] /= upLength;
    }
    
    // 应用移动
    const newPosition = [
      objectPosition[0] + worldRight[0] * deltaX * sensitivity - worldUp[0] * deltaY * sensitivity,
      objectPosition[1] + worldRight[1] * deltaX * sensitivity - worldUp[1] * deltaY * sensitivity,
      objectPosition[2] + worldRight[2] * deltaX * sensitivity - worldUp[2] * deltaY * sensitivity
    ];
    
    this.draggedMesh.setPosition(newPosition[0], newPosition[1], newPosition[2]);
  }
  
  public setSelectionCallback(callback: SelectionCallback): void {
    this.selectionCallback = callback;
  }
  
  public setHoverCallback(callback: HoverCallback): void {
    this.hoverCallback = callback;
  }
  
  public getSelectedMesh(): Mesh | null {
    return this.selectedMesh;
  }
  
  public getHoveredMesh(): Mesh | null {
    return this.hoveredMesh;
  }
  
  public setHoverColor(r: number, g: number, b: number): void {
    this.options.hoverColor = [r, g, b];
  }
  
  public setSelectionColor(r: number, g: number, b: number): void {
    this.options.selectionColor = [r, g, b];
  }
  
  public setEnableSelection(enabled: boolean): void {
    this.options.enableSelection = enabled;
  }
  
  public setEnableHover(enabled: boolean): void {
    this.options.enableHover = enabled;
  }
  
  public setEnableDrag(enabled: boolean): void {
    this.options.enableDrag = enabled;
  }
  
  public resize(): void {
    this.updateSelectionBuffer();
  }
  
  public dispose(): void {
    const gl = this.gl;
    
    this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
    this.canvas.removeEventListener('mousedown', this.mouseDownHandler);
    this.canvas.removeEventListener('mouseup', this.mouseUpHandler);
    this.canvas.removeEventListener('mouseleave', this.mouseUpHandler);
    this.canvas.removeEventListener('click', this.clickHandler);
    
    if (this.selectionFramebuffer) {
      gl.deleteFramebuffer(this.selectionFramebuffer);
    }
    if (this.selectionTexture) {
      gl.deleteTexture(this.selectionTexture);
    }
    if (this.selectionDepthBuffer) {
      gl.deleteRenderbuffer(this.selectionDepthBuffer);
    }
  }
}