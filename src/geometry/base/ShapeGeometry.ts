import { Geometry } from '../Geometry';

export class ShapeGeometry extends Geometry {
  constructor(shape: number[][], curveSegments: number = 12) {
    super();
    
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    
    const center = this.calculateCenter(shape);
    
    positions.push(center[0], center[1], 0);
    normals.push(0, 0, 1);
    
    for (let i = 0; i <= curveSegments; i++) {
      const t = i / curveSegments;
      const index = Math.floor(t * (shape.length - 1));
      const nextIndex = Math.min(index + 1, shape.length - 1);
      const localT = (t * (shape.length - 1)) - index;
      
      const x = shape[index][0] + (shape[nextIndex][0] - shape[index][0]) * localT;
      const y = shape[index][1] + (shape[nextIndex][1] - shape[index][1]) * localT;
      
      positions.push(x, y, 0);
      normals.push(0, 0, 1);
    }
    
    for (let i = 1; i <= curveSegments; i++) {
      indices.push(0, i, i + 1);
    }
    
    this.setVertices(positions);
    this.setNormals(normals);
    this.setIndices(indices);
  }
  
  private calculateCenter(points: number[][]): number[] {
    let cx = 0, cy = 0;
    for (const point of points) {
      cx += point[0];
      cy += point[1];
    }
    return [cx / points.length, cy / points.length];
  }
}