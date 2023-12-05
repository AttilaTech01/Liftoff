export type MathOperationType = 'AVERAGE' | 'DIVIDE' | 'MAX' | 'MIN' | 'MINUS' | 'MULTIPLY' | 'POWER' | 'SUM';

interface IMathService {
    DIVIDE(numerator: number, denominator: number): number;
    MINUS(numbers: number[]): number;
    MULTIPLY(numbers: number[]): number;
    ROUND(value: number, numberOfDigits: number);
    SUM(numbers: number[]): number;
}

class MathService implements IMathService {
    // AVERAGE(w,x,y,z) => average value 
    AVERAGE(numbers: number[]): number {
        if (numbers.length === 0) {
            return 0;
        }

        const sum: number = this.SUM(numbers);
        const result: number =  this.DIVIDE(sum, numbers.length);
        return this.ROUND(result, 2);
    }

    // DIVIDE(w,x) => w/x
    DIVIDE(numerator: number, denominator: number): number {
        if (denominator === 0) {
            throw new Error("Division by zero error.");
        }

        return this.ROUND(numerator / denominator, 2);
    }

    // MAX(w,x,y,z) => highest value between them
    MAX(numbers: number[]): number {
        if (numbers.length === 0) {
            return 0;
        }
        
        return Math.max(...numbers);
    }

    // MIN(w,x,y,z) => lowest value between them
    MIN(numbers: number[]): number {
        if (numbers.length === 0) {
            return 0;
        }

        return Math.min(...numbers);
    }

    // MINUS(w,x,y,z) = > w - x - y - z
    MINUS(numbers: number[]): number {
        if (numbers.length === 0) {
            return 0;
        }

        let result: number = numbers[0];
        numbers.forEach((number, index) => {
            const numberToSubstract: number = numbers[index+1];
            if (numberToSubstract) {
                result = result - numberToSubstract; 
            }  
        });

        return this.ROUND(result, 2);
    }

    // MULTIPLY(w,x,y,z) => w * x * y * z
    MULTIPLY(numbers: number[]): number {
        if (numbers.length === 0) {
            return 0;
        }

        let result: number = 1;
        numbers.forEach(number => {
            result = result * number;
        });

        return this.ROUND(result, 2);
    }

    // POWER(w,x) => w exponent x
    POWER(base: number, exponent: number): number {
        return Math.pow(base, exponent);
    }

    // ONLY USED PRIVATELY FOR THE MOMENT
    // ROUND(1.2345, 2) => 1.23
    ROUND(value: number, numberOfDigits: number): number {
        return Number(Math.round(Number(value + 'e' + numberOfDigits)) + 'e' + numberOfDigits * -1); 
    }

    // SUM(w,x,y,z) => w + x + y + z
    SUM(numbers: number[]): number {
        let result: number = 0;
        numbers.forEach(number => {
            result = result + number;
        });

        return this.ROUND(result, 2);
    }
}

export default new MathService;