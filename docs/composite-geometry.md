# 组合几何体使用指南

Simplora WebGL 提供了强大的组合几何体系统，让您能够轻松创建复杂的 3D 形状。

## 核心理念

- **极度简单**: 一行代码即可创建复杂的组合几何体
- **极度高效**: 自动处理顶点变换和法线计算
- **灵活组合**: 支持自定义组合任意几何体

## 基础组合几何体

### GroupGeometry

基础的组合几何体类，允许您将多个几何体组合成一个。

```javascript
import { GroupGeometry, BoxGeometry, SphereGeometry } from 'simplora-webgl';

const group = new GroupGeometry();

group.add(new BoxGeometry(1, 1, 1), [0, 0, 0]);
group.add(new SphereGeometry(0.5, 16, 8), [0, 1, 0]);

const mesh = new Mesh(group, material);
scene.add(mesh);
```

### 参数说明

- `geometry`: 要添加的几何体
- `position`: 位置 [x, y, z]，默认 [0, 0, 0]
- `rotation`: 旋转 [x, y, z]，默认 [0, 0, 0]
- `scale`: 缩放 [x, y, z]，默认 [1, 1, 1]

## 建筑块几何体

### BuildingBlockGeometry

提供常用的建筑形状，适用于智慧城市、建筑可视化等场景。

#### 房子

```javascript
const house = BuildingBlockGeometry.createHouse(width, height, depth, roofHeight);
const house = BuildingBlockGeometry.createHouse(2, 2, 2, 1);
```

#### 多层建筑

```javascript
const building = BuildingBlockGeometry.createBuilding(width, height, depth, floors);
const building = BuildingBlockGeometry.createBuilding(3, 5, 3, 3);
```

#### 砖墙

```javascript
const wall = BuildingBlockGeometry.createWall(width, height, thickness);
const wall = BuildingBlockGeometry.createWall(5, 2, 0.2);
```

#### 罗马柱

```javascript
const column = BuildingBlockGeometry.createColumn(radius, height, baseHeight, capitalHeight);
const column = BuildingBlockGeometry.createColumn(0.3, 3, 0.3, 0.3);
```

#### 塔楼

```javascript
const tower = BuildingBlockGeometry.createTower(radius, height, segments);
const tower = BuildingBlockGeometry.createTower(2, 6, 8);
```

#### 桥梁

```javascript
const bridge = BuildingBlockGeometry.createBridge(width, height, depth);
const bridge = BuildingBlockGeometry.createBridge(8, 2, 3);
```

#### 大门

```javascript
const gate = BuildingBlockGeometry.createGate(width, height, depth);
const gate = BuildingBlockGeometry.createGate(3, 4, 0.5);
```

## 工业设备几何体

### EquipmentGeometry

提供常用的工业设备形状，适用于工业互联网可视化、设备监控等场景。

#### 服务器机柜

```javascript
const server = EquipmentGeometry.createServer(width, height, depth, units);
const server = EquipmentGeometry.createServer(1, 2, 0.6, 4);
```

#### 显示器

```javascript
const monitor = EquipmentGeometry.createMonitor(width, height, depth, standHeight);
const monitor = EquipmentGeometry.createMonitor(2, 1.2, 0.1, 0.5);
```

#### 键盘

```javascript
const keyboard = EquipmentGeometry.createKeyboard(width, height, depth);
const keyboard = EquipmentGeometry.createKeyboard(1.5, 0.05, 0.6);
```

#### 摄像头

```javascript
const camera = EquipmentGeometry.createCamera(radius, length);
const camera = EquipmentGeometry.createCamera(0.3, 0.8);
```

#### 传感器

```javascript
const sensor = EquipmentGeometry.createSensor(radius, height);
const sensor = EquipmentGeometry.createSensor(0.2, 0.5);
```

#### 管道

```javascript
const pipe = EquipmentGeometry.createPipe(radius, length, segments);
const pipe = EquipmentGeometry.createPipe(0.1, 5, 3);
```

#### 阀门

```javascript
const valve = EquipmentGeometry.createValve(radius, height);
const valve = EquipmentGeometry.createValve(0.3, 0.5);
```

#### 储罐

```javascript
const tank = EquipmentGeometry.createTank(radius, height);
const tank = EquipmentGeometry.createTank(1, 2);
```

#### 泵

```javascript
const pump = EquipmentGeometry.createPump(radius, height);
const pump = EquipmentGeometry.createPump(0.5, 0.8);
```

#### 风扇

```javascript
const fan = EquipmentGeometry.createFan(radius, height);
const fan = EquipmentGeometry.createFan(0.5, 0.3);
```

#### 机械臂

```javascript
const robotArm = EquipmentGeometry.createRobotArm(baseRadius, armLength, segmentCount);
const robotArm = EquipmentGeometry.createRobotArm(0.5, 2, 3);
```

## 复合物体几何体

### CompositeGeometry

提供常见的复合物体形状，适用于各种可视化场景。

#### 汽车

