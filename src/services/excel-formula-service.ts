import { HyperFormula } from 'hyperformula';
import errorHandler from '../middlewares/errorHandler';
import { CustomError } from '../models/CustomError';
import MondayErrorGenerator from '../utilities/mondayErrorGenerator';

interface IExcelFormulaService {
    Generic(formula: string): number;
}

class ExcelFormulaService implements IExcelFormulaService {
    Generic(formula: string): number {
        try {
            const options = {
                licenseKey: 'gpl-v3',
            };
            const data: [string[]] = [['='+formula]];
    
            const hfInstance = HyperFormula.buildFromArray(data, options);
    
            const result = hfInstance.getCellValue({ col: 0, row: 0, sheet: 0 });
    
            //Error handling
            if (String(result) === '#DIV/0!') {
                const message: string = "Division by zero error.";
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Bad Request", message, message) });
            }
            if (String(result).charAt(0) === '#') {
                const message: string = "The given formula isn't valid.";
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Bad Request", message, message) });
            }
    
            return Number(result);
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'ExcelFormulaService.Generic');
            throw error;
        }
    }
}

export default new ExcelFormulaService;