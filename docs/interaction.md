# Interaction Controller - 交互控制器

InteractionController 提供了基础的 3D 场景交互功能，包括鼠标点击选择、悬停高亮和拖拽移动。

## 功能特性

### 1. 鼠标点击选择物体
- 点击物体可以选中它
- 选中的物体会显示为红色（可自定义）
- 支持选择回调函数

### 2. 悬停高亮效果
- 鼠标悬停在物体上时会高亮显示
- 高亮颜色为黄色（可自定义）
- 支持悬停回调函数

### 3. 简单的拖拽移动
- 选中物体后可以拖拽移动
- 拖拽方向与相机视角对齐
- 支持启用/禁用拖拽功能

## 基本用法

```javascript
import { InteractionController } from 'simplora-webgl';

// 创建交互控制器
const interactionController = new InteractionController(
    camera,      // 相机对象
    canvas,      // 画布元素
    scene,       // 场景对象
    renderer.getGL(),  // WebGL 上下文
    {
        enableSelection: true,      // 启用选择功能
        enableHover: true,          // 启用悬停高亮
        enableDrag: true,            // 启用拖拽移动
        hoverColor: [1.0, 1.0, 0.0], // 悬停颜色（黄色）
        selectionColor: [1.0, 0.0, 0.0] // 选择颜色（红色）
    }
);
```

## 完整示例

```javascript
// 创建渲染器和场景
const canvas = document.getElementById('canvas');
const renderer = new WebGLRenderer(canvas);
const scene = new Scene();
const camera = new Camera(Math.PI / 4, canvas.width / canvas.height, 0.1, 100);

// 创建交互控制器
const interactionController = new InteractionController(
    camera,
    canvas,
    scene,
    renderer.getGL(),
    {
        enableSelection: true,
        enableHover: true,
        enableDrag: true,
        hoverColor: [1.0, 1.0, 0.0],
        selectionColor: [1.0, 0.0, 0.0]
    }
);

// 设置选择回调
interactionController.setSelectionCallback((mesh) => {
    if (mesh) {
        console.log('选中了物体:', mesh);
        // 可以在这里执行选中后的操作
    } else {
        console.log('取消选择');
    }
});

// 设置悬停回调
interactionController.setHoverCallback((mesh) => {
    if (mesh) {
        console.log('悬停在物体上:', mesh);
        // 可以在这里显示提示信息
    }
});

// 创建一些物体
const boxGeometry = new BoxGeometry(1, 1, 1);
const boxMaterial = new BasicMaterial({ color: [0.5, 0.5, 0.5] });
const box = new Mesh(boxGeometry, boxMaterial);
scene.add(box);

// 渲染循环
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// 窗口大小改变时更新
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    interactionController.resize();
});

animate();
```

## API 参考

### 构造函数

```typescript
new InteractionController(
    camera: Camera,
    canvas: HTMLCanvasElement,
    scene: Scene,
    gl: WebGLRenderingContext,
    options?: InteractionControllerOptions
)
```

### 选项参数

```typescript
interface InteractionControllerOptions {
    enableSelection?: boolean;      // 是否启用选择功能（默认：true）
    enableHover?: boolean;          // 是否启用悬停高亮（默认：true）
    enableDrag?: boolean;            // 是否启用拖拽移动（默认：true）
    hoverColor?: [number, number, number];     // 悬停颜色（默认：[1.0, 1.0, 0.0]）
    selectionColor?: [number, number, number]; // 选择颜色（默认：[1.0, 0.0, 0.0]）
}
```

### 方法

#### 设置选择回调
```typescript
setSelectionCallback(callback: (mesh: Mesh | null) => void): void
```

当选择状态改变时调用，参数为选中的 Mesh 对象（null 表示取消选择）。

#### 设置悬停回调
```typescript
setHoverCallback(callback: (mesh: Mesh | null) => void): void
```

当悬停状态改变时调用，参数为悬停的 Mesh 对象（null 表示没有悬停）。

#### 获取选中的物体
```typescript
getSelectedMesh(): Mesh | null
```

返回当前选中的 Mesh 对象，如果没有选中则返回 null。

#### 获取悬停的物体
```typescript
getHoveredMesh(): Mesh | null
```

返回当前悬停的 Mesh 对象，如果没有悬停则返回 null。

#### 设置悬停颜色
```typescript
setHoverColor(r: number, g: number, b: number): void
```

设置悬停高亮的颜色，参数范围为 0.0-1.0。

#### 设置选择颜色
```typescript
setSelectionColor(r: number, g: number, b: number): void
```

设置选中物体的颜色，参数范围为 0.0-1.0。

#### 启用/禁用选择功能
```typescript
setEnableSelection(enabled: boolean): void
```

#### 启用/禁用悬停功能
```typescript
setEnableHover(enabled: boolean): void
```

#### 启用/禁用拖拽功能
```typescript
setEnableDrag(enabled: boolean): void
```

#### 调整大小
```typescript
resize(): void
```

当画布大小改变时调用此方法来更新内部缓冲区。

#### 销毁
```typescript
dispose(): void
```

清理事件监听器和 WebGL 资源。

## 使用技巧

### 1. 与 OrbitController 配合使用

InteractionController 可以与 OrbitController 一起使用，提供完整的交互体验：

```javascript
const orbitController = new OrbitController(camera, canvas);
const interactionController = new InteractionController(camera, canvas, scene, gl);

// 右键拖拽平移相机
// 左键拖拽移动物体
// 滚轮缩放
// 左键点击选择物体
```

### 2. 自定义交互行为

你可以通过回调函数自定义交互行为：

```javascript
interactionController.setSelectionCallback((mesh) => {
    if (mesh) {
        // 显示物体信息
        showObjectInfo(mesh);
        // 播放选中音效
        playSelectSound();
        // 更新 UI
        updateUI(mesh);
    }
});
```

### 3. 动态控制交互功能

可以根据场景状态动态启用/禁用交互功能：

```javascript
// 编辑模式下启用所有交互
function enableEditMode() {
    interactionController.setEnableSelection(true);
    interactionController.setEnableHover(true);
    interactionController.setEnableDrag(true);
}

// 查看模式下禁用编辑交互
function enableViewMode() {
    interactionController.setEnableSelection(false);
    interactionController.setEnableHover(true);
    interactionController.setEnableDrag(false);
}
```

## 性能优化

InteractionController 使用颜色拾取技术来实现精确的物体选择。为了获得最佳性能：

1. 在窗口大小改变时调用 `resize()` 方法
2. 不再需要交互时调用 `dispose()` 方法清理资源
3. 对于大量物体，考虑使用空间分区或实例化渲染

## 注意事项

1. **颜色冲突**：确保物体的原始颜色与高亮/选择颜色不同
2. **透明物体**：透明物体的选择可能不准确
3. **性能**：每次鼠标移动都会进行颜色拾取，对于复杂场景可能影响性能
4. **资源清理**：页面卸载时记得调用 `dispose()` 方法

## 示例

查看 `examples/interaction-demo.html` 了解完整的交互功能演示。