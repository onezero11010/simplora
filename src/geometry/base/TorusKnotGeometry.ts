import { Geometry } from '../Geometry';

export class TorusKnotGeometry extends Geometry {
  constructor(radius: number = 1, tube: number = 0.3, tubularSegments: number = 100, radialSegments: number = 16, p: number = 2, q: number = 3) {
    super();
    
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    
    const P = p;
    const Q = q;
    
    for (let i = 0; i <= tubularSegments; i++) {
      const u = i / tubularSegments * Math.PI * 2;
      
      for (let j = 0; j <= radialSegments; j++) {
        const v = j / radialSegments * Math.PI * 2;
        
        const cx = (2 + Math.cos(Q * u)) * Math.cos(P * u);
        const cy = (2 + Math.cos(Q * u)) * Math.sin(P * u);
        const cz = Math.sin(Q * u);
        
        const tx = -P * Math.sin(P * u) * (2 + Math.cos(Q * u)) - Q * Math.cos(P * u) * Math.sin(Q * u);
        const ty = P * Math.cos(P * u) * (2 + Math.cos(Q * u)) - Q * Math.sin(P * u) * Math.sin(Q * u);
        const tz = Q * Math.cos(Q * u);
        
        const len = Math.sqrt(tx * tx + ty * ty + tz * tz);
        const nx = tx / len;
        const ny = ty / len;
        const nz = tz / len;
        
        const bx = Math.cos(v) * nx - Math.sin(v) * nz;
        const by = Math.cos(v) * ny;
        const bz = Math.sin(v) * nx + Math.cos(v) * nz;
        
        const x = (radius + tube * Math.cos(v)) * cx / (2 + Math.cos(Q * u));
        const y = (radius + tube * Math.cos(v)) * cy / (2 + Math.cos(Q * u));
        const z = (radius + tube * Math.cos(v)) * cz / (2 + Math.cos(Q * u));
        
        positions.push(x, y, z);
        normals.push(bx, by, bz);
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