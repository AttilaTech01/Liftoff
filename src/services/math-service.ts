export type MathOperationType = 'DIVIDE' | 'MINUS' | 'MULTIPLY' | 'SUM';

interface IMathService {
    DIVIDE(numerator: number, denominator: number): number;
    MINUS(numbers: number[]): number;
    MULTIPLY(numbers: number[]): number;
    ROUND(value: number, numberOfDigits: number);
    SUM(numbers: number[]): number;
}

class MathService implements IMathService {
    DIVIDE(numerator: number, denominator: number): number {
        if (denominator === 0) {
            throw new Error("Division by zero error.");
        }

        return this.ROUND(numerator / denominator, 2);
    }

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

    // ONLY USED PRIVATELY FOR THE MOMENT
    ROUND(value: number, numberOfDigits: number): number {
        return Number(Math.round(Number(value + 'e' + numberOfDigits)) + 'e' + numberOfDigits * -1); 
    }

    SUM(numbers: number[]): number {
        let result: number = 0;
        numbers.forEach(number => {
            result = result + number;
        });

        return this.ROUND(result, 2);
    }
}

export default new MathService;