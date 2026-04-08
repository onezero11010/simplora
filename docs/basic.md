
## Usage

Include the built library in your HTML:

```html
<script src="dist/simplora-webgl.js"></script>
```

Basic example:

```javascript
const canvas = document.getElementById('canvas');
const renderer = new SimploraWebGL.WebGLRenderer(canvas);

renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new SimploraWebGL.Camera(
  Math.PI / 4,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

const scene = new SimploraWebGL.Scene();

const geometry = new SimploraWebGL.BoxGeometry(1, 1, 1);
const material = new SimploraWebGL.BasicMaterial({
  color: [1.0, 0.3, 0.3]
});
const mesh = new SimploraWebGL.Mesh(geometry, material);
scene.add(mesh);

function animate() {
  mesh.setRotation(Date.now() * 0.001, 0, 0);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
```
