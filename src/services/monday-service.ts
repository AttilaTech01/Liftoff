import mondayRepo from '../repositories/monday-repository';
import mathService, { MathOperationType } from './math-service';
import { Formula } from '../models/formula';
import { Item } from '../repositories/domain/ItemInformationResponse';
import { User } from '../repositories/domain/UserInformationResponse';
import { ColumnTypes } from '../constants/mondayColumnTypes';

interface IMondayService {
    applyFormula(formula: string, itemId: number, columnId: string, boardId: number): Promise<boolean>;
    updateItemName(boardId: number, itemId: number, value: string, userId: number): Promise<boolean>;
}

class MondayService implements IMondayService {
  async applyFormula(formula: string, itemId: number, columnId: string, boardId: number): Promise<boolean> {
    try {
        //Get infos from item
        const item: Item | undefined = await mondayRepo.getItemInformations(itemId);
        
        //Parse the formula : getting the values and column ids to use
        const parsedFormula: Formula = this.parseFormulaStructure(formula);

        if (!item || !parsedFormula) {
            return false;
        }

        //Build the array of numbers our formula needs
        //IF contains "}", then it is a column id and we need to get the value from the monday item
        //  IF la column Id est trouvé dans notre item && (la column est de type NUMBERS OU (la column est de type miroir && le contenu est un nombre))
        //ELSE it is a number already
        let numbersArray: number[] = [];
        parsedFormula.values.forEach((formulaValue) => {
            if (formulaValue.includes("{")) {
                item.column_values.forEach((itemColumn) => {
                if (itemColumn.id === this.getColumnIdFromCode(formulaValue) && (itemColumn.type === ColumnTypes.NUMBERS || (itemColumn.type === ColumnTypes.LOOKUP && this.isNumeric(itemColumn.text)))) {
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
                    throw Error("Number of values incorrect for division. Need 2 but found " + parsedFormula.values.length);
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
        console.log(err);
        return false;
    }
  }
  async updateItemName(boardId: number, itemId: number, value: string, userId: number): Promise<boolean> { 
    try {  
        //Get infos from item
        const item: Item | undefined = await mondayRepo.getItemInformations(itemId);

        if (!item) {
            return false;
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
        console.log(err);
        return false;
    }
  }

  /**
    * {pulse.number5}
    * RETURNS
    * number5
    */
  private getColumnIdFromCode(code: string): string {
    const columnId = code.substring(code.indexOf('.')+1, code.lastIndexOf('}'));
    return columnId;
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
        throw Error("No data has been received.");
    }

    const mathOp: MathOperationType = op[0].substring(0, op[0].length - 1) as MathOperationType;
    return { operation: mathOp, values: valuesAndColumnIds };
  }
}

export default new MondayService;