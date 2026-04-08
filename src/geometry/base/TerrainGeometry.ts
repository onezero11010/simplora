import { Geometry } from '../Geometry';

export class TerrainGeometry extends Geometry {
  constructor(width: number = 100, height: number = 100, widthSegments: number = 100, heightSegments: number = 100, heightMap?: number[][]) {
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
        let z = 0;
        
        if (heightMap && heightMap[iy] && heightMap[iy][ix] !== undefined) {
          z = heightMap[iy][ix];
        }
        
        positions.push(x, z, y);
        normals.push(0, 1, 0);
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
    
    for (let iy = 1; iy < heightSegments; iy++) {
      for (let ix = 1; ix < widthSegments; ix++) {
        const idx = iy * gridX + ix;
        
        const hL = positions[(idx - 1) * 3 + 1];
        const hR = positions[(idx + 1) * 3 + 1];
        const hD = positions[(idx - gridX) * 3 + 1];
        const hU = positions[(idx + gridX) * 3 + 1];
        
        const nx = hL - hR;
        const ny = 2;
        const nz = hD - hU;
        
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
        normals[idx * 3] = nx / len;
        normals[idx * 3 + 1] = ny / len;
        normals[idx * 3 + 2] = nz / len;
      }
    }
    
    this.setVertices(positions);
    this.setNormals(normals);
    this.setIndices(indices);
  }
}