import mathService, { MathOperationType } from './math-service';
import { MondayColumnType } from '../constants/mondayTypes';
import errorHandler from '../middlewares/errorHandler';
import { CustomError } from '../models/Error';
import { Formula } from '../models/Formula';
import mondayRepo from '../repositories/monday-repository';
import { Column, Item } from '../repositories/domain/ItemInformationResponse';
import { User } from '../repositories/domain/UserInformationResponse';
import MondayErrorGenerator from '../utilities/mondayErrorGenerator';

interface IMondayService {
    applyFormula(boardId: number, itemId: number, formula: string, columnId: string): Promise<boolean>;
    copyColumnsContent(boardId: number, itemId: number, sourceColumns: string, targetColumns: string): Promise<boolean>;
    updateItemName(boardId: number, itemId: number, value: string, userId: number): Promise<boolean>;
}

class MondayService implements IMondayService {
  async applyFormula(boardId: number, itemId: number, formula: string, columnId: string): Promise<boolean> {
    try {
        //Get infos from item
        const item: Item | undefined = await mondayRepo.getItemInformations(itemId);
        
        //Parse the formula : getting the values and column ids to use
        const parsedFormula: Formula = this.parseFormulaStructure(formula);

        if (!item || !parsedFormula) {
            const message: string = "Couldn't get the data necessary to complete the operation.";
            throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Data unavailable", message, message) });
        }

        //Build the array of numbers our formula needs
        //IF contains "}", then it is a column id and we need to get the value from the monday item
        //  IF la column Id est trouvé dans notre item && (la column est de type NUMBERS OU (la column est de type miroir && le contenu est un nombre))
        //ELSE it is a number already
        let numbersArray: number[] = [];
        parsedFormula.values.forEach((formulaValue) => {
            if (formulaValue.includes("{")) {
                item.column_values.forEach((itemColumn) => {
                if (itemColumn.id === this.getColumnIdFromCode(formulaValue) && (itemColumn.type === MondayColumnType.NUMBERS || (itemColumn.type === MondayColumnType.LOOKUP && this.isNumeric(itemColumn.text)))) {
                    numbersArray.push(Number(itemColumn.text)); 
                } 
            });            
            } else {
                numbersArray.push(Number(formulaValue));
            }
        });

        //Execute the right formula with the found values
        let result: number = 0;
        switch(parsedFormula.operation) {
            case "DIVIDE": {
                if (parsedFormula.values.length !== 2) {
                    const message: string = "Number of values incorrect for division. Need 2 but found " + parsedFormula.values.length;
                    throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Division not possible", message, message) });
                }
                result = mathService.DIVIDE(numbersArray[0], numbersArray[1]);
                break;
            }
            case "MINUS": {
                result = mathService.MINUS(numbersArray);
                break;
            }
            case "MULTIPLY": {
                result = mathService.MULTIPLY(numbersArray);
                break;
            }
            case "SUM": {
                result = mathService.SUM(numbersArray);
                break;
            }
        }

        //Write result in monday's column
        await mondayRepo.changeSimpleColumnValue(boardId, itemId, columnId, result.toString());

        return true;
    } catch (err) {
        const error: CustomError = errorHandler.handleThrownObject(err, 'MondayService.applyFormula');
        throw error;
    }
  }

  async copyColumnsContent(boardId: number, itemId: number, sourceColumns: string, targetColumns: string): Promise<boolean> {
    try {
        const sourceIds: string[] = this.getColumnIdsFromCodes(sourceColumns);
        const targetIds: string[] = this.getColumnIdsFromCodes(targetColumns);

        if (sourceIds.length != targetIds.length) {
            const message: string = "Received " + sourceIds.length + " source column ids and " + targetIds.length + " target column ids. Each source must be matched to one target.";
            throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Parameters received are incorrect", message, message) });
        }

        const item: Item = await mondayRepo.getItemInformations(itemId);

        sourceIds.forEach(async (sourceId, index) => {
            const columnToCopy: Column | undefined = item.column_values.find(column => column.id === sourceId);

            if (columnToCopy == undefined) {
                const message: string = "The value of column with id " + sourceId + " couldn't be obtained.";
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Value is missing", message, message) });
            }

            await mondayRepo.changeSimpleColumnValue(boardId, itemId, targetIds[index], columnToCopy.text);
        });

        return true;
    } catch (err) {
        const error: CustomError = errorHandler.handleThrownObject(err, 'MondayService.copyColumnsContent');
        throw error;
    }
  }

