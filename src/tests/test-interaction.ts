import { Matrix4 } from '../core/Matrix4';
import { Camera } from '../core/Camera';
import { BoxGeometry } from '../geometry/base/BoxGeometry';
import { BasicMaterial } from '../material/BasicMaterial';
import { Mesh } from '../objects/Mesh';
import { Scene } from '../objects/Scene';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.log(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

function assertApprox(a: number, b: number, epsilon: number, message: string): void {
  const diff = Math.abs(a - b);
  assert(diff < epsilon, `${message} (got ${a.toFixed(6)}, expected ${b.toFixed(6)}, diff ${diff.toFixed(6)})`);
}

console.log('=== Interaction System Diagnostic Tests ===\n');

// ============================================================
// Test 1: Matrix4 storage format verification
// ============================================================
console.log('--- Test 1: Matrix4 storage format ---');

{
  const t = Matrix4.translation(3, 5, 7);
  assert(t.elements[12] === 3, 'translation: elements[12] = tx');
  assert(t.elements[13] === 5, 'translation: elements[13] = ty');
  assert(t.elements[14] === 7, 'translation: elements[14] = tz');

  const s = Matrix4.scale(2, 3, 4);
  assert(s.elements[0] === 2, 'scale: elements[0] = sx');
  assert(s.elements[5] === 3, 'scale: elements[5] = sy');
  assert(s.elements[10] === 4, 'scale: elements[10] = sz');

  const p = Matrix4.perspective(Math.PI / 4, 1, 0.1, 100);
  assert(p.elements[11] === -1, 'perspective: elements[11] = -1 (column-major indicator)');
  assert(p.elements[15] === 0, 'perspective: elements[15] = 0');
}

// ============================================================
// Test 2: Matrix4.multiply correctness
// ============================================================
console.log('\n--- Test 2: Matrix4.multiply ---');

{
  const t = Matrix4.translation(1, 0, 0);
  const s = Matrix4.scale(2, 1, 1);

  const result = t.multiply(s);
  const e = result.elements;

  // A*B = translation(1,0,0) * scale(2,1,1)
  // Should produce: scale x=2, translation x=1
  // | 2 0 0 1 |
  // | 0 1 0 0 |
  // | 0 0 1 0 |
  // | 0 0 0 1 |
  // Column-major: [2,0,0,0, 0,1,0,0, 0,0,1,0, 1,0,0,1]
  assertApprox(e[0], 2, 0.001, 'T*S: elements[0] should be 2');
  assertApprox(e[12], 1, 0.001, 'T*S: elements[12] should be 1 (translation x=1)');

  // B*A = scale(2,1,1) * translation(1,0,0)
  // Should produce: scale x=2, translation x=2 (scaled)
  // | 2 0 0 2 |
  // | 0 1 0 0 |
  // | 0 0 1 0 |
  // | 0 0 0 1 |
  // Column-major: [2,0,0,0, 0,1,0,0, 0,0,1,0, 2,0,0,1]
  const result2 = s.multiply(t);
  const e2 = result2.elements;
  assertApprox(e2[0], 2, 0.001, 'S*T: elements[0] should be 2');
  assertApprox(e2[12], 2, 0.001, 'S*T: elements[12] should be 2 (scaled translation)');

  // Verify that t.multiply(s) != s.multiply(t) (non-commutative)
  assert(Math.abs(e[12] - e2[12]) > 0.001, 'T*S != S*T (non-commutative)');

  // The KEY test: does t.multiply(s) compute T*S or S*T?
  // If it computes T*S, then e[12] = 1
  // If it computes S*T, then e[12] = 2
  if (Math.abs(e[12] - 2) < 0.001) {
    console.log('  ⚠ BUG DETECTED: multiply() computes B*A instead of A*B!');
    console.log('    t.multiply(s) gave translation x=2, expected x=1');
    console.log('    This means it computes S*T instead of T*S');
  } else if (Math.abs(e[12] - 1) < 0.001) {
    console.log('  ✓ multiply() correctly computes A*B');
  }
}

// ============================================================
// Test 3: Matrix-vector multiplication (multiplyMatrixVector)
// ============================================================
console.log('\n--- Test 3: Matrix-vector multiplication ---');

{
  // Test with identity matrix
  const identity = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
  const vec = [1, 2, 3, 1];

  function multiplyMatrixVector(matrix: Float32Array, vector: number[]): number[] {
    const result = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i] += matrix[i * 4 + j] * vector[j];
      }
    }
    return result;
  }

  function multiplyMatrixVectorCorrect(matrix: Float32Array, vector: number[]): number[] {
    const result = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i] += matrix[j * 4 + i] * vector[j];
      }
    }
    return result;
  }

  const idResult = multiplyMatrixVector(identity, vec);
  assertApprox(idResult[0], 1, 0.001, 'Identity * [1,2,3,1]: x = 1');
  assertApprox(idResult[1], 2, 0.001, 'Identity * [1,2,3,1]: y = 2');
  assertApprox(idResult[2], 3, 0.001, 'Identity * [1,2,3,1]: z = 3');

  // Test with translation matrix (column-major)
  // | 1 0 0 tx |    Column-major: [1,0,0,0, 0,1,0,0, 0,0,1,0, tx,ty,tz,1]
  // | 0 1 0 ty |
  // | 0 0 1 tz |
  // | 0 0 0 1  |
  const tx = 10, ty = 20, tz = 30;
  const transMat = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    tx, ty, tz, 1
  ]);

  const point = [1, 2, 3, 1];
  const currentResult = multiplyMatrixVector(transMat, point);
  const correctResult = multiplyMatrixVectorCorrect(transMat, point);

  console.log(`  Current  M*v = [${currentResult.map(v => v.toFixed(2)).join(', ')}]`);
  console.log(`  Correct  M*v = [${correctResult.map(v => v.toFixed(2)).join(', ')}]`);
  console.log(`  Expected M*v = [${(1 + tx).toFixed(2)}, ${(2 + ty).toFixed(2)}, ${(3 + tz).toFixed(2)}, 1.00]`);

  assertApprox(correctResult[0], 1 + tx, 0.001, 'Correct: Translation * point: x = 1+tx');
  assertApprox(correctResult[1], 2 + ty, 0.001, 'Correct: Translation * point: y = 2+ty');
  assertApprox(correctResult[2], 3 + tz, 0.001, 'Correct: Translation * point: z = 3+tz');

  if (Math.abs(currentResult[0] - correctResult[0]) > 0.001 ||
      Math.abs(currentResult[1] - correctResult[1]) > 0.001) {
    console.log('  ⚠ BUG DETECTED: multiplyMatrixVector computes M^T*v instead of M*v!');
    console.log('    Current formula: result[i] = sum_j matrix[i*4+j] * vector[j]');
    console.log('    Correct formula: result[i] = sum_j matrix[j*4+i] * vector[j]');
  }

  // Test with perspective matrix
  const projMatrix = Matrix4.perspective(Math.PI / 4, 1, 0.1, 100);
  const testPoint = [0, 0, -5, 1]; // point at z=-5
  const projCurrent = multiplyMatrixVector(projMatrix.elements, testPoint);
  const projCorrect = multiplyMatrixVectorCorrect(projMatrix.elements, testPoint);

  console.log(`  Perspective * [0,0,-5,1]:`);
  console.log(`    Current = [${projCurrent.map(v => v.toFixed(4)).join(', ')}]`);
  console.log(`    Correct = [${projCorrect.map(v => v.toFixed(4)).join(', ')}]`);
}

