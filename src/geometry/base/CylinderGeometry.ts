import { Geometry } from '../Geometry';

export class CylinderGeometry extends Geometry {
  constructor(radiusTop: number = 1, radiusBottom: number = 1, height: number = 1, radialSegments: number = 32, heightSegments: number = 1) {
    super();
    
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    
    const halfHeight = height / 2;
    // const indexOffset = radialSegments * (heightSegments + 1);
    
    for (let y = 0; y <= heightSegments; y++) {
      const v = y / heightSegments;
      const radius = radiusTop + (radiusBottom - radiusTop) * v;
      const yPos = halfHeight - v * height;
      
      for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments;
        const theta = u * Math.PI * 2;
        
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);
        
        const px = cosTheta * radius;
        const pz = sinTheta * radius;
        
        positions.push(px, yPos, pz);
        
        const slope = (radiusBottom - radiusTop) / height;
        const normalLength = Math.sqrt(1 + slope * slope);
        const nx = cosTheta * slope / normalLength;
        const nz = sinTheta * slope / normalLength;
        const ny = 1 / normalLength;
        normals.push(nx, ny, nz);
      }
    }
    
    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < radialSegments; x++) {
        const a = y * (radialSegments + 1) + x;
        const b = a + radialSegments + 1;
        
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }
    
    if (radiusTop > 0) {
      const topCenterIndex = positions.length / 3;
      positions.push(0, halfHeight, 0);
      normals.push(0, 1, 0);
      
      for (let x = 0; x <= radialSegments; x++) {
        const theta = (x / radialSegments) * Math.PI * 2;
        positions.push(Math.cos(theta) * radiusTop, halfHeight, Math.sin(theta) * radiusTop);
        normals.push(0, 1, 0);
      }
      
      for (let x = 0; x < radialSegments; x++) {
        indices.push(topCenterIndex, topCenterIndex + x + 1, topCenterIndex + x + 2);
      }
    }
    
    if (radiusBottom > 0) {
      const bottomCenterIndex = positions.length / 3;
      positions.push(0, -halfHeight, 0);
      normals.push(0, -1, 0);
      
      for (let x = 0; x <= radialSegments; x++) {
        const theta = (x / radialSegments) * Math.PI * 2;
        positions.push(Math.cos(theta) * radiusBottom, -halfHeight, Math.sin(theta) * radiusBottom);
        normals.push(0, -1, 0);
      }
      
      for (let x = 0; x < radialSegments; x++) {
        indices.push(bottomCenterIndex, bottomCenterIndex + x + 2, bottomCenterIndex + x + 1);
      }
    }
    
    this.setVertices(positions);
    this.setNormals(normals);
    this.setIndices(indices);
  }
}