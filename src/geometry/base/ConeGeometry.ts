import { Geometry } from '../Geometry';

export class ConeGeometry extends Geometry {
  constructor(radius: number = 1, height: number = 1, radialSegments: number = 32, heightSegments: number = 1) {
    super();
    
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    
    const halfHeight = height / 2;
    
    // 生成圆锥体侧面顶点（从底部到顶部）
    for (let y = 0; y <= heightSegments; y++) {
      const v = y / heightSegments;
      const currentRadius = radius * (1 - v); // 半径从底部到顶部逐渐减小
      const yPos = -halfHeight + v * height;  // 从底部开始
      
      for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments;
        const theta = u * Math.PI * 2;
        
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);
        
        const px = cosTheta * currentRadius;
        const pz = sinTheta * currentRadius;
        
        positions.push(px, yPos, pz);
        
        // 计算侧面法向量
        const slope = radius / height;
        const normalLength = Math.sqrt(1 + slope * slope);
        const nx = cosTheta * slope / normalLength;
        const nz = sinTheta * slope / normalLength;
        const ny = 1 / normalLength;
        normals.push(nx, ny, nz);
      }
    }
    
    // 创建侧面三角形
    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < radialSegments; x++) {
        const a = y * (radialSegments + 1) + x;
        const b = a + radialSegments + 1;
        
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }
    
    // 添加底面中心点
    const bottomCenterIndex = positions.length / 3;
    positions.push(0, -halfHeight, 0);
    normals.push(0, -1, 0);
    
    // 添加底面圆周点
    const bottomCircleStartIndex = positions.length / 3;
    for (let x = 0; x <= radialSegments; x++) {
      const theta = (x / radialSegments) * Math.PI * 2;
      positions.push(Math.cos(theta) * radius, -halfHeight, Math.sin(theta) * radius);
      normals.push(0, -1, 0);
    }
    
    // 创建底面三角形（正确的缠绕顺序）
    for (let x = 0; x < radialSegments; x++) {
      indices.push(bottomCenterIndex, bottomCircleStartIndex + x, bottomCircleStartIndex + x + 1);
    }
    
    this.setVertices(positions);
    this.setNormals(normals);
    this.setIndices(indices);
  }
}