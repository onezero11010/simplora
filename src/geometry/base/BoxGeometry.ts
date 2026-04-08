import { Geometry } from '../Geometry';

export class BoxGeometry extends Geometry {
  constructor(width: number = 1, height: number = 1, depth: number = 1) {
    super();
    
    const x = width / 2;
    const y = height / 2;
    const z = depth / 2;
    
    const positions: number[] = [
      -x, -y, z,  x, -y, z,  x, y, z,  -x, y, z,
      x, -y, -z,  -x, -y, -z,  -x, y, -z,  x, y, -z,
      -x, y, z,  x, y, z,  x, y, -z,  -x, y, -z,
      -x, -y, -z,  x, -y, -z,  x, -y, z,  -x, -y, z,
      x, -y, z,  x, -y, -z,  x, y, -z,  x, y, z,
      -x, -y, -z,  -x, -y, z,  -x, y, z,  -x, y, -z
    ];
    
    const normals: number[] = [
      0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
      0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
      0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
      0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
      1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
      -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0
    ];
    
    const indices: number[] = [
      0, 1, 2,  0, 2, 3,
      4, 5, 6,  4, 6, 7,
      8, 9, 10,  8, 10, 11,
      12, 13, 14,  12, 14, 15,
      16, 17, 18,  16, 18, 19,
      20, 21, 22,  20, 22, 23
    ];
    
    this.setVertices(positions);
    this.setNormals(normals);
    this.setIndices(indices);
  }
}