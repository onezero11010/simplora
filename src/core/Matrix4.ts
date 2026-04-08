export class Matrix4 {
  public elements: Float32Array;

  constructor() {
    this.elements = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }
  
  public static identity(): Matrix4 {
    return new Matrix4();
  }
  
  public static perspective(fov: number, aspect: number, near: number, far: number): Matrix4 {
    const matrix = new Matrix4();
    const f = 1.0 / Math.tan(fov / 2);
    const nf = 1 / (near - far);
    
    matrix.elements[0] = f / aspect;
    matrix.elements[5] = f;
    matrix.elements[10] = (far + near) * nf;
    matrix.elements[11] = -1;
    matrix.elements[14] = (2 * far * near) * nf;
    matrix.elements[15] = 0;
    
    return matrix;
  }
  
  public static lookAt(eye: [number, number, number], center: [number, number, number], up: [number, number, number]): Matrix4 {
    const matrix = new Matrix4();
    
    const zAxis = normalize(subtractVectors(eye, center));
    const xAxis = normalize(crossVectors(up, zAxis));
    const yAxis = crossVectors(zAxis, xAxis);
    
    matrix.elements[0] = xAxis[0];
    matrix.elements[1] = yAxis[0];
    matrix.elements[2] = zAxis[0];
    matrix.elements[3] = 0;
    
    matrix.elements[4] = xAxis[1];
    matrix.elements[5] = yAxis[1];
    matrix.elements[6] = zAxis[1];
    matrix.elements[7] = 0;
    
    matrix.elements[8] = xAxis[2];
    matrix.elements[9] = yAxis[2];
    matrix.elements[10] = zAxis[2];
    matrix.elements[11] = 0;
    
    matrix.elements[12] = -dotVectors(xAxis, eye);
    matrix.elements[13] = -dotVectors(yAxis, eye);
    matrix.elements[14] = -dotVectors(zAxis, eye);
    matrix.elements[15] = 1;
    
    return matrix;
  }
  
  public static translation(x: number, y: number, z: number): Matrix4 {
    const matrix = new Matrix4();
    matrix.elements[12] = x;
    matrix.elements[13] = y;
    matrix.elements[14] = z;
    return matrix;
  }
  
  public static rotationX(angle: number): Matrix4 {
    const matrix = new Matrix4();
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    
    matrix.elements[5] = c;
    matrix.elements[6] = s;
    matrix.elements[9] = -s;
    matrix.elements[10] = c;
    
    return matrix;
  }
  
  public static rotationY(angle: number): Matrix4 {
    const matrix = new Matrix4();
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    
    matrix.elements[0] = c;
    matrix.elements[2] = -s;
    matrix.elements[8] = s;
    matrix.elements[10] = c;
    
    return matrix;
  }
  
  public static rotationZ(angle: number): Matrix4 {
    const matrix = new Matrix4();
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    
    matrix.elements[0] = c;
    matrix.elements[1] = s;
    matrix.elements[4] = -s;
    matrix.elements[5] = c;
    
    return matrix;
  }
  
  public static scale(x: number, y: number, z: number): Matrix4 {
    const matrix = new Matrix4();
    matrix.elements[0] = x;
    matrix.elements[5] = y;
    matrix.elements[10] = z;
    return matrix;
  }
  
  public multiply(other: Matrix4): Matrix4 {
    const result = new Matrix4();
    const a = this.elements;
    const b = other.elements;
    const out = result.elements;
    
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        out[i * 4 + j] = 
          a[i * 4 + 0] * b[0 * 4 + j] +
          a[i * 4 + 1] * b[1 * 4 + j] +
          a[i * 4 + 2] * b[2 * 4 + j] +
          a[i * 4 + 3] * b[3 * 4 + j];
      }
    }
    
    return result;
  }
  
  public clone(): Matrix4 {
    const matrix = new Matrix4();
    matrix.elements.set(this.elements);
    return matrix;
  }
}

function normalize(v: [number, number, number]): [number, number, number] {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return [v[0] / len, v[1] / len, v[2] / len];
}

function subtractVectors(a: [number, number, number], b: [number, number, number]): [number, number, number] {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function crossVectors(a: [number, number, number], b: [number, number, number]): [number, number, number] {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

function dotVectors(a: [number, number, number], b: [number, number, number]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}