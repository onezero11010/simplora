import { GroupGeometry } from './GroupGeometry';
import { BoxGeometry } from './base/BoxGeometry';
import { CylinderGeometry } from './base/CylinderGeometry';
import { ConeGeometry } from './base/ConeGeometry';
// import { PlaneGeometry } from './base/PlaneGeometry';

export class BuildingBlockGeometry extends GroupGeometry {
  public static createHouse(width: number = 2, height: number = 2, depth: number = 2, roofHeight: number = 1): BuildingBlockGeometry {
    const house = new BuildingBlockGeometry();
    
    house.add(new BoxGeometry(width, height, depth), [0, height / 2, 0]);
    house.add(new ConeGeometry(Math.max(width, depth) / 1.5, roofHeight, 4), [0, height + roofHeight / 2, 0], [0, Math.PI / 4, 0]);

    return house;
  }

  public static createBuilding(width: number = 3, height: number = 5, depth: number = 3, floors: number = 3): BuildingBlockGeometry {
    const building = new BuildingBlockGeometry();
    const floorHeight = height / floors;
    
    for (let i = 0; i < floors; i++) {
      building.add(new BoxGeometry(width, floorHeight, depth), [0, i * floorHeight + floorHeight / 2, 0]);
      
      if (i < floors - 1) {
        building.add(new BoxGeometry(width * 0.3, floorHeight * 0.1, depth * 0.1), [width / 2, i * floorHeight + floorHeight, 0]);
      }
    }
    
    return building;
  }

  public static createWall(width: number = 5, height: number = 2, thickness: number = 0.2): BuildingBlockGeometry {
    const wall = new BuildingBlockGeometry();
    
    wall.add(new BoxGeometry(width, height, thickness), [0, height / 2, 0]);
    
    const brickWidth = width / 10;
    const brickHeight = height / 5;
    
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 10; j++) {
        const offset = (i % 2 === 0) ? 0 : brickWidth / 2;
        if (j * brickWidth + offset + brickWidth <= width) {
          wall.add(new BoxGeometry(brickWidth * 0.95, brickHeight * 0.95, thickness * 1.1), 
            [-width / 2 + j * brickWidth + offset + brickWidth / 2, i * brickHeight + brickHeight / 2, 0]);
        }
      }
    }
    
    return wall;
  }

  public static createColumn(radius: number = 0.3, height: number = 3, baseHeight: number = 0.3, capitalHeight: number = 0.3): BuildingBlockGeometry {
    const column = new BuildingBlockGeometry();
    
    column.add(new CylinderGeometry(radius * 1.5, radius * 1.5, baseHeight, 16), [0, baseHeight / 2, 0]);
    column.add(new CylinderGeometry(radius, radius, height, 16), [0, baseHeight + height / 2, 0]);
    column.add(new CylinderGeometry(radius * 1.3, radius * 1.5, capitalHeight, 16), [0, baseHeight + height + capitalHeight / 2, 0]);
    
    return column;
  }

  public static createTower(radius: number = 2, height: number = 6, segments: number = 8): BuildingBlockGeometry {
    const tower = new BuildingBlockGeometry();
    
    tower.add(new CylinderGeometry(radius, radius * 0.8, height, segments), [0, height / 2, 0]);
    tower.add(new ConeGeometry(radius * 1.2, height * 0.3, segments), [0, height + height * 0.15, 0]);
    
    return tower;
  }

  public static createBridge(width: number = 8, height: number = 2, depth: number = 3): BuildingBlockGeometry {
    const bridge = new BuildingBlockGeometry();
    
    bridge.add(new BoxGeometry(width, height * 0.2, depth), [0, height / 2, 0]);
    
    const pillarWidth = 0.5;
    const pillarCount = 3;
    const spacing = width / (pillarCount + 1);
    
    for (let i = 1; i <= pillarCount; i++) {
      bridge.add(new BoxGeometry(pillarWidth, height, depth), [-width / 2 + i * spacing, height / 2, 0]);
    }
    
    return bridge;
  }

  public static createGate(width: number = 3, height: number = 4, depth: number = 0.5): BuildingBlockGeometry {
    const gate = new BuildingBlockGeometry();
    
    gate.add(new BoxGeometry(width, height, depth), [0, height / 2, 0]);
    
    const gateWidth = width * 0.6;
    const gateHeight = height * 0.7;
    const gateDepth = depth * 1.2;
    
    gate.add(new BoxGeometry(gateWidth, gateHeight, gateDepth), [0, gateHeight / 2, 0]);
    
    return gate;
  }
}