import { HyperFormula } from 'hyperformula';

interface IExcelFormulaService {
    Generic(formula: string): number;
}

class ExcelFormulaService implements IExcelFormulaService {
    Generic(formula: string): number {
        const options = {
            licenseKey: 'gpl-v3',
        };
        const data: [string[]] = [['='+formula]];

        const hfInstance = HyperFormula.buildFromArray(data, options);

        const result = hfInstance.getCellValue({ col: 0, row: 0, sheet: 0 });

        //Error handling
        if (String(result) === '#DIV/0!') {
            throw new Error("Division by zero error.");
        }
        if (String(result).charAt(0) === '#' && String(result).slice(-1) === '!') {
            throw new Error("An error occurred.");
        }

        return Number(result);
    }
}

export default new ExcelFormulaService;