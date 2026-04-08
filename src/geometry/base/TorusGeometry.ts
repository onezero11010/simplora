import { Geometry } from '../Geometry';

export class TorusGeometry extends Geometry {
  constructor(radius: number = 1, tube: number = 0.4, radialSegments: number = 16, tubularSegments: number = 100) {
    super();
    
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    
    for (let j = 0; j <= radialSegments; j++) {
      for (let i = 0; i <= tubularSegments; i++) {
        const u = i / tubularSegments * Math.PI * 2;
        const v = j / radialSegments * Math.PI * 2;
        
        const x = (radius + tube * Math.cos(v)) * Math.cos(u);
        const y = (radius + tube * Math.cos(v)) * Math.sin(u);
        const z = tube * Math.sin(v);
        
        positions.push(x, y, z);
        
        const nx = Math.cos(v) * Math.cos(u);
        const ny = Math.cos(v) * Math.sin(u);
        const nz = Math.sin(v);
        normals.push(nx, ny, nz);
      }
    }
    
    for (let j = 1; j <= radialSegments; j++) {
      for (let i = 1; i <= tubularSegments; i++) {
        const a = (tubularSegments + 1) * j + i - 1;
        const b = (tubularSegments + 1) * (j - 1) + i - 1;
        const c = (tubularSegments + 1) * (j - 1) + i;
        const d = (tubularSegments + 1) * j + i;
        
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }
    
    this.setVertices(positions);
    this.setNormals(normals);
    this.setIndices(indices);
  }
}