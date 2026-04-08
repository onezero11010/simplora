import { Material } from './Material';
import { type MaterialOptions } from '../types/index';

export class BasicMaterial extends Material {
  constructor(options: MaterialOptions = {}) {
    super(options);
  }
}