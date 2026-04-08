import { Geometry } from '../Geometry';

export class IcosahedronGeometry extends Geometry {
  constructor(radius: number = 1, detail: number = 0) {
    super();
    
    const t = (1 + Math.sqrt(5)) / 2;
    
    const positions: number[] = [
      -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0,
      0, -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t,
      t, 0, -1, t, 0, 1, -t, 0, -1, -t, 0, 1
    ];
    
    const indices: number[] = [
      0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11,
      1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8,
      3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9,
      4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1
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