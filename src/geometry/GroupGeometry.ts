import { Geometry } from './Geometry';

export interface GeometryPart {
  geometry: Geometry;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export class GroupGeometry extends Geometry {
  private parts: GeometryPart[];

  constructor() {
    super();
    this.parts = [];
  }

  public add(geometry: Geometry, position: [number, number, number] = [0, 0, 0], rotation: [number, number, number] = [0, 0, 0], scale: [number, number, number] = [1, 1, 1]): void {
    this.parts.push({ geometry, position, rotation, scale });
    this.rebuild();
  }

  public remove(index: number): void {
    if (index >= 0 && index < this.parts.length) {
      this.parts.splice(index, 1);
      this.rebuild();
    }
  }

  public clear(): void {
    this.parts = [];
    this.rebuild();
  }

  private rebuild(): void {
    const allVertices: number[] = [];
    const allNormals: number[] = [];
    const allIndices: number[] = [];
    let vertexOffset = 0;

    for (const part of this.parts) {
      const vertices = part.geometry.getVertices();
      const normals = part.geometry.getNormals();
      const indices = part.geometry.getIndices();

      const transformedVertices = this.transformVertices(vertices, part.position, part.rotation, part.scale);
      const transformedNormals = this.transformNormals(normals, part.rotation);

      allVertices.push(...transformedVertices);
      allNormals.push(...transformedNormals);

      for (const index of indices) {
        allIndices.push(index + vertexOffset);
      }

      vertexOffset += vertices.length / 3;
    }

    this.setVertices(allVertices);
    this.setNormals(allNormals);
    this.setIndices(allIndices);
  }

  private transformVertices(vertices: number[], position: [number, number, number], rotation: [number, number, number], scale: [number, number, number]): number[] {
    const result: number[] = [];
    const [rx, ry, rz] = rotation;
    const [sx, sy, sz] = scale;
    const [px, py, pz] = position;

    const cosX = Math.cos(rx), sinX = Math.sin(rx);
    const cosY = Math.cos(ry), sinY = Math.sin(ry);
    const cosZ = Math.cos(rz), sinZ = Math.sin(rz);

    for (let i = 0; i < vertices.length; i += 3) {
      let x = vertices[i] * sx;
      let y = vertices[i + 1] * sy;
      let z = vertices[i + 2] * sz;

      let y1 = y * cosX - z * sinX;
      let z1 = y * sinX + z * cosX;
      y = y1;
      z = z1;

      let x1 = x * cosY + z * sinY;
      z1 = -x * sinY + z * cosY;
      x = x1;
      z = z1;

      x1 = x * cosZ - y * sinZ;
      let y2 = x * sinZ + y * cosZ;
      x = x1;
      y = y2;

      result.push(x + px, y + py, z + pz);
    }

    return result;
  }

  private transformNormals(normals: number[], rotation: [number, number, number]): number[] {
    const result: number[] = [];
    const [rx, ry, rz] = rotation;

    const cosX = Math.cos(rx), sinX = Math.sin(rx);
    const cosY = Math.cos(ry), sinY = Math.sin(ry);
    const cosZ = Math.cos(rz), sinZ = Math.sin(rz);

    for (let i = 0; i < normals.length; i += 3) {
      let x = normals[i];
      let y = normals[i + 1];
      let z = normals[i + 2];

      let y1 = y * cosX - z * sinX;
      let z1 = y * sinX + z * cosX;
      y = y1;
      z = z1;

      let x1 = x * cosY + z * sinY;
      z1 = -x * sinY + z * cosY;
      x = x1;
      z = z1;

      x1 = x * cosZ - y * sinZ;
      let y2 = x * sinZ + y * cosZ;
      x = x1;
      y = y2;

      result.push(x, y, z);
    }

    return result;
  }
}