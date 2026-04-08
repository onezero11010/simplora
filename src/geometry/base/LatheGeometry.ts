import { Geometry } from '../Geometry';

export class LatheGeometry extends Geometry {
  constructor(points: number[][], segments: number = 12, phiStart: number = 0, phiLength: number = Math.PI * 2) {
    super();
    
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    
    const inversePointLength = 1 / (points.length - 1);
    
    for (let i = 0; i <= segments; i++) {
      const phi = phiStart + (i / segments) * phiLength;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      
      for (let j = 0; j < points.length; j++) {
        const point = points[j];
        const x = point[0] * cosPhi;
        const y = point[1];
        const z = point[0] * sinPhi;
        
        positions.push(x, y, z);
        
        let nx, ny, nz;
        if (j === 0) {
          const nextPoint = points[j + 1];
          const tx = nextPoint[0] - point[0];
          const ty = nextPoint[1] - point[1];
          const len = Math.sqrt(tx * tx + ty * ty);
          nx = -ty / len;
          ny = tx / len;
          nz = 0;
        } else if (j === points.length - 1) {
          const prevPoint = points[j - 1];
          const tx = point[0] - prevPoint[0];
          const ty = point[1] - prevPoint[1];
          const len = Math.sqrt(tx * tx + ty * ty);
          nx = -ty / len;
          ny = tx / len;
          nz = 0;
        } else {
          const prevPoint = points[j - 1];
          const nextPoint = points[j + 1];
          const tx = nextPoint[0] - prevPoint[0];
          const ty = nextPoint[1] - prevPoint[1];
          const len = Math.sqrt(tx * tx + ty * ty);
          nx = -ty / len;
          ny = tx / len;
          nz = 0;
        }
        
        const normalX = nx * cosPhi;
        const normalY = ny;
        const normalZ = nx * sinPhi;
        
        const normalLen = Math.sqrt(normalX * normalX + normalY * normalY + normalZ * normalZ);
        normals.push(normalX / normalLen, normalY / normalLen, normalZ / normalLen);
      }
    }
    
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < points.length - 1; j++) {
        const a = i * points.length + j;
        const b = a + points.length;
        
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }
    
    this.setVertices(positions);
    this.setNormals(normals);
    this.setIndices(indices);
  }
}