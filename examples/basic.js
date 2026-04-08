const canvas = document.getElementById('canvas');
const renderer = new SimploraWebGL.WebGLRenderer(canvas);

renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new SimploraWebGL.Camera(
  Math.PI / 4,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.setPosition(0, 2, 5);

const scene = new SimploraWebGL.Scene();

const boxGeometry = new SimploraWebGL.BoxGeometry(1, 1, 1);
const boxMaterial = new SimploraWebGL.BasicMaterial({
  color: [1.0, 0.3, 0.3],
  opacity: 1.0
});
const box = new SimploraWebGL.Mesh(boxGeometry, boxMaterial);
box.setPosition(-1.5, 0, 0);
scene.add(box);

const sphereGeometry = new SimploraWebGL.SphereGeometry(0.7, 32, 16);
const sphereMaterial = new SimploraWebGL.BasicMaterial({
  color: [0.3, 0.3, 1.0],
  opacity: 1.0
});
const sphere = new SimploraWebGL.Mesh(sphereGeometry, sphereMaterial);
sphere.setPosition(1.5, 0, 0);
scene.add(sphere);

const wireframeBoxGeometry = new SimploraWebGL.BoxGeometry(0.8, 0.8, 0.8);
const wireframeBoxMaterial = new SimploraWebGL.BasicMaterial({
  color: [0.3, 1.0, 0.3],
  opacity: 1.0,
  wireframe: true
});
const wireframeBox = new SimploraWebGL.Mesh(wireframeBoxGeometry, wireframeBoxMaterial);
wireframeBox.setPosition(0, 1.5, 0);
scene.add(wireframeBox);

let rotation = 0;

function animate() {
  rotation += 0.01;
  
  box.setRotation(rotation, rotation * 0.7, 0);
  sphere.setRotation(rotation * 0.5, rotation, 0);
  wireframeBox.setRotation(rotation, 0, rotation * 0.5);
  
  renderer.render(scene, camera);
  
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

animate();