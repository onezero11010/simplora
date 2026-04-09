# 相机控制功能使用指南

## 概述

Simplora WebGL 提供了强大的相机控制功能，通过 `OrbitController` 类实现围绕场景旋转、缩放、平移以及视角预设切换。

## 基本使用

### 1. 创建轨道控制器

```javascript
import { Camera, OrbitController } from 'simplora-webgl';

const camera = new Camera(fov, aspect, near, far);
const canvas = document.getElementById('canvas');

const orbitController = new OrbitController(camera, canvas, {
  enableRotate: true,      // 启用旋转
  enableZoom: true,        // 启用缩放
  enablePan: true,         // 启用平移
  rotateSpeed: 1.0,        // 旋转速度
  zoomSpeed: 1.0,          // 缩放速度
  panSpeed: 1.0,           // 平移速度
  minDistance: 0.1,        // 最小距离
  maxDistance: 1000,       // 最大距离
  minPolarAngle: 0.1,      // 最小极角
  maxPolarAngle: Math.PI - 0.1  // 最大极角
});
```

### 2. 鼠标控制

- **左键拖拽**: 围绕目标点旋转相机
- **右键拖拽** 或 **Shift + 左键拖拽**: 平移相机
- **鼠标滚轮**: 缩放视图

## 视角预设

### 1. 默认预设

系统提供以下默认视角预设：

- `default`: 默认视角 (0, 0, 5)
- `front`: 前视图 (0, 0, 10)
- `back`: 后视图 (0, 0, -10)
- `top`: 顶视图 (0, 10, 0)
- `bottom`: 底视图 (0, -10, 0)
- `left`: 左视图 (-10, 0, 0)
- `right`: 右视图 (10, 0, 0)
- `isometric`: 等轴视图 (7.07, 7.07, 7.07)

### 2. 切换视角

```javascript
// 通过名称切换
orbitController.switchToPresetByName('front');

// 通过索引切换
orbitController.switchToPreset(1);

// 下一个预设
orbitController.nextPreset();

// 上一个预设
orbitController.previousPreset();

// 获取当前预设
const current = orbitController.getCurrentPreset();
console.log(current.name);  // 当前预设名称
```

### 3. 自定义预设

```javascript
// 添加自定义预设
orbitController.addViewPreset({
  name: 'custom-view',
  position: [5, 3, 8],
  target: [0, 0, 0]
});

// 获取所有预设
const presets = orbitController.getViewPresets();
```

## 动态控制

### 启用/禁用功能

```javascript
// 启用/禁用旋转
orbitController.setEnableRotate(true);
orbitController.setEnableRotate(false);

// 启用/禁用缩放
orbitController.setEnableZoom(true);
orbitController.setEnableZoom(false);

// 启用/禁用平移
orbitController.setEnablePan(true);
orbitController.setEnablePan(false);
```

### 调整速度

```javascript
// 设置旋转速度
orbitController.setRotateSpeed(2.0);

// 设置缩放速度
orbitController.setZoomSpeed(1.5);

// 设置平移速度
orbitController.setPanSpeed(0.8);
```

### 设置限制

```javascript
// 设置距离限制
orbitController.setDistanceLimits(1, 50);

// 设置极角限制
orbitController.setPolarAngleLimits(0.1, Math.PI - 0.1);
```

## 完整示例

```javascript
import { WebGLRenderer, Camera, Scene, Mesh, BoxGeometry, BasicMaterial, OrbitController } from 'simplora-webgl';

// 创建渲染器
const canvas = document.getElementById('canvas');
const renderer = new WebGLRenderer(canvas);
renderer.setSize(window.innerWidth, window.innerHeight);

// 创建相机
const camera = new Camera(
  Math.PI / 4,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

// 创建场景
const scene = new Scene();

// 添加物体
const boxGeometry = new BoxGeometry(1, 1, 1);
const boxMaterial = new BasicMaterial({ color: [1, 0, 0], opacity: 1 });
const box = new Mesh(boxGeometry, boxMaterial);
scene.add(box);

// 创建轨道控制器
const orbitController = new OrbitController(camera, canvas, {
  enableRotate: true,
  enableZoom: true,
  enablePan: true,
  rotateSpeed: 1.0,
  zoomSpeed: 1.0,
  panSpeed: 1.0,
  minDistance: 2,
  maxDistance: 20
});

// 动画循环
function animate() {
  box.setRotation(0.01, 0.01, 0);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// 响应窗口大小变化
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
```

## API 参考

### 构造函数

```typescript
new OrbitController(camera: Camera, canvas: HTMLCanvasElement, options?: OrbitControllerOptions)
```

### 方法

| 方法 | 描述 |
|------|------|
| `setEnableRotate(enabled: boolean)` | 启用/禁用旋转 |
| `setEnableZoom(enabled: boolean)` | 启用/禁用缩放 |
| `setEnablePan(enabled: boolean)` | 启用/禁用平移 |
| `setRotateSpeed(speed: number)` | 设置旋转速度 |
| `setZoomSpeed(speed: number)` | 设置缩放速度 |
| `setPanSpeed(speed: number)` | 设置平移速度 |
| `setDistanceLimits(min: number, max: number)` | 设置距离限制 |
| `setPolarAngleLimits(min: number, max: number)` | 设置极角限制 |
| `addViewPreset(preset: ViewPreset)` | 添加视角预设 |
| `getViewPresets()` | 获取所有预设 |
| `switchToPreset(index: number)` | 切换到指定预设 |
| `switchToPresetByName(name: string)` | 通过名称切换预设 |
| `getCurrentPreset()` | 获取当前预设 |
| `nextPreset()` | 切换到下一个预设 |
| `previousPreset()` | 切换到上一个预设 |
| `dispose()` | 销毁控制器 |

### 类型定义

```typescript
interface OrbitControllerOptions {
  enableRotate?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
  rotateSpeed?: number;
  zoomSpeed?: number;
  panSpeed?: number;
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
}

interface ViewPreset {
  name: string;
  position: [number, number, number];
  target: [number, number, number];
}
```

## 注意事项

1. **性能**: 轨道控制器会在每一帧更新相机位置，确保在动画循环中调用
2. **事件监听**: 控制器会自动添加鼠标事件监听器，不需要手动处理
3. **内存管理**: 使用完毕后调用 `dispose()` 方法清理事件监听器
4. **限制**: 确保 `minDistance` 小于 `maxDistance`，`minPolarAngle` 小于 `maxPolarAngle`

## 演示

查看 [camera-control-demo.html](../examples/camera-control-demo.html) 获取完整的交互式演示。
