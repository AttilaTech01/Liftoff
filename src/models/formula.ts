import { MathOperationType } from '../services/math-service';

export interface Formula {
    operation: MathOperationType;
    values: string[];
}