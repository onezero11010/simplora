export class Geometry {
  protected vertices: number[];
  protected indices: number[];
  protected normals: number[];
  protected colors: number[];
  protected uvs: number[];

  constructor() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.colors = [];
    this.uvs = [];
  }
  
  public setVertices(vertices: number[]): void {
    this.vertices = vertices;
  }
  
  public setIndices(indices: number[]): void {
    this.indices = indices;
  }
  
  public setNormals(normals: number[]): void {
    this.normals = normals;
  }
  
  public setColors(colors: number[]): void {
    this.colors = colors;
  }
  
  public setUVs(uvs: number[]): void {
    this.uvs = uvs;
  }
  
  public getVertices(): number[] {
    return this.vertices;
  }
  
  public getIndices(): number[] {
    return this.indices;
  }
  
  public getNormals(): number[] {
    return this.normals;
  }
  
  public getColors(): number[] {
    return this.colors;
  }
  
  public getUVs(): number[] {
    return this.uvs;
  }
}