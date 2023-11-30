import mathService from '../math-service';

// TESTS
test('DIVIDE_Regular_ReturnsResult', () => {
    //Assert
    expect(mathService.DIVIDE(12,3)).toBe(4);
    expect(mathService.DIVIDE(24.5,3)).toStrictEqual(8.17);
    expect(mathService.DIVIDE(24.5,3.5)).toBe(7);
});

test('DIVIDE_NegativeNumbers_ReturnsResult', () => {
    //Assert
    expect(mathService.DIVIDE(-12,3)).toBe(-4);
    expect(mathService.DIVIDE(-12,-3)).toBe(4);
    expect(mathService.DIVIDE(12,-3)).toBe(-4);
});

test('DIVIDE_NumeratorIsZero_ThrowsError', () => {
    //Assert
    expect(() => {
        mathService.DIVIDE(12,0);
    }).toThrow("Division by zero error.");
    expect(() => {
        mathService.DIVIDE(-543,0);
    }).toThrow("Division by zero error.");
});

test('MINUS_Regular_ReturnsResult', () => {
    //Assert
    expect(mathService.MINUS([12341,8768,1435])).toBe(2138);
    expect(mathService.MINUS([12341.75,8768.23,1435.78])).toStrictEqual(2137.74);
    expect(mathService.MINUS([12341.755,8768.23,1435.78])).toStrictEqual(2137.75);
});

test('MINUS_NegativeNumbers_ReturnsResult', () => {
    //Assert
    expect(mathService.MINUS([56,-1,-1])).toBe(58);
    expect(mathService.MINUS([-56,-1,-1])).toBe(-54);
});

test('MINUS_OneItemArray_ReturnsItem', () => {
    //Assert
    expect(mathService.MINUS([123])).toBe(123);
});

test('MINUS_EmptyArray_ReturnsZero', () => {
    //Assert
    expect(mathService.MINUS([])).toBe(0);
});

test('MULTIPLY_Regular_ReturnsResult', () => {
    //Assert
    expect(mathService.MULTIPLY([12, 134, 1.7])).toStrictEqual(2733.6);
    expect(mathService.MULTIPLY([12.1234, 134, 1.789])).toStrictEqual(2906.29);
});

test('MULTIPLY_NegativeNumbers_ReturnsResult', () => {
    //Assert
    expect(mathService.MULTIPLY([25,-1])).toBe(-25);
    expect(mathService.MULTIPLY([-25,-1, 1])).toBe(25);
});

test('MULTIPLY_OneItemArray_ReturnsItem', () => {
    //Assert
    expect(mathService.MULTIPLY([123])).toBe(123);
});

test('MULTIPLY_EmptyArray_ReturnsZero', () => {
    //Assert
    expect(mathService.MULTIPLY([])).toBe(0);
});

test('ROUND_Regular_ReturnsResult', () => {
    //Assert
    expect(mathService.ROUND(123, 2)).toBe(123);
    expect(mathService.ROUND(123.005, 2)).toStrictEqual(123.01);
    expect(mathService.ROUND(123.3456, 3)).toStrictEqual(123.346);
});

test('SUM_Regular_ReturnsResult', () => {
    //Assert
    expect(mathService.SUM([34.5,12341,8768,5435])).toStrictEqual(26578.5);
    expect(mathService.SUM([34.201,12341.004,8768,5435])).toStrictEqual(26578.21);
    expect(mathService.SUM([34.201,12341.003,8768,5435])).toStrictEqual(26578.2);
});

test('SUM_NegativeNumbers_ReturnsResult', () => {
    //Assert
    expect(mathService.SUM([1,-1])).toBe(0);
    expect(mathService.SUM([-12,-1])).toBe(-13);
});

test('SUM_OneItemArray_ReturnsItem', () => {
    //Assert
    expect(mathService.SUM([123])).toBe(123);
});

test('SUM_EmptyArray_ReturnsZero', () => {
    //Assert
    expect(mathService.SUM([])).toBe(0);
});