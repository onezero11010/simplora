import { GroupGeometry } from './GroupGeometry';
import { BoxGeometry } from './base/BoxGeometry';
import { CylinderGeometry } from './base/CylinderGeometry';
import { SphereGeometry } from './base/SphereGeometry';
// import { ConeGeometry } from './base/ConeGeometry';
// import { CapsuleGeometry } from './base/CapsuleGeometry';

export class EquipmentGeometry extends GroupGeometry {
  public static createServer(width: number = 1, height: number = 2, depth: number = 0.6, units: number = 4): EquipmentGeometry {
    const server = new EquipmentGeometry();
    
    server.add(new BoxGeometry(width, height, depth), [0, height / 2, 0]);
    
    const unitHeight = height / units;
    for (let i = 0; i < units; i++) {
      server.add(new BoxGeometry(width * 0.9, unitHeight * 0.8, depth * 0.9), 
        [0, i * unitHeight + unitHeight / 2, depth * 0.05]);
    }
    
    return server;
  }

  public static createMonitor(width: number = 2, height: number = 1.2, depth: number = 0.1, standHeight: number = 0.5): EquipmentGeometry {
    const monitor = new EquipmentGeometry();
    
    monitor.add(new BoxGeometry(width, height, depth), [0, standHeight + height / 2, 0]);
    monitor.add(new BoxGeometry(width * 0.1, standHeight, depth * 0.1), [0, standHeight / 2, 0]);
    monitor.add(new BoxGeometry(width * 0.5, depth * 0.1, depth * 0.5), [0, depth * 0.05, 0]);
    
    return monitor;
  }

  public static createKeyboard(width: number = 1.5, height: number = 0.05, depth: number = 0.6): EquipmentGeometry {
    const keyboard = new EquipmentGeometry();
    
    keyboard.add(new BoxGeometry(width, height, depth), [0, 0, 0]);
    
    const keyWidth = width / 15;
    const keyDepth = depth / 5;
    
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 15; j++) {
        keyboard.add(new BoxGeometry(keyWidth * 0.9, height * 1.5, keyDepth * 0.9), 
          [-width / 2 + j * keyWidth + keyWidth / 2, height * 0.75, -depth / 2 + i * keyDepth + keyDepth / 2]);
      }
    }
    
    return keyboard;
  }

  public static createCamera(radius: number = 0.3, length: number = 0.8): EquipmentGeometry {
    const camera = new EquipmentGeometry();
    
    camera.add(new CylinderGeometry(radius, radius, length, 16), [0, 0, 0], [Math.PI / 2, 0, 0]);
    camera.add(new CylinderGeometry(radius * 0.8, radius * 0.8, length * 0.3, 16), [0, 0, length / 2], [Math.PI / 2, 0, 0]);
    camera.add(new SphereGeometry(radius * 0.6, 16, 8), [0, 0, length * 0.65]);
    
    return camera;
  }

  public static createSensor(radius: number = 0.2, height: number = 0.5): EquipmentGeometry {
    const sensor = new EquipmentGeometry();
    
    sensor.add(new CylinderGeometry(radius, radius * 0.8, height, 8), [0, height / 2, 0]);
    sensor.add(new SphereGeometry(radius * 0.5, 8, 4), [0, height, 0]);
    
    return sensor;
  }

  public static createPipe(radius: number = 0.1, length: number = 5, segments: number = 3): EquipmentGeometry {
    const pipe = new EquipmentGeometry();
    
    const segmentLength = length / segments;
    for (let i = 0; i < segments; i++) {
      pipe.add(new CylinderGeometry(radius, radius, segmentLength, 8), 
        [0, 0, i * segmentLength + segmentLength / 2]);
    }
    
    return pipe;
  }

  public static createValve(radius: number = 0.3, height: number = 0.5): EquipmentGeometry {
    const valve = new EquipmentGeometry();
    
    valve.add(new CylinderGeometry(radius, radius, height, 16), [0, height / 2, 0]);
    valve.add(new BoxGeometry(radius * 2, height * 0.1, radius * 0.3), [0, height, 0]);
    valve.add(new BoxGeometry(radius * 0.3, height * 0.1, radius * 2), [0, height, 0]);
    
    return valve;
  }

  public static createTank(radius: number = 1, height: number = 2): EquipmentGeometry {
    const tank = new EquipmentGeometry();
    
    tank.add(new CylinderGeometry(radius, radius, height, 32), [0, height / 2, 0]);
    tank.add(new SphereGeometry(radius, 32, 16), [0, 0, 0]);
    tank.add(new SphereGeometry(radius, 32, 16), [0, height, 0]);
    
    return tank;
  }

  public static createPump(radius: number = 0.5, height: number = 0.8): EquipmentGeometry {
    const pump = new EquipmentGeometry();
    
    pump.add(new CylinderGeometry(radius, radius * 0.8, height, 16), [0, height / 2, 0]);
    pump.add(new BoxGeometry(radius * 2, height * 0.3, radius * 2), [0, height * 0.15, 0]);
    pump.add(new CylinderGeometry(radius * 0.3, radius * 0.3, height * 0.5, 8), [0, height + height * 0.25, 0]);
    
    return pump;
  }

  public static createFan(radius: number = 0.5, height: number = 0.3): EquipmentGeometry {
    const fan = new EquipmentGeometry();
    
    fan.add(new CylinderGeometry(radius, radius, height * 0.2, 16), [0, 0, 0]);
    
    for (let i = 0; i < 3; i++) {
      fan.add(new BoxGeometry(radius * 1.8, height * 0.1, radius * 0.3), 
        [0, height * 0.1, 0], [0, (i * Math.PI * 2) / 3, 0]);
    }
    
    fan.add(new CylinderGeometry(radius * 0.2, radius * 0.2, height, 8), [0, height / 2, 0]);
    
    return fan;
  }

  public static createRobotArm(baseRadius: number = 0.5, armLength: number = 2, segmentCount: number = 3): EquipmentGeometry {
    const robotArm = new EquipmentGeometry();
    
    robotArm.add(new CylinderGeometry(baseRadius, baseRadius, baseRadius, 16), [0, baseRadius / 2, 0]);
    
    let currentY = baseRadius;
    let currentRadius = baseRadius * 0.8;
    
    for (let i = 0; i < segmentCount; i++) {
      const segmentHeight = armLength / segmentCount;
      const segmentRadius = currentRadius * (1 - i * 0.2);
      
      robotArm.add(new CylinderGeometry(segmentRadius, segmentRadius * 0.8, segmentHeight, 16), 
        [0, currentY + segmentHeight / 2, 0]);
      
      if (i < segmentCount - 1) {
        robotArm.add(new SphereGeometry(segmentRadius * 0.9, 16, 8), 
          [0, currentY + segmentHeight, 0]);
      }
      
      currentY += segmentHeight;
      currentRadius = segmentRadius * 0.8;
    }
    
    robotArm.add(new SphereGeometry(currentRadius * 0.5, 8, 4), [0, currentY, 0]);
    
    return robotArm;
  }
}