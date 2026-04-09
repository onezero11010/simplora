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
    
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        out[col * 4 + row] = 
          a[0 * 4 + row] * b[col * 4 + 0] +
          a[1 * 4 + row] * b[col * 4 + 1] +
          a[2 * 4 + row] * b[col * 4 + 2] +
          a[3 * 4 + row] * b[col * 4 + 3];
      }
    }
    
    return result;
  }
  
  public clone(): Matrix4 {
    const matrix = new Matrix4();
    matrix.elements.set(this.elements);
    return matrix;
  }
  
  public static invert(src: Float32Array, dst: Float32Array): Float32Array {
    const s = src;
    const d = dst;
    
    const s00 = s[0], s01 = s[1], s02 = s[2], s03 = s[3];
    const s10 = s[4], s11 = s[5], s12 = s[6], s13 = s[7];
    const s20 = s[8], s21 = s[9], s22 = s[10], s23 = s[11];
    const s30 = s[12], s31 = s[13], s32 = s[14], s33 = s[15];
    
    const t00 = s00 * s11 - s01 * s10;
    const t01 = s00 * s12 - s02 * s10;
    const t02 = s00 * s13 - s03 * s10;
    const t03 = s01 * s12 - s02 * s11;
    const t04 = s01 * s13 - s03 * s11;
    const t05 = s02 * s13 - s03 * s12;
    const t06 = s20 * s31 - s21 * s30;
    const t07 = s20 * s32 - s22 * s30;
    const t08 = s20 * s33 - s23 * s30;
    const t09 = s21 * s32 - s22 * s31;
    const t10 = s21 * s33 - s23 * s31;
    const t11 = s22 * s33 - s23 * s32;
    
    let det = t00 * t11 - t01 * t10 + t02 * t09 + t03 * t08 - t04 * t07 + t05 * t06;
    
    if (!det) {
      return dst;
    }
    
    const invDet = 1.0 / det;
    
    d[0] = (s11 * t11 - s12 * t10 + s13 * t09) * invDet;
    d[1] = (s02 * t10 - s01 * t11 - s03 * t09) * invDet;
    d[2] = (s31 * t05 - s32 * t04 + s33 * t03) * invDet;
    d[3] = (s22 * t04 - s21 * t05 - s23 * t03) * invDet;
    
    d[4] = (s12 * t08 - s10 * t11 - s13 * t07) * invDet;
    d[5] = (s00 * t11 - s02 * t08 + s03 * t07) * invDet;
    d[6] = (s32 * t02 - s30 * t05 - s33 * t01) * invDet;
    d[7] = (s20 * t05 - s22 * t02 + s23 * t01) * invDet;
    
    d[8] = (s10 * t10 - s11 * t08 + s13 * t06) * invDet;
    d[9] = (s01 * t08 - s00 * t10 - s03 * t06) * invDet;
    d[10] = (s30 * t04 - s31 * t02 + s33 * t00) * invDet;
    d[11] = (s21 * t02 - s20 * t04 - s23 * t00) * invDet;
    
    d[12] = (s11 * t07 - s10 * t09 - s12 * t06) * invDet;
    d[13] = (s00 * t09 - s01 * t07 + s02 * t06) * invDet;
    d[14] = (s31 * t01 - s30 * t03 - s32 * t00) * invDet;
    d[15] = (s20 * t03 - s21 * t01 + s22 * t00) * invDet;
    
    return dst;
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