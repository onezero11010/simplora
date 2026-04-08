import { Geometry } from '../Geometry';

export class PlaneGeometry extends Geometry {
  constructor(width: number = 1, height: number = 1, widthSegments: number = 1, heightSegments: number = 1) {
    super();
    
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    const gridX = widthSegments + 1;
    const gridY = heightSegments + 1;
    
    for (let iy = 0; iy < gridY; iy++) {
      const y = (iy / heightSegments) * height - halfHeight;
      
      for (let ix = 0; ix < gridX; ix++) {
        const x = (ix / widthSegments) * width - halfWidth;
        
        positions.push(x, y, 0);
        normals.push(0, 0, 1);
      }
    }
    
    for (let iy = 0; iy < heightSegments; iy++) {
      for (let ix = 0; ix < widthSegments; ix++) {
        const a = iy * gridX + ix;
        const b = a + gridX;
        
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }
    
    this.setVertices(positions);
    this.setNormals(normals);
    this.setIndices(indices);
  }
}