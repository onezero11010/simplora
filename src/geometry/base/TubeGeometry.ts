import { Geometry } from '../Geometry';

export class TubeGeometry extends Geometry {
  constructor(path: number[][], radius: number = 1, tubularSegments: number = 64, radialSegments: number = 8, closed: boolean = false) {
    super();
    
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    
    const frames: { tangent: number[], normal: number[], binormal: number[] }[] = [];
    
    for (let i = 0; i < path.length; i++) {
      const p0 = path[Math.max(0, i - 1)];
      const p1 = path[i];
      const p2 = path[Math.min(path.length - 1, i + 1)];
      
      const tx = p2[0] - p0[0];
      const ty = p2[1] - p0[1];
      const tz = p2[2] - p0[2];
      const len = Math.sqrt(tx * tx + ty * ty + tz * tz);
      
      const tangent = [tx / len, ty / len, tz / len];
      
      let normal: number[];
      if (Math.abs(tangent[0]) < 0.9) {
        normal = [0, 1, 0];
      } else {
        normal = [1, 0, 0];
      }
      
      const bx = tangent[1] * normal[2] - tangent[2] * normal[1];
      const by = tangent[2] * normal[0] - tangent[0] * normal[2];
      const bz = tangent[0] * normal[1] - tangent[1] * normal[0];
      const blen = Math.sqrt(bx * bx + by * by + bz * bz);
      
      const binormal = [bx / blen, by / blen, bz / blen];
      
      const nx = binormal[1] * tangent[2] - binormal[2] * tangent[1];
      const ny = binormal[2] * tangent[0] - binormal[0] * tangent[2];
      const nz = binormal[0] * tangent[1] - binormal[1] * tangent[0];
      
      frames.push({ tangent, normal: [nx, ny, nz], binormal });
    }
    
    for (let i = 0; i <= tubularSegments; i++) {
      const pathIndex = Math.floor((i / tubularSegments) * (path.length - 1));
      const frame = frames[pathIndex];
      const point = path[pathIndex];
      
      for (let j = 0; j <= radialSegments; j++) {
        const theta = (j / radialSegments) * Math.PI * 2;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);
        
        const x = point[0] + radius * (cosTheta * frame.normal[0] + sinTheta * frame.binormal[0]);
        const y = point[1] + radius * (cosTheta * frame.normal[1] + sinTheta * frame.binormal[1]);
        const z = point[2] + radius * (cosTheta * frame.normal[2] + sinTheta * frame.binormal[2]);
        
        positions.push(x, y, z);
        
        const nx = cosTheta * frame.normal[0] + sinTheta * frame.binormal[0];
        const ny = cosTheta * frame.normal[1] + sinTheta * frame.binormal[1];
        const nz = cosTheta * frame.normal[2] + sinTheta * frame.binormal[2];
        normals.push(nx, ny, nz);
      }
    }
    
    for (let i = 0; i < tubularSegments; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = i * (radialSegments + 1) + j;
        const b = a + radialSegments + 1;
        
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }
    
    this.setVertices(positions);
    this.setNormals(normals);
    this.setIndices(indices);
  }
}