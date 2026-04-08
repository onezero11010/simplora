import { Geometry } from '../Geometry';

export class CapsuleGeometry extends Geometry {
  constructor(radius: number = 1, length: number = 1, radialSegments: number = 32, heightSegments: number = 16, capsSegments: number = 8) {
    super();
    
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    
    const halfLength = length / 2;
    
    // const cylinderTopIndex = 0;
    // const cylinderBottomIndex = (radialSegments + 1) * heightSegments;
    
    for (let y = 0; y <= heightSegments; y++) {
      const v = y / heightSegments;
      const yPos = halfLength - v * length;
      
      for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments;
        const theta = u * Math.PI * 2;
        
        const px = Math.cos(theta) * radius;
        const pz = Math.sin(theta) * radius;
        
        positions.push(px, yPos, pz);
        normals.push(px / radius, 0, pz / radius);
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
    
    const topCapStartIndex = positions.length / 3;
    for (let y = 0; y <= capsSegments; y++) {
      const v = y / capsSegments;
      const phi = v * Math.PI / 2;
      const yPos = halfLength + Math.sin(phi) * radius;
      const ringRadius = Math.cos(phi) * radius;
      
      for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments;
        const theta = u * Math.PI * 2;
        
        const px = Math.cos(theta) * ringRadius;
        const pz = Math.sin(theta) * ringRadius;
        
        positions.push(px, yPos, pz);
        normals.push(px / radius, Math.sin(phi), pz / radius);
      }
    }
    
    for (let y = 0; y < capsSegments; y++) {
      for (let x = 0; x < radialSegments; x++) {
        const a = topCapStartIndex + y * (radialSegments + 1) + x;
        const b = a + radialSegments + 1;
        
        indices.push(a, b, a + 1);
        indices.push(b, b + 1, a + 1);
      }
    }
    
    const bottomCapStartIndex = positions.length / 3;
    for (let y = 0; y <= capsSegments; y++) {
      const v = y / capsSegments;
      const phi = v * Math.PI / 2;
      const yPos = -halfLength - Math.sin(phi) * radius;
      const ringRadius = Math.cos(phi) * radius;
      
      for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments;
        const theta = u * Math.PI * 2;
        
        const px = Math.cos(theta) * ringRadius;
        const pz = Math.sin(theta) * ringRadius;
        
        positions.push(px, yPos, pz);
        normals.push(px / radius, -Math.sin(phi), pz / radius);
      }
    }
    
    for (let y = 0; y < capsSegments; y++) {
      for (let x = 0; x < radialSegments; x++) {
        const a = bottomCapStartIndex + y * (radialSegments + 1) + x;
        const b = a + radialSegments + 1;
        
        indices.push(a, b + 1, a + 1);
        indices.push(a, b, b + 1);
      }
    }
    
    this.setVertices(positions);
    this.setNormals(normals);
    this.setIndices(indices);
  }
}