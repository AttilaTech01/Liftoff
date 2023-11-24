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
            throw Error("Division by zero error.");
        }

        return numerator / denominator;
    }

    MINUS(numbers: number[]): number {
        if (numbers.length === 0) {
            throw Error("No data has been found.");
        }

        let result: number = numbers[0];
        numbers.forEach((number, index) => {
            const numberToSubstract: number = numbers[index+1];
            if (numberToSubstract) {
                result = result - numberToSubstract; 
            }  
        });

        return result;
    }

    MULTIPLY(numbers: number[]): number {
        if (numbers.length === 0) {
            throw Error("No data has been found.");
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