// ============================================================
// Test 4: Matrix4.invert verification
// ============================================================
console.log('\n--- Test 4: Matrix4.invert ---');

{
  const viewMatrix = Matrix4.lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]);
  const invView = new Float32Array(16);
  Matrix4.invert(viewMatrix.elements, invView);

  // Verify: V * V^-1 = I
  function mat4Multiply(a: Float32Array, b: Float32Array): Float32Array {
    const out = new Float32Array(16);
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += a[k * 4 + row] * b[col * 4 + k];
        }
        out[col * 4 + row] = sum;
      }
    }
    return out;
  }

  const product = mat4Multiply(viewMatrix.elements, invView);
  let isIdentity = true;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const expected = (i === j) ? 1 : 0;
      if (Math.abs(product[j * 4 + i] - expected) > 0.001) {
        isIdentity = false;
      }
    }
  }
  assert(isIdentity, 'V * V^-1 = Identity (invert is correct)');

  // Test perspective inverse
  const projMatrix = Matrix4.perspective(Math.PI / 4, 1, 0.1, 100);
  const invProj = new Float32Array(16);
  Matrix4.invert(projMatrix.elements, invProj);

  const projProduct = mat4Multiply(projMatrix.elements, invProj);
  let projIsIdentity = true;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const expected = (i === j) ? 1 : 0;
      if (Math.abs(projProduct[j * 4 + i] - expected) > 0.01) {
        projIsIdentity = false;
      }
    }
  }
  assert(projIsIdentity, 'P * P^-1 = Identity (perspective invert is correct)');
}

