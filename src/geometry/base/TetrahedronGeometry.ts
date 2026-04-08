import { Geometry } from '../Geometry';

export class TetrahedronGeometry extends Geometry {
  constructor(radius: number = 1, detail: number = 0) {
    super();
    
    const positions: number[] = [
      1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1
    ];
    
    const indices: number[] = [
      2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
    ];
    
    const normals: number[] = [];
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      const len = Math.sqrt(x * x + y * y + z * z);
      normals.push(x / len, y / len, z / len);
    }
    
    for (let i = 0; i < positions.length; i++) {
      positions[i] *= radius;
    }
    
    this.setVertices(positions);
    this.setNormals(normals);
    this.setIndices(indices);
  }
}