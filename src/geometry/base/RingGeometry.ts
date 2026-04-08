import { Geometry } from '../Geometry';

export class RingGeometry extends Geometry {
  constructor(innerRadius: number = 0.5, outerRadius: number = 1, thetaSegments: number = 32, phiSegments: number = 1) {
    super();
    
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    
    for (let i = 0; i <= phiSegments; i++) {
      const radius = innerRadius + (outerRadius - innerRadius) * (i / phiSegments);
      
      for (let j = 0; j <= thetaSegments; j++) {
        const theta = (j / thetaSegments) * Math.PI * 2;
        const x = Math.cos(theta) * radius;
        const y = Math.sin(theta) * radius;
        
        positions.push(x, y, 0);
        normals.push(0, 0, 1);
      }
    }
    
    for (let i = 0; i < phiSegments; i++) {
      for (let j = 0; j < thetaSegments; j++) {
        const a = i * (thetaSegments + 1) + j;
        const b = a + thetaSegments + 1;
        
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }
    
    this.setVertices(positions);
    this.setNormals(normals);
    this.setIndices(indices);
  }
}