  async updateItemName(boardId: number, itemId: number, value: string, userId: number): Promise<boolean> { 
    try {  
        //Get infos from item
        const item: Item | undefined = await mondayRepo.getItemInformations(itemId);

        if (!item) {
            const message: string = `Couldn't get the data from the item with id : ${itemId}.`;
            throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Item's data unavailable", message, message) });
        }

        //Search for values to use in new name
        const untrimmedColumnIds: string[] = this.parseNameStructure(value);

        //Create new name
        let newName: string = value;
        for (let index in untrimmedColumnIds) {
            const regEx = new RegExp(untrimmedColumnIds[index]);

            switch(untrimmedColumnIds[index]) { 
                case "{user.name}": { 
                    const user: User | undefined = await mondayRepo.getUserInformations(userId);
                    if (user) {
                        newName = newName.replace(regEx, user.name); 
                    } else {
                        newName = newName.replace(regEx, "N/A"); 
                    }
                    break; 
                } 
                case "{board.name}": {
                    newName = newName.replace(regEx, item.board.name);  
                    break; 
                } 
                case "{pulse.group}": { 
                    newName = newName.replace(regEx, item.group.title); 
                    break; 
                 } 
                 case "{pulse.name}": { 
                    newName = newName.replace(regEx, item.name); 
                    break; 
                 } 
                default: { 
                    for (let itemColumnIndex in item.column_values) {
                        if (item.column_values[itemColumnIndex].id === this.getColumnIdFromCode(regEx.toString())) {
                            newName = newName.replace(regEx, item.column_values[itemColumnIndex].text); 
                        }
                    }
                    break; 
                } 
             } 
        }

        //Updating Monday item's name
        await mondayRepo.changeSimpleColumnValue(boardId, itemId, "name", newName);
        return true;
    } catch (err) {
        const error: CustomError = errorHandler.handleThrownObject(err, 'MondayService.updateItemName');
        throw error;
    }
  }

  /**
    * {pulse.number5}
    * RETURNS
    * "number5"
    */
  private getColumnIdFromCode(code: string): string {
    const columnId = code.substring(code.indexOf('.')+1, code.lastIndexOf('}'));
    return columnId;
  }  

  /**
    * $(){pulse.number5}123{pulse.text2}XX{pulse.text45}
    * RETURNS
    * ["number5", "text2", "text45"]
    */
  private getColumnIdsFromCodes(codes: string): string[] {
    const regEx = new RegExp("{([^{]*?)}", 'g');
    let columnIds = codes.match(regEx);
    let arrayToReturn: string[] = [];

    if (columnIds == null) return arrayToReturn;

    columnIds.forEach((element) => {
        arrayToReturn.push(this.getColumnIdFromCode(element));
    });
    
    return arrayToReturn;
  }

  /**
    * "10" || "123.78" || "test"
    * RETURNS
    * true || true || false
    */
  private isNumeric(valueInString: string): boolean {
    const regEx = new RegExp("^-?[0-9]([0-9.,]+)?", 'g');
    return regEx.test(valueInString) ? true : false;
  }  

  /**
    * {board.name}${pulse.group}--{pulse.number5}/{pulse.text2}
    * RETURNS
    * [{board.name}, {pulse.group}, {pulse.number5}, {pulse.text2}]
    */
  private parseNameStructure(itemNameStructure: string): string[] {
    const regEx = new RegExp("{([^{]*?)}", 'g');
    const valuesList = itemNameStructure.match(regEx);
    let valuesToReturn: string[] = [];

    for (let index in valuesList) {
        valuesToReturn.push(valuesList[index]);
    }

    return valuesToReturn;
  }

  /**
    * SUM({pulse.number1}, 23, {pulse.number2}, {pulse.number3}, 10)
    * RETURNS
    * {
    *   formula : SUM
    *   columnIds : [{pulse.number1}, 23, {pulse.number2}, {pulse.number3}, 10]
    * }
    */
  private parseFormulaStructure(formulaStructure: string): Formula {
    //Operation
    const opRegEx = new RegExp("[A-Z]+\\(", 'g');
    const op: RegExpMatchArray | null = formulaStructure.match(opRegEx);

    //Columns Ids
    const idsRegEx = new RegExp("{([^{]*?)}|\\d+", 'g');
    const valuesAndColumnIds: RegExpMatchArray | null = formulaStructure.match(idsRegEx);

    if (!op || !valuesAndColumnIds || valuesAndColumnIds.length === 0) {
        const message: string = "Couldn't get the data necessary to complete the operation.";
        throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Data unavailable", message, message) });
    }

    const mathOp: MathOperationType = op[0].substring(0, op[0].length - 1) as MathOperationType;
    return { operation: mathOp, values: valuesAndColumnIds };
  }
}

export default new MondayService;