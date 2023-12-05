import mathService from '../math-service';

// TESTS
describe('AVERAGE', () => {
    test('Regular_ReturnsResult', () => {
        //Assert
        expect(mathService.AVERAGE([12, 134, 1.7])).toStrictEqual(49.23);
    });

    test('NegativeNumbers_ReturnsResult', () => {
        //Assert
        expect(mathService.AVERAGE([25,-1])).toBe(12);
        expect(mathService.AVERAGE([-25,-1, 1])).toBe(-8.33);
    });

    test('OneItemArray_ReturnsItem', () => {
        //Assert
        expect(mathService.AVERAGE([123])).toBe(123);
    });

    test('EmptyArray_ReturnsZero', () => {
        //Assert
        expect(mathService.AVERAGE([])).toBe(0);
    });    
});

describe('DIVIDE', () => {
    test('Regular_ReturnsResult', () => {
        //Assert
        expect(mathService.DIVIDE(12,3)).toBe(4);
        expect(mathService.DIVIDE(24.5,3)).toStrictEqual(8.17);
        expect(mathService.DIVIDE(24.5,3.5)).toBe(7);
    });

    test('NegativeNumbers_ReturnsResult', () => {
        //Assert
        expect(mathService.DIVIDE(-12,3)).toBe(-4);
        expect(mathService.DIVIDE(-12,-3)).toBe(4);
        expect(mathService.DIVIDE(12,-3)).toBe(-4);
    });

    test('NumeratorIsZero_ThrowsError', () => {
        //Assert
        expect(() => {
            mathService.DIVIDE(12,0);
        }).toThrow("Division by zero error.");
        expect(() => {
            mathService.DIVIDE(-543,0);
        }).toThrow("Division by zero error.");
    });
});

describe('MAX', () => {
    test('Regular_ReturnsResult', () => {
        //Assert
        expect(mathService.MAX([12341,8768,1435])).toBe(12341);
        expect(mathService.MAX([12341.75,8768.23,1435.78])).toStrictEqual(12341.75);
    });

    test('NegativeNumbers_ReturnsResult', () => {
        //Assert
        expect(mathService.MAX([56,-1,-1])).toBe(56);
        expect(mathService.MAX([-56,-1,-1])).toBe(-1);
    });

    test('OneItemArray_ReturnsItem', () => {
        //Assert
        expect(mathService.MAX([123])).toBe(123);
    });

    test('EmptyArray_ReturnsZero', () => {
        //Assert
        expect(mathService.MAX([])).toBe(0);
    });
});

describe('MIN', () => {
    test('Regular_ReturnsResult', () => {
        //Assert
        expect(mathService.MIN([12341,8768,1435])).toBe(1435);
        expect(mathService.MIN([12341.75,8768.23,1435.78])).toStrictEqual(1435.78);
    });

    test('NegativeNumbers_ReturnsResult', () => {
        //Assert
        expect(mathService.MIN([56,-1,-1])).toBe(-1);
        expect(mathService.MIN([-56,-1,-1])).toBe(-56);
    });

    test('OneItemArray_ReturnsItem', () => {
        //Assert
        expect(mathService.MIN([123])).toBe(123);
    });

    test('EmptyArray_ReturnsZero', () => {
        //Assert
        expect(mathService.MIN([])).toBe(0);
    });
});

describe('MINUS', () => {
    test('Regular_ReturnsResult', () => {
        //Assert
        expect(mathService.MINUS([12341,8768,1435])).toBe(2138);
        expect(mathService.MINUS([12341.75,8768.23,1435.78])).toStrictEqual(2137.74);
        expect(mathService.MINUS([12341.755,8768.23,1435.78])).toStrictEqual(2137.75);
    });

    test('NegativeNumbers_ReturnsResult', () => {
        //Assert
        expect(mathService.MINUS([56,-1,-1])).toBe(58);
        expect(mathService.MINUS([-56,-1,-1])).toBe(-54);
    });

    test('OneItemArray_ReturnsItem', () => {
        //Assert
        expect(mathService.MINUS([123])).toBe(123);
    });

    test('EmptyArray_ReturnsZero', () => {
        //Assert
        expect(mathService.MINUS([])).toBe(0);
    });
});

describe('MULTIPLY', () => {
    test('Regular_ReturnsResult', () => {
        //Assert
        expect(mathService.MULTIPLY([12, 134, 1.7])).toStrictEqual(2733.6);
        expect(mathService.MULTIPLY([12.1234, 134, 1.789])).toStrictEqual(2906.29);
    });

    test('NegativeNumbers_ReturnsResult', () => {
        //Assert
        expect(mathService.MULTIPLY([25,-1])).toBe(-25);
        expect(mathService.MULTIPLY([-25,-1, 1])).toBe(25);
    });

    test('OneItemArray_ReturnsItem', () => {
        //Assert
        expect(mathService.MULTIPLY([123])).toBe(123);
    });

    test('EmptyArray_ReturnsZero', () => {
        //Assert
        expect(mathService.MULTIPLY([])).toBe(0);
    });
});

describe('POWER', () => {
    test('Regular_ReturnsResult', () => {
        //Act
        const result: number = mathService.POWER(24.5,2.5);

        //Assert
        expect(mathService.POWER(12,3)).toBe(1728);
        expect(mathService.POWER(24.5,3)).toStrictEqual(14706.125);
        expect(mathService.ROUND(result, 3)).toStrictEqual(2971.086);
    });

    test('NegativeNumbers_ReturnsResult', () => {
        //Act
        const result: number = mathService.POWER(12,-2);

        //Assert
        expect(mathService.POWER(-12,3)).toBe(-1728);
        expect(mathService.ROUND(result, 5)).toStrictEqual(0.00694);
    });
});

describe('ROUND', () => {
    test('Regular_ReturnsResult', () => {
        //Assert
        expect(mathService.ROUND(123, 2)).toBe(123);
        expect(mathService.ROUND(123.005, 2)).toStrictEqual(123.01);
        expect(mathService.ROUND(123.3456, 3)).toStrictEqual(123.346);
    });
});

describe('SUM', () => {
    test('Regular_ReturnsResult', () => {
        //Assert
        expect(mathService.SUM([34.5,12341,8768,5435])).toStrictEqual(26578.5);
        expect(mathService.SUM([34.201,12341.004,8768,5435])).toStrictEqual(26578.21);
        expect(mathService.SUM([34.201,12341.003,8768,5435])).toStrictEqual(26578.2);
    });

    test('NegativeNumbers_ReturnsResult', () => {
        //Assert
        expect(mathService.SUM([1,-1])).toBe(0);
        expect(mathService.SUM([-12,-1])).toBe(-13);
    });

    test('OneItemArray_ReturnsItem', () => {
        //Assert
        expect(mathService.SUM([123])).toBe(123);
    });

    test('EmptyArray_ReturnsZero', () => {
        //Assert
        expect(mathService.SUM([])).toBe(0);
    });
});