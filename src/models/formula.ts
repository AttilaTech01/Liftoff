//DEPRECATED - no longer used

import { MathOperationType } from '../services/DEP-math-service';

export interface Formula {
    operation: MathOperationType;
    values: string[];
}