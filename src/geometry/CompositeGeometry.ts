import { GroupGeometry } from './GroupGeometry';
import { BoxGeometry } from './base/BoxGeometry';
import { CylinderGeometry } from './base/CylinderGeometry';
import { SphereGeometry } from './base/SphereGeometry';
import { ConeGeometry } from './base/ConeGeometry';
// import { TorusGeometry } from './base/TorusGeometry';
import { CapsuleGeometry } from './base/CapsuleGeometry';

export class CompositeGeometry extends GroupGeometry {
  public static createCar(width: number = 2, length: number = 4, height: number = 1.2): CompositeGeometry {
    const car = new CompositeGeometry();
    
    car.add(new BoxGeometry(width, height * 0.5, length), [0, height * 0.25, 0]);
    car.add(new BoxGeometry(width * 0.8, height * 0.4, length * 0.5), [0, height * 0.7, -length * 0.1]);
    
    const wheelRadius = height * 0.3;
    const wheelPositions = [
      [-width / 2 - wheelRadius * 0.5, wheelRadius, length * 0.3],
      [width / 2 + wheelRadius * 0.5, wheelRadius, length * 0.3],
      [-width / 2 - wheelRadius * 0.5, wheelRadius, -length * 0.3],
      [width / 2 + wheelRadius * 0.5, wheelRadius, -length * 0.3]
    ];
    
    for (const pos of wheelPositions) {
      car.add(new CylinderGeometry(wheelRadius, wheelRadius, width * 0.2, 16), pos as [number, number, number], [0, 0, Math.PI / 2]);
    }
    
    return car;
  }

  public static createTree(trunkRadius: number = 0.2, trunkHeight: number = 2, foliageRadius: number = 1): CompositeGeometry {
    const tree = new CompositeGeometry();
    
    tree.add(new CylinderGeometry(trunkRadius, trunkRadius * 0.8, trunkHeight, 8), [0, trunkHeight / 2, 0]);
    tree.add(new ConeGeometry(foliageRadius, foliageRadius * 1.5, 8), [0, trunkHeight + foliageRadius * 0.75, 0]);
    tree.add(new ConeGeometry(foliageRadius * 0.8, foliageRadius * 1.2, 8), [0, trunkHeight + foliageRadius * 1.5, 0]);

    return tree;
  }

  public static createLamp(radius: number = 0.3, height: number = 2): CompositeGeometry {
    const lamp = new CompositeGeometry();
    
    lamp.add(new CylinderGeometry(radius * 0.1, radius * 0.1, height, 8), [0, height / 2, 0]);
    lamp.add(new SphereGeometry(radius * 0.3, 16, 8), [0, height, 0]);
    lamp.add(new ConeGeometry(radius * 0.8, radius * 0.6, 16), [0, height + radius * 0.3, 0], [Math.PI, 0, 0]);
    
    return lamp;
  }

  public static createTable(width: number = 2, height: number = 1, depth: number = 1): CompositeGeometry {
    const table = new CompositeGeometry();
    
    table.add(new BoxGeometry(width, height * 0.1, depth), [0, height - height * 0.05, 0]);
    
    const legSize = height * 0.1;
    const legPositions = [
      [-width / 2 + legSize, height / 2, -depth / 2 + legSize],
      [width / 2 - legSize, height / 2, -depth / 2 + legSize],
      [-width / 2 + legSize, height / 2, depth / 2 - legSize],
      [width / 2 - legSize, height / 2, depth / 2 - legSize]
    ];
    
    for (const pos of legPositions) {
      table.add(new BoxGeometry(legSize, height * 0.9, legSize), pos as [number, number, number]);
    }
    
    return table;
  }