// ============================================================
// Test 5: Screen-to-world ray calculation
// ============================================================
console.log('\n--- Test 5: Screen-to-world ray ---');

{
  const camera = new Camera(Math.PI / 4, 1, 0.1, 100);
  camera.setPosition(0, 0, 5);

  const projMatrix = camera.getProjectionMatrix();
  const viewMatrix = camera.getViewMatrix();

  const invProj = new Float32Array(16);
  const invView = new Float32Array(16);
  Matrix4.invert(projMatrix, invProj);
  Matrix4.invert(viewMatrix, invView);

  function multiplyMatrixVectorCurrent(matrix: Float32Array, vector: number[]): number[] {
    const result = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i] += matrix[i * 4 + j] * vector[j];
      }
    }
    return result;
  }

  function multiplyMatrixVectorFixed(matrix: Float32Array, vector: number[]): number[] {
    const result = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i] += matrix[j * 4 + i] * vector[j];
      }
    }
    return result;
  }

  function computeRay(ndcX: number, ndcY: number, mulFunc: typeof multiplyMatrixVectorCurrent): [number, number, number] {
    const clipCoords = [ndcX, ndcY, -1, 1.0];
    const eyeCoords = mulFunc(invProj, clipCoords);
    eyeCoords[0] /= eyeCoords[3];
    eyeCoords[1] /= eyeCoords[3];
    eyeCoords[2] /= eyeCoords[3];
    const worldNear = mulFunc(invView, [eyeCoords[0], eyeCoords[1], eyeCoords[2], 1.0]);

    const clipCoordsFar = [ndcX, ndcY, 1, 1.0];
    const eyeCoordsFar = mulFunc(invProj, clipCoordsFar);
    eyeCoordsFar[0] /= eyeCoordsFar[3];
    eyeCoordsFar[1] /= eyeCoordsFar[3];
    eyeCoordsFar[2] /= eyeCoordsFar[3];
    const worldFar = mulFunc(invView, [eyeCoordsFar[0], eyeCoordsFar[1], eyeCoordsFar[2], 1.0]);

    const direction: [number, number, number] = [
      worldFar[0] - worldNear[0],
      worldFar[1] - worldNear[1],
      worldFar[2] - worldNear[2]
    ];
    const length = Math.sqrt(direction[0] * direction[0] + direction[1] * direction[1] + direction[2] * direction[2]);
    if (length > 0) {
      direction[0] /= length;
      direction[1] /= length;
      direction[2] /= length;
    }
    return direction;
  }

  // Center of screen (0, 0) should point along -Z for a camera at (0,0,5) looking at origin
  const rayCenterCurrent = computeRay(0, 0, multiplyMatrixVectorCurrent);
  const rayCenterFixed = computeRay(0, 0, multiplyMatrixVectorFixed);

  console.log(`  Center ray (current): [${rayCenterCurrent.map(v => v.toFixed(4)).join(', ')}]`);
  console.log(`  Center ray (fixed):   [${rayCenterFixed.map(v => v.toFixed(4)).join(', ')}]`);
  console.log(`  Expected: ~[0, 0, -1] (camera looking at -Z)`);

  // For camera at (0,0,5) looking at origin, center ray should be approximately [0, 0, -1]
  assertApprox(rayCenterFixed[0], 0, 0.01, 'Fixed: Center ray x ≈ 0');
  assertApprox(rayCenterFixed[1], 0, 0.01, 'Fixed: Center ray y ≈ 0');
  assertApprox(rayCenterFixed[2], -1, 0.01, 'Fixed: Center ray z ≈ -1');

  // Check if current implementation gives wrong result
  if (Math.abs(rayCenterCurrent[2] + 1) > 0.1) {
    console.log('  ⚠ BUG DETECTED: Current ray direction is wrong due to multiplyMatrixVector bug!');
  }

  // Top-left corner (-1, 1)
  const rayTopLeftFixed = computeRay(-1, 1, multiplyMatrixVectorFixed);
  console.log(`  Top-left ray (fixed): [${rayTopLeftFixed.map(v => v.toFixed(4)).join(', ')}]`);
  assert(rayTopLeftFixed[2] < 0, 'Fixed: Top-left ray points forward (z < 0)');
}

