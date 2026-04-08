import { Geometry } from '../Geometry';

export class StarGeometry extends Geometry {
  constructor(points: number = 5, outerRadius: number = 1, innerRadius: number = 0.5, depth: number = 0.2) {
    super();
    
    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    
    const angleStep = Math.PI / points;
    const totalPoints = points * 2;
    
    for (let i = 0; i < totalPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      positions.push(x, y, depth);
      positions.push(x, y, -depth);
      normals.push(0, 0, 1);
      normals.push(0, 0, -1);
    }
    
    const centerTop = positions.length / 3;
    positions.push(0, 0, depth);
    normals.push(0, 0, 1);
    
    const centerBottom = positions.length / 3;
    positions.push(0, 0, -depth);
    normals.push(0, 0, -1);
    
    for (let i = 0; i < totalPoints; i++) {
      const next = (i + 1) % totalPoints;
      indices.push(centerTop, i * 2, next * 2);
      indices.push(centerBottom, next * 2 + 1, i * 2 + 1);
      
      indices.push(i * 2, next * 2, next * 2 + 1);
      indices.push(i * 2, next * 2 + 1, i * 2 + 1);
    }
    
    this.setVertices(positions);
    this.setNormals(normals);
    this.setIndices(indices);
  }
}