  public static createChair(width: number = 0.6, height: number = 1, depth: number = 0.6): CompositeGeometry {
    const chair = new CompositeGeometry();
    
    const seatHeight = height * 0.5;
    const legSize = height * 0.05;
    
    chair.add(new BoxGeometry(width, height * 0.05, depth), [0, seatHeight, 0]);
    chair.add(new BoxGeometry(width, height * 0.5, height * 0.05), [0, seatHeight + height * 0.25, -depth / 2 + height * 0.025]);
    
    const legPositions = [
      [-width / 2 + legSize, seatHeight / 2, -depth / 2 + legSize],
      [width / 2 - legSize, seatHeight / 2, -depth / 2 + legSize],
      [-width / 2 + legSize, seatHeight / 2, depth / 2 - legSize],
      [width / 2 - legSize, seatHeight / 2, depth / 2 - legSize]
    ];
    
    for (const pos of legPositions) {
      chair.add(new BoxGeometry(legSize, seatHeight, legSize), pos as [number, number, number]);
    }
    
    return chair;
  }

  public static createFountain(radius: number = 2, height: number = 1): CompositeGeometry {
    const fountain = new CompositeGeometry();
    
    fountain.add(new CylinderGeometry(radius, radius * 0.8, height * 0.3, 32), [0, height * 0.15, 0]);
    fountain.add(new CylinderGeometry(radius * 0.3, radius * 0.3, height * 0.8, 16), [0, height * 0.4, 0]);
    fountain.add(new SphereGeometry(radius * 0.2, 16, 8), [0, height * 0.8, 0]);
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * radius * 0.6;
      const z = Math.sin(angle) * radius * 0.6;
      fountain.add(new CylinderGeometry(radius * 0.1, radius * 0.1, height * 0.4, 8), [x, height * 0.2, z]);
    }
    
    return fountain;
  }

  public static createStatue(radius: number = 0.5, height: number = 3): CompositeGeometry {
    const statue = new CompositeGeometry();
    
    statue.add(new CylinderGeometry(radius, radius * 0.8, height * 0.3, 16), [0, height * 0.15, 0]);
    statue.add(new CapsuleGeometry(radius * 0.3, height * 0.6, 16, 8, 4), [0, height * 0.6, 0]);
    statue.add(new SphereGeometry(radius * 0.25, 16, 8), [0, height * 0.9, 0]);
    
    return statue;
  }

  public static createWindmill(radius: number = 1, height: number = 4): CompositeGeometry {
    const windmill = new CompositeGeometry();
    
    windmill.add(new CylinderGeometry(radius * 0.3, radius * 0.4, height, 8), [0, height / 2, 0]);
    windmill.add(new BoxGeometry(radius * 0.8, height * 0.1, radius * 0.8), [0, height * 0.95, 0]);
    
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      windmill.add(new BoxGeometry(radius * 2, height * 0.05, radius * 0.3), 
        [Math.cos(angle) * radius, height, Math.sin(angle) * radius], [0, angle, 0]);
    }
    
    return windmill;
  }

  public static createSatellite(radius: number = 0.5): CompositeGeometry {
    const satellite = new CompositeGeometry();
    
    satellite.add(new SphereGeometry(radius, 16, 8), [0, 0, 0]);
    satellite.add(new CylinderGeometry(radius * 0.2, radius * 0.2, radius * 3, 8), [0, 0, 0], [Math.PI / 2, 0, 0]);
    
    const panelWidth = radius * 2;
    const panelHeight = radius * 1.5;
    const panelDepth = radius * 0.1;
    
    satellite.add(new BoxGeometry(panelWidth, panelHeight, panelDepth), [-radius * 2, 0, 0]);
    satellite.add(new BoxGeometry(panelWidth, panelHeight, panelDepth), [radius * 2, 0, 0]);
    
    return satellite;
  }

  public static createRocket(radius: number = 0.5, height: number = 3): CompositeGeometry {
    const rocket = new CompositeGeometry();
    
    rocket.add(new CylinderGeometry(radius, radius * 0.8, height * 0.7, 16), [0, height * 0.35, 0]);
    rocket.add(new ConeGeometry(radius, height * 0.3, 16), [0, height * 0.85, 0]);
    
    const finHeight = height * 0.3;
    const finWidth = radius * 0.8;
    const finDepth = radius * 0.1;
    
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      rocket.add(new BoxGeometry(finWidth, finHeight, finDepth), 
        [Math.cos(angle) * radius, finHeight / 2, Math.sin(angle) * radius], [0, angle, 0]);
    }
    
    return rocket;
  }
}