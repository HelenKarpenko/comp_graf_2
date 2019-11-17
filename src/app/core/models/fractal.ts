import { FractalTypes } from './fractal-types.enum';

export class Fractal {
    id: string;
    type: FractalTypes;
    width: number;
    height: number;
    centerX: number | null;
    centerY: number | null;  
    maxZ: number | null;
    color: string | null;
    power: number | null;
    iteration: number | null;  
}