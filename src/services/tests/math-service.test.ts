import mathService, { MathOperationType } from '../math-service';

// DIVIDE
test('DIVIDE - Regular', () => {
    expect(mathService.DIVIDE(12,3)).toBe(4);
    expect(mathService.DIVIDE(24.5,3)).toBe(8.17);
    expect(mathService.DIVIDE(24.5,3.5)).toBe(7);
});

test('DIVIDE - Negative numbers', () => {
    expect(mathService.DIVIDE(-12,3)).toBe(-4);
    expect(mathService.DIVIDE(-12,-3)).toBe(4);
    expect(mathService.DIVIDE(12,-3)).toBe(-4);
});

test('DIVIDE - Numerator is zero', () => {
    expect(() => {
        mathService.DIVIDE(12,0);
    }).toThrow("Division by zero error.");
    expect(() => {
        mathService.DIVIDE(-543,0);
    }).toThrow("Division by zero error.");
});

// MINUS
test('MINUS - Regular', () => {
    expect(mathService.MINUS([12341,8768,1435])).toBe(2138);
    expect(mathService.MINUS([12341.75,8768.23,1435.78])).toBe(2137.74);
    expect(mathService.MINUS([12341.755,8768.23,1435.78])).toBe(2137.75);
});

test('MINUS - Negative numbers', () => {
    expect(mathService.MINUS([56,-1,-1])).toBe(58);
    expect(mathService.MINUS([-56,-1,-1])).toBe(-54);
});

test('MINUS - Only one item in array', () => {
    expect(mathService.MINUS([123])).toBe(123);
});

test('MINUS - Empty array', () => {
    expect(mathService.MINUS([])).toBe(0);
});

// MULTIPLY
test('MULTIPLY - Regular', () => {
    expect(mathService.MULTIPLY([12, 134, 1.7])).toBe(2733.6);
    expect(mathService.MULTIPLY([12.1234, 134, 1.789])).toBe(2906.29);
});

test('MULTIPLY - Negative numbers', () => {
    expect(mathService.MULTIPLY([25,-1])).toBe(-25);
    expect(mathService.MULTIPLY([-25,-1, 1])).toBe(25);
});

test('MULTIPLY - Only one item in array', () => {
    expect(mathService.MULTIPLY([123])).toBe(123);
});

test('MULTIPLY - Empty array', () => {
    expect(mathService.MULTIPLY([])).toBe(0);
});

// ROUND
test('ROUND - Regular', () => {
    expect(mathService.ROUND(123, 2)).toBe(123);
    expect(mathService.ROUND(123.005, 2)).toBe(123.01);
    expect(mathService.ROUND(123.3456, 3)).toBe(123.346);
});

// SUM
test('SUM - Regular', () => {
    expect(mathService.SUM([34.5,12341,8768,5435])).toBe(26578.5);
    expect(mathService.SUM([34.201,12341.004,8768,5435])).toBe(26578.21);
    expect(mathService.SUM([34.201,12341.003,8768,5435])).toBe(26578.2);
});

test('SUM - Negative numbers', () => {
    expect(mathService.SUM([1,-1])).toBe(0);
    expect(mathService.SUM([-12,-1])).toBe(-13);
});

test('SUM - Only one item in array', () => {
    expect(mathService.SUM([123])).toBe(123);
});

test('SUM - Empty array', () => {
    expect(mathService.SUM([])).toBe(0);
});