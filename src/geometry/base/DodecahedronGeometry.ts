import { Geometry } from '../Geometry';

export class DodecahedronGeometry extends Geometry {
  constructor(radius: number = 1, detail: number = 0) {
    super();
    
    const t = (1 + Math.sqrt(5)) / 2;
    const r = 1 / Math.sqrt(3);
    const rt = r * t;
    const rt2 = r / t;
    
    const positions: number[] = [
      -rt, rt2, r, rt, rt2, r, -rt, -rt2, r, rt, -rt2, r,
      r, rt2, -rt, r, -rt2, -rt, -r, rt2, -rt, -r, -rt2, -rt,
      rt2, r, rt, -rt2, r, rt, rt2, -r, rt, -rt2, -r, rt,
      rt, rt2, -rt, -rt, rt2, -rt, rt, -rt2, -rt, -rt, -rt2, -rt,
      rt2, r, -rt, rt2, -r, -rt, -rt2, r, -rt, -rt2, -r, -rt,
      r, rt, rt2, -r, rt, rt2, r, -rt, rt2, -r, -rt, rt2,
      r, rt, -rt2, -r, rt, -rt2, r, -rt, -rt2, -r, -rt, -rt2,
      rt2, rt, r, -rt2, rt, r, rt2, rt, -r, -rt2, rt, -r,
      rt2, -rt, r, -rt2, -rt, r, rt2, -rt, -r, -rt2, -rt, -r,
      rt, r, rt2, rt, -r, rt2, -rt, r, rt2, -rt, -r, rt2,
      rt, r, -rt2, rt, -r, -rt2, -rt, r, -rt2, -rt, -r, -rt2
    ];
    
    const indices: number[] = [
      0, 16, 2, 0, 2, 10, 16, 17, 1, 16, 1, 0,
      1, 17, 3, 1, 3, 11, 17, 19, 5, 17, 5, 3,
      5, 19, 7, 5, 7, 13, 19, 18, 4, 19, 4, 7,
      4, 18, 6, 4, 6, 12, 18, 16, 0, 18, 0, 6,
      2, 16, 20, 2, 20, 8, 20, 16, 18, 20, 18, 22,
      3, 17, 21, 3, 21, 9, 21, 17, 19, 21, 19, 23,
      7, 19, 23, 7, 23, 15, 23, 19, 21, 23, 21, 22,
      6, 18, 22, 6, 22, 14, 22, 18, 20, 22, 20, 23,
      10, 2, 8, 10, 8, 12, 8, 20, 22, 8, 22, 14,
      11, 3, 9, 11, 9, 13, 9, 21, 23, 9, 23, 15,
      13, 7, 15, 13, 15, 5, 15, 23, 22, 15, 22, 19,
      12, 6, 14, 12, 14, 4, 14, 22, 20, 14, 20, 18
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