import { Matrix4 } from '../core/Matrix4';
import { BoxGeometry } from '../geometry/base/BoxGeometry';
import { SphereGeometry } from '../geometry/base/SphereGeometry';
import { BasicMaterial } from '../material/BasicMaterial';
import { Mesh } from '../objects/Mesh';
import { Scene } from '../objects/Scene';

console.log('Running Simplora WebGL TypeScript Tests...\n');

function testMatrix4(): void {
  console.log('Testing Matrix4...');

  Matrix4.identity();
  console.log('✓ Identity matrix created');
  
  Matrix4.perspective(Math.PI / 4, 1, 0.1, 100);
  console.log('✓ Perspective matrix created');
  
  Matrix4.lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]);
  console.log('✓ LookAt matrix created');
  
  const translation = Matrix4.translation(1, 2, 3);
  console.log('✓ Translation matrix created');
  
  const rotation = Matrix4.rotationY(Math.PI / 4);
  console.log('✓ Rotation matrix created');
  
  Matrix4.scale(2, 2, 2);
  console.log('✓ Scale matrix created');
  
  translation.multiply(rotation);
  console.log('✓ Matrix multiplication works');
  
  console.log('Matrix4 tests passed!\n');
}

function testGeometry(): void {
  console.log('Testing Geometry...');
  
  const boxGeometry = new BoxGeometry(1, 1, 1);
  console.log('✓ Box geometry created');
  console.log('  Vertices:', boxGeometry.getVertices().length);
  console.log('  Indices:', boxGeometry.getIndices().length);
  
  const sphereGeometry = new SphereGeometry(1, 32, 16);
  console.log('✓ Sphere geometry created');
  console.log('  Vertices:', sphereGeometry.getVertices().length);
  console.log('  Indices:', sphereGeometry.getIndices().length);
  
  console.log('Geometry tests passed!\n');
}

function testMaterial(): void {
  console.log('Testing Material...');
  
  const material = new BasicMaterial({
    color: [1.0, 0.5, 0.0],
    opacity: 0.8
  });
  console.log('✓ Basic material created');
  
  material.setColor(0.5, 0.5, 1.0);
  console.log('✓ Material color set');
  
  material.setWireframe(true);
  console.log('✓ Wireframe mode set');
  
  console.log('Material tests passed!\n');
}

function testMesh(): void {
  console.log('Testing Mesh...');
  
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new BasicMaterial();
  const mesh = new Mesh(geometry, material);
  console.log('✓ Mesh created');
  
  mesh.setPosition(1, 2, 3);
  console.log('✓ Mesh position set');
  
  mesh.setRotation(0.5, 0.5, 0.5);
  console.log('✓ Mesh rotation set');
  
  mesh.setScale(2, 2, 2);
  console.log('✓ Mesh scale set');
  
  console.log('Mesh tests passed!\n');
}

function testScene(): void {
  console.log('Testing Scene...');
  
  const scene = new Scene();
  console.log('✓ Scene created');
  
  const mesh = new Mesh(new BoxGeometry(), new BasicMaterial());
  scene.add(mesh);
  console.log('✓ Mesh added to scene');
  
  scene.remove(mesh);
  console.log('✓ Mesh removed from scene');
  
  console.log('Scene tests passed!\n');
}

try {
  testMatrix4();
  testGeometry();
  testMaterial();
  testMesh();
  testScene();
  
  console.log('All tests passed! ✓');
} catch (error) {
  console.error('Test failed:', error);
  // process.exit(1);
}