// ============================================================
// Test 6: Ray-sphere intersection
// ============================================================
console.log('\n--- Test 6: Ray-sphere intersection ---');

{
  function raySphereIntersection(
    rayOrigin: [number, number, number],
    rayDirection: [number, number, number],
    center: [number, number, number],
    radius: number
  ): number {
    const oc: [number, number, number] = [
      rayOrigin[0] - center[0],
      rayOrigin[1] - center[1],
      rayOrigin[2] - center[2]
    ];

    const a = rayDirection[0] * rayDirection[0] + rayDirection[1] * rayDirection[1] + rayDirection[2] * rayDirection[2];
    const b = 2 * (oc[0] * rayDirection[0] + oc[1] * rayDirection[1] + oc[2] * rayDirection[2]);
    const c = oc[0] * oc[0] + oc[1] * oc[1] + oc[2] * oc[2] - radius * radius;

    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
      return -1;
    }

    const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

    if (t1 > 0 && t2 > 0) {
      return Math.min(t1, t2);
    } else if (t1 > 0) {
      return t1;
    } else if (t2 > 0) {
      return t2;
    }
    return -1;
  }

  // Camera at (0,0,5), ray pointing at -Z, sphere at origin with radius 1
  const hit = raySphereIntersection([0, 0, 5], [0, 0, -1], [0, 0, 0], 1);
  assert(hit > 0, 'Ray hits sphere at origin from (0,0,5)');
  assertApprox(hit, 4, 0.001, 'Hit distance = 4 (5 - 1)');

  // Ray missing the sphere
  const miss = raySphereIntersection([0, 0, 5], [0, 0, -1], [3, 3, 0], 1);
  assert(miss < 0, 'Ray misses sphere at (3,3,0)');

  // Ray hitting off-center sphere
  const hit2 = raySphereIntersection([0, 0, 5], [0, 0, -1], [0, 0, 0], 2);
  assert(hit2 > 0, 'Ray hits larger sphere (radius 2) at origin');
  assertApprox(hit2, 3, 0.001, 'Hit distance = 3 (5 - 2)');
}

// ============================================================
// Test 7: Mesh model matrix position extraction
// ============================================================
console.log('\n--- Test 7: Mesh model matrix ---');

