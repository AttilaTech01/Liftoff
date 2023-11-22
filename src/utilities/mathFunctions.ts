export enum Operations {
    DIVIDE = "DIVIDE",
    MINUS = "MINUS",
    MULTIPLY = "MULTIPLY",
    SUM = "SUM",
}

interface IMathFunctions {
    DIVIDE(numerator: number, denominator: number): number;
    MINUS(numbers: number[]): number;
    MULTIPLY(numbers: number[]): number;
    SUM(numbers: number[]): number;
}

class MathFunctions implements IMathFunctions {
    DIVIDE(numerator: number, denominator: number): number {
        if (denominator === 0) {
            console.log("Division by zero error.");
            return 0;
        }

        return numerator / denominator;
    }

    MINUS(numbers: number[]): number {
        if (numbers.length === 0) {
            return 0
        }

        let result: number = numbers[0];
        numbers.forEach((number, index) => {
            if (number[index+1]) {
                result = result - number[index+1]; 
            }  
        });

        return result;
    }

    MULTIPLY(numbers: number[]): number {
        if (numbers.length === 0) {
            return 0
        }

        let result: number = 1;
        numbers.forEach(number => {
            result = result * number;
        });

        return result;
    }

    SUM(numbers: number[]): number {
        let result: number = 0;
        numbers.forEach(number => {
            result = result + number;
        });

        return result;
    }
} 

export default new MathFunctions;