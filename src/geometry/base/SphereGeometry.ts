import { Geometry } from '../Geometry';

export class SphereGeometry extends Geometry {
  constructor(radius: number = 1, widthSegments: number = 32, heightSegments: number = 16) {
    super();
    
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    
    for (let y = 0; y <= heightSegments; y++) {
      const v = y / heightSegments;
      const phi = v * Math.PI;
      
      for (let x = 0; x <= widthSegments; x++) {
        const u = x / widthSegments;
        const theta = u * Math.PI * 2;
        
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);
        
        const px = cosTheta * sinPhi;
        const py = cosPhi;
        const pz = sinTheta * sinPhi;
        
        positions.push(px * radius, py * radius, pz * radius);
        normals.push(px, py, pz);
      }
    }
    
    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < widthSegments; x++) {
        const a = y * (widthSegments + 1) + x;
        const b = a + widthSegments + 1;
        
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }
    
    this.setVertices(positions);
    this.setNormals(normals);
    this.setIndices(indices);
  }
}