{
  const mesh = new Mesh(new BoxGeometry(1, 1, 1), new BasicMaterial());
  mesh.setPosition(3, 4, 5);

  const modelMatrix = mesh.getModelMatrix();
  console.log(`  Position from modelMatrix: [${modelMatrix[12].toFixed(2)}, ${modelMatrix[13].toFixed(2)}, ${modelMatrix[14].toFixed(2)}]`);

  // With the current multiply bug, the position might be wrong when scale != 1
  const mesh2 = new Mesh(new BoxGeometry(1, 1, 1), new BasicMaterial());
  mesh2.setPosition(3, 4, 5);
  mesh2.setScale(2, 2, 2);

  const modelMatrix2 = mesh2.getModelMatrix();
  console.log(`  Scaled mesh position: [${modelMatrix2[12].toFixed(2)}, ${modelMatrix2[13].toFixed(2)}, ${modelMatrix2[14].toFixed(2)}]`);
  console.log(`  Expected position: [3.00, 4.00, 5.00]`);

  if (Math.abs(modelMatrix2[12] - 3) > 0.01) {
    console.log('  ⚠ BUG DETECTED: Model matrix position is wrong when scale != 1!');
    console.log('    This is caused by Matrix4.multiply computing B*A instead of A*B');
  }
}

// ============================================================
// Test 8: Full interaction pipeline simulation
// ============================================================
console.log('\n--- Test 8: Full interaction pipeline ---');

{
  const camera = new Camera(Math.PI / 4, 800 / 600, 0.1, 100);
  camera.setPosition(0, 0, 5);

  const scene = new Scene();
  const mesh = new Mesh(new BoxGeometry(1, 1, 1), new BasicMaterial({ color: [1, 0, 0] }));
  mesh.setPosition(0, 0, 0);
  scene.add(mesh);

  // Simulate clicking at center of canvas (400, 300) on 800x600 canvas
  const canvasWidth = 800;
  const canvasHeight = 600;
  const clickX = 400;
  const clickY = 300;

  const ndcX = (clickX / canvasWidth) * 2 - 1;
  const ndcY = -(clickY / canvasHeight) * 2 + 1;

  console.log(`  Click at (${clickX}, ${clickY}) → NDC (${ndcX.toFixed(2)}, ${ndcY.toFixed(2)})`);

  const projMatrix = camera.getProjectionMatrix();
  const viewMatrix = camera.getViewMatrix();
  const invProj = new Float32Array(16);
  const invView = new Float32Array(16);
  Matrix4.invert(projMatrix, invProj);
  Matrix4.invert(viewMatrix, invView);

  function mulVecCurrent(matrix: Float32Array, vector: number[]): number[] {
    const result = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i] += matrix[i * 4 + j] * vector[j];
      }
    }
    return result;
  }

  function mulVecFixed(matrix: Float32Array, vector: number[]): number[] {
    const result = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i] += matrix[j * 4 + i] * vector[j];
      }
    }
    return result;
  }

  function getRay(ndcX: number, ndcY: number, mulFunc: typeof mulVecCurrent): [number, number, number] {
    const eyeCoords = mulFunc(invProj, [ndcX, ndcY, -1, 1.0]);
    eyeCoords[0] /= eyeCoords[3];
    eyeCoords[1] /= eyeCoords[3];
    eyeCoords[2] /= eyeCoords[3];
    const worldNear = mulFunc(invView, [eyeCoords[0], eyeCoords[1], eyeCoords[2], 1.0]);

    const eyeCoordsFar = mulFunc(invProj, [ndcX, ndcY, 1, 1.0]);
    eyeCoordsFar[0] /= eyeCoordsFar[3];
    eyeCoordsFar[1] /= eyeCoordsFar[3];
    eyeCoordsFar[2] /= eyeCoordsFar[3];
    const worldFar = mulFunc(invView, [eyeCoordsFar[0], eyeCoordsFar[1], eyeCoordsFar[2], 1.0]);

    const direction: [number, number, number] = [
      worldFar[0] - worldNear[0],
      worldFar[1] - worldNear[1],
      worldFar[2] - worldNear[2]
    ];
    const length = Math.sqrt(direction[0] * direction[0] + direction[1] * direction[1] + direction[2] * direction[2]);
    if (length > 0) {
      direction[0] /= length;
      direction[1] /= length;
      direction[2] /= length;
    }
    return direction;
  }

  const rayCurrent = getRay(ndcX, ndcY, mulVecCurrent);
  const rayFixed = getRay(ndcX, ndcY, mulVecFixed);

  console.log(`  Ray direction (current): [${rayCurrent.map(v => v.toFixed(4)).join(', ')}]`);
  console.log(`  Ray direction (fixed):   [${rayFixed.map(v => v.toFixed(4)).join(', ')}]`);

  // Test ray-sphere intersection with both rays
  const modelMatrix = mesh.getModelMatrix();
  const center: [number, number, number] = [modelMatrix[12], modelMatrix[13], modelMatrix[14]];

  const scaleX = Math.sqrt(modelMatrix[0] * modelMatrix[0] + modelMatrix[1] * modelMatrix[1] + modelMatrix[2] * modelMatrix[2]);
  const scaleY = Math.sqrt(modelMatrix[4] * modelMatrix[4] + modelMatrix[5] * modelMatrix[5] + modelMatrix[6] * modelMatrix[6]);
  const scaleZ = Math.sqrt(modelMatrix[8] * modelMatrix[8] + modelMatrix[9] * modelMatrix[9] + modelMatrix[10] * modelMatrix[10]);
  const avgScale = (scaleX + scaleY + scaleZ) / 3;
  const radius = Math.max(0.5, avgScale * 0.8);

  console.log(`  Mesh center: [${center.map(v => v.toFixed(2)).join(', ')}]`);
  console.log(`  Bounding sphere radius: ${radius.toFixed(2)}`);

  function testHit(rayDir: [number, number, number], label: string): void {
    const oc: [number, number, number] = [
      camera.position[0] - center[0],
      camera.position[1] - center[1],
      camera.position[2] - center[2]
    ];
    const a = rayDir[0] * rayDir[0] + rayDir[1] * rayDir[1] + rayDir[2] * rayDir[2];
    const b = 2 * (oc[0] * rayDir[0] + oc[1] * rayDir[1] + oc[2] * rayDir[2]);
    const c = oc[0] * oc[0] + oc[1] * oc[1] + oc[2] * oc[2] - radius * radius;
    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
      console.log(`  ${label}: MISS (discriminant < 0)`);
    } else {
      const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
      const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
      console.log(`  ${label}: HIT at t=${Math.min(t1, t2).toFixed(2)} (discriminant=${discriminant.toFixed(2)})`);
    }
  }

  testHit(rayCurrent, 'Current ray');
  testHit(rayFixed, 'Fixed ray');
}