```javascript
const car = CompositeGeometry.createCar(width, length, height);
const car = CompositeGeometry.createCar(2, 4, 1.2);
```

#### 树木

```javascript
const tree = CompositeGeometry.createTree(trunkRadius, trunkHeight, foliageRadius);
const tree = CompositeGeometry.createTree(0.2, 2, 1);
```

#### 路灯

```javascript
const lamp = CompositeGeometry.createLamp(radius, height);
const lamp = CompositeGeometry.createLamp(0.3, 2);
```

#### 桌子

```javascript
const table = CompositeGeometry.createTable(width, height, depth);
const table = CompositeGeometry.createTable(2, 1, 1);
```

#### 椅子

```javascript
const chair = CompositeGeometry.createChair(width, height, depth);
const chair = CompositeGeometry.createChair(0.6, 1, 0.6);
```

#### 喷泉

```javascript
const fountain = CompositeGeometry.createFountain(radius, height);
const fountain = CompositeGeometry.createFountain(2, 1);
```

#### 雕像

```javascript
const statue = CompositeGeometry.createStatue(radius, height);
const statue = CompositeGeometry.createStatue(0.5, 3);
```

#### 风车

```javascript
const windmill = CompositeGeometry.createWindmill(radius, height);
const windmill = CompositeGeometry.createWindmill(1, 4);
```

#### 卫星

```javascript
const satellite = CompositeGeometry.createSatellite(radius);
const satellite = CompositeGeometry.createSatellite(0.5);
```

#### 火箭

```javascript
const rocket = CompositeGeometry.createRocket(radius, height);
const rocket = CompositeGeometry.createRocket(0.5, 3);
```

## 完整示例

### 创建智慧城市场景

```javascript
import { 
  Scene, 
  Mesh, 
  BasicMaterial,
  BuildingBlockGeometry,
  CompositeGeometry 
} from 'simplora-webgl';

const scene = new Scene();

const material = new BasicMaterial({ color: 0x4a90e2 });

const building1 = new Mesh(
  BuildingBlockGeometry.createBuilding(3, 5, 3, 3),
  material
);
building1.setPosition(-5, 0, 0);
scene.add(building1);

const building2 = new Mesh(
  BuildingBlockGeometry.createBuilding(2, 3, 2, 2),
  material
);
building2.setPosition(5, 0, 0);
scene.add(building2);

const tree = new Mesh(
  CompositeGeometry.createTree(0.2, 2, 1),
  new BasicMaterial({ color: 0x2ecc71 })
);
tree.setPosition(0, 0, 3);
scene.add(tree);
```

### 创建工业设备监控场景

```javascript
import { 
  Scene, 
  Mesh, 
  BasicMaterial,
  EquipmentGeometry 
} from 'simplora-webgl';

const scene = new Scene();

const server = new Mesh(
  EquipmentGeometry.createServer(1, 2, 0.6, 4),
  new BasicMaterial({ color: 0x3498db })
);
server.setPosition(-3, 0, 0);
scene.add(server);

const pump = new Mesh(
  EquipmentGeometry.createPump(0.5, 0.8),
  new BasicMaterial({ color: 0xe74c3c })
);
pump.setPosition(0, 0, 0);
scene.add(pump);

const tank = new Mesh(
  EquipmentGeometry.createTank(1, 2),
  new BasicMaterial({ color: 0xf39c12 })
);
tank.setPosition(3, 0, 0);
scene.add(tank);
```

## 性能优化建议

1. **合理使用分段数**: 对于远处的物体，可以减少分段数以提高性能
2. **复用几何体**: 多个相同物体可以共享同一个几何体实例
3. **按需组合**: 只在需要时创建组合几何体，避免不必要的计算
4. **使用实例化**: 对于大量相同的组合物体，考虑使用实例化渲染

## 扩展自定义组合几何体

您可以基于 `GroupGeometry` 创建自己的组合几何体：

```javascript
import { GroupGeometry, BoxGeometry, SphereGeometry } from 'simplora-webgl';

class CustomGeometry extends GroupGeometry {
  constructor() {
    super();
    
    this.add(new BoxGeometry(1, 1, 1), [0, 0, 0]);
    this.add(new SphereGeometry(0.5, 16, 8), [0, 1, 0]);
    this.add(new ConeGeometry(0.3, 0.5, 8), [0, -0.75, 0]);
  }
}

const customMesh = new Mesh(
  new CustomGeometry(),
  material
);
scene.add(customMesh);
```

## 总结

Simplora WebGL 的组合几何体系统提供了：

- **30+ 预设组合几何体**: 覆盖建筑、工业设备、常见物体等场景
- **灵活的自定义组合**: 基于基础几何体创建任意复杂形状
- **简洁的 API**: 一行代码即可创建复杂几何体
- **高性能**: 自动优化顶点和法线计算

这个系统特别适合工业互联网可视化、智慧城市、数据可视化等应用场景，让您能够快速构建复杂的 3D 场景。