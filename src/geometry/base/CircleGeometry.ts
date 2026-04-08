import { Geometry } from '../Geometry';

export class CircleGeometry extends Geometry {
  constructor(radius: number = 1, segments: number = 32) {
    super();
    
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    
    positions.push(0, 0, 0);
    normals.push(0, 0, 1);
    
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      
      positions.push(x, y, 0);
      normals.push(0, 0, 1);
    }
    
    for (let i = 1; i <= segments; i++) {
      indices.push(0, i, i + 1);
    }
    
    this.setVertices(positions);
    this.setNormals(normals);
    this.setIndices(indices);
  }
}