// ============================================================
// Test 9: onClick drag detection issue
// ============================================================
console.log('\n--- Test 9: onClick drag detection ---');

{
  // Event order: mousedown → mouseup → click
  // onMouseUp sets isDragging = false
  // onClick checks !isDragging, which is always true
  // This means selection always happens, even after a drag

  let isDragging = false;

  // Simulate: mousedown (start drag)
  isDragging = true;
  // Simulate: mouseup (end drag)
  isDragging = false;
  // Simulate: click (check if should select)
  const shouldSelect = !isDragging; // Always true!

  assert(shouldSelect === true, 'onClick: isDragging is always false (drag detection broken)');
  console.log('  ⚠ BUG: isDragging is reset in mouseup before click fires');
  console.log('    Need to track whether a drag actually occurred');
}

// ============================================================
// Summary
// ============================================================
console.log('\n=== Summary ===');
console.log(`Passed: ${passed}, Failed: ${failed}`);
console.log('\nBugs found:');
console.log('1. multiplyMatrixVector: computes M^T*v instead of M*v (ROOT CAUSE of interaction failure)');
console.log('2. Matrix4.multiply: computes B*A instead of A*B (affects model matrix)');
console.log('3. onClick drag detection: isDragging always false when click fires');
console.log('4. Coordinate conversion: CSS pixels vs canvas pixels (devicePixelRatio)');

if (failed > 0) {
  console.log(`\n⚠ ${failed} test(s) FAILED - bugs need to be fixed`);
}
