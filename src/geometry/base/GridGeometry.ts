import { Geometry } from '../Geometry';

export class GridGeometry extends Geometry {
  constructor(size: number = 10, divisions: number = 10, centerX: number = 0, centerZ: number = 0) {
    super();
    
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    
    const halfSize = size / 2;
    const step = size / divisions;
    
    for (let i = 0; i <= divisions; i++) {
      const x = centerX - halfSize + i * step;
      positions.push(x, 0, centerX - halfSize);
      positions.push(x, 0, centerX + halfSize);
      normals.push(0, 1, 0);
      normals.push(0, 1, 0);
      
      const z = centerZ - halfSize + i * step;
      positions.push(centerX - halfSize, 0, z);
      positions.push(centerX + halfSize, 0, z);
      normals.push(0, 1, 0);
      normals.push(0, 1, 0);
    }
    
    for (let i = 0; i < positions.length / 3; i++) {
      indices.push(i);
    }
    
    this.setVertices(positions);
    this.setNormals(normals);
    this.setIndices(indices);
  }
}