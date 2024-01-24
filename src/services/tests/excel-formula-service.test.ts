import excelFormulaService from '../excel-formula-service';
import { CustomError } from '../../models/CustomError';

const validCases = [
    ['SUM(1,2,3,4)', 10],
    ['1+2+3+4', 10],
    ['SUM(-12,-12,-24)', -48],
    ['-12-12-24', -48],
    ['SUM(560,-60,-100)', 400],
    ['PRODUCT(1,2,3,4)', 24],
    ['1*2*3*4', 24],
    ['PRODUCT(1,2,0,4)', 0],
    ['PRODUCT(1,2,3,-4)', -24],
    ['12/2', 6],
    ['12/-2', -6]
];

const formulaUnknownCases = [
    'SIM(1,2,3,4)',
    'PRODDUCT(1,2,3,4)',
    '12//2',
];

const divisionByZeroCases = [
    '456/0',
    '-23/0'
];

describe('Generic', () => {
    test.each(validCases)('Given %s Returns %s', (formula, result) => {
        //Act
        const value: number = excelFormulaService.Generic(String(formula));

        //Assert
        expect(value).toBe(result);
    });

    test.each(formulaUnknownCases)('Given %s Returns Error', (formula) => {
        //Assert
        expect(() => {
            excelFormulaService.Generic(String(formula));
        }).toThrow(CustomError);
    });

    test.each(divisionByZeroCases)('Given %s Returns Error', (formula) => {
        //Assert
        expect(() => {
            excelFormulaService.Generic(String(formula));
        }).toThrow(CustomError);
    });
});

