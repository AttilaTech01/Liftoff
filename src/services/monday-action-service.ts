import excelFormulaService from './excel-formula-service';
import { GeneralColumnValue, StatusColumnValue } from '../constants/mondayTypes';
import errorHandler from '../middlewares/errorHandler';
import { CustomError } from '../models/CustomError';
import { SimpleItem } from '../models/SimpleItem';
import mondayRepo from '../repositories/monday-repository';
import { Board } from '../repositories/domain/Board';
import { Column } from '../repositories/domain/Column';
import { Item } from '../repositories/domain/Item';
import { ItemsPage } from '../repositories/domain/ItemsPage';
import { User } from '../repositories/domain/User';
import MondayErrorGenerator from '../utilities/mondayErrorGenerator';

interface IMondayActionService {
    applyFormula(boardId: number, itemId: number, formula: string, columnId: string): Promise<boolean>;
    checkAllDuplicates(boardId: number, statusColumnId: string, statusColumnValue: StatusColumnValue, verifiedColumnId: string): Promise<boolean>;
    checkDuplicates(boardId: number, columnId: string, columnValue: GeneralColumnValue, statusColumnId: string, statusColumnValue: StatusColumnValue): Promise<boolean>;
    copyColumnsContent(boardId: number, itemId: number, sourceColumns: string, targetColumns: string): Promise<boolean>;
    autoNumber(boardId: number, itemId: number, columnId: string, incrementValue: number): Promise<boolean>;
    updateItemName(boardId: number, itemId: number, value: string, userId: number): Promise<boolean>;
}

class MondayActionService implements IMondayActionService {
    async applyFormula(boardId: number, itemId: number, formula: string, columnId: string): Promise<boolean> {
        try {
            const formulaWithValues: string = await this.replaceColumnIdsByValues(formula, itemId);

            const result = excelFormulaService.Generic(formulaWithValues);

            //Write result in monday's column
            await mondayRepo.changeSimpleColumnValue(boardId, itemId, columnId, result.toString());

            return true;
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionService.applyFormula');
            throw error;
        }
    }

    async checkAllDuplicates(boardId: number, statusColumnId: string, statusColumnValue: StatusColumnValue, verifiedColumnId: string): Promise<boolean> {
        try {
            //Get items from a board
            const response: Board = await mondayRepo.getItemsByBoardId(boardId);

            if (response.items_page == undefined || response.items_page.items == undefined) {
                const message: string = "Couldn't get the data necessary to complete the operation.";
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Data unavailable", message, message) });
            }

            //Building simpler arrays to compare
            let simpleItemsToCompare: SimpleItem[] = [];
            let columnValues: string[] = [];
            response.items_page.items.forEach(item => {
                const columnToCompare: Column | undefined = item.column_values?.find(column => column.id === verifiedColumnId);
                if (item.id && columnToCompare?.text) {
                    columnValues.push(columnToCompare.text);
                    simpleItemsToCompare.push({ id: item.id, value: columnToCompare.text });
                }
            })

            //Iterate on cursor value (pagination) and get all items from board
            let currentCursor: string | undefined = response.items_page.cursor;
            while (currentCursor != undefined) {
                const cursorResponse: ItemsPage = await mondayRepo.getItemsNextPageFromCursorWithColumnValues(currentCursor);
                cursorResponse.items?.forEach(item => {
                    const columnToCompare: Column | undefined = item.column_values?.find(column => column.id === verifiedColumnId);
                    if (item.id && columnToCompare?.text) {
                        columnValues.push(columnToCompare.text);
                        simpleItemsToCompare.push({ id: item.id, value: columnToCompare.text });
                    }
                });
                currentCursor = cursorResponse.cursor;
            }

            //Find duplicate values
            const uniqueElements = new Set(columnValues);
            const duplicateValues: string[] = columnValues.filter(value => {
                if (uniqueElements.has(value)) {
                    uniqueElements.delete(value);
                } else {
                    return value;
                }
            });

            //Update status if value of item is a duplicate
            simpleItemsToCompare.forEach(async (simpleItem) => {
                if (duplicateValues.includes(simpleItem.value)) {
                    await mondayRepo.changeSimpleColumnValue(boardId, Number(simpleItem.id), statusColumnId, String(statusColumnValue.index));
                }
            });

            return true;
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionService.checkAllDuplicates');
            throw error;
        }
    }

    async checkDuplicates(boardId: number, columnId: string, columnValue: GeneralColumnValue, statusColumnId: string, statusColumnValue: StatusColumnValue): Promise<boolean> {
        try {
            //Get items with same value
            const response: ItemsPage = await mondayRepo.getItemsPageByColumnValues(boardId, columnId, [String(columnValue.value)]);

            if (response.items == undefined) {
                const message: string = "Couldn't get the data necessary to complete the operation.";
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Data unavailable", message, message) });
            }

            //Iterate on cursor value (pagination)
            let currentCursor: string | undefined = response.cursor;
            while (currentCursor != undefined) {
                const cursorResponse: ItemsPage = await mondayRepo.getItemsNextPageFromCursor(currentCursor);
                cursorResponse.items?.forEach(item => {
                    response.items?.push(item);
                });
                currentCursor = cursorResponse.cursor;
            }

            //Iterate and change status of duplicates
            if (response.items.length > 1) {
                response.items.forEach(async (item) => {
                    item.id && await mondayRepo.changeSimpleColumnValue(boardId, item.id, statusColumnId, String(statusColumnValue.index));
                });
            }

            return true;   
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionService.checkDuplicates');
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
                const columnToCopy: Column | undefined = item.column_values?.find(column => column.id === sourceId);

                if (columnToCopy == undefined || columnToCopy.text == undefined) {
                    const message: string = "The value of column with id " + sourceId + " couldn't be obtained.";
                    throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Value is missing", message, message) });
                }

                await mondayRepo.changeSimpleColumnValue(boardId, itemId, targetIds[index], columnToCopy.text);
            });

            return true;
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionService.copyColumnsContent');
            throw error;
        }
    }

    async autoNumber(boardId: number, itemId: number, columnId: string, incrementValue: number): Promise<boolean> {
        try {
            //Get filtered items based on board id and params
            const response: Board = await mondayRepo.getItemsPageWithFilters(boardId, columnId);

            if (response.items_page == undefined || response.items_page.items == undefined) {
                const message: string = "Couldn't get the data necessary to complete the operation.";
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Data unavailable", message, message) });
            }

            const itemList: Item[] = response.items_page.items;

            //Iterate on cursor value (pagination) and get all items from board
            let currentCursor: string | undefined = response.items_page.cursor;
            while (currentCursor != undefined) {
                const cursorResponse: ItemsPage = await mondayRepo.getItemsNextPageFromCursorWithColumnValues(currentCursor);
                cursorResponse.items?.forEach(item => {
                    itemList.push(item);
                });
                currentCursor = cursorResponse.cursor;
            }

            //Getting every value of the chosen column
            const valueList: number[] = [];
            itemList.forEach(item => {
                const column: Column | undefined = item.column_values?.find((column) => column.id === columnId);
                if (column && column.text) {
                    valueList.push(Number(column.text));
                }
            });

            //Find biggest value, add on it, change Monday column value
            const biggestValue: number = +Math.max(...valueList) + +incrementValue;
            await mondayRepo.changeSimpleColumnValue(boardId, itemId, columnId, String(biggestValue));

            return true;
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionService.autoNumber');
            throw error;
        }
    }

    async updateItemName(boardId: number, itemId: number, value: string, userId: number): Promise<boolean> { 
        try {  
            //Get infos from item
            const item: Item | undefined = await mondayRepo.getItemInformations(itemId);

            if (item == undefined) {
                const message: string = "Couldn't get the data necessary to complete the operation.";
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Data unavailable", message, message) });
            }

            //Search for values to use in new name
            const untrimmedColumnIds: string[] = this.parseColumnIds(value);

            //Create new name
            let newName: string = value;
            for (let index in untrimmedColumnIds) {
                const regEx = new RegExp(untrimmedColumnIds[index]);

                switch(untrimmedColumnIds[index]) { 
                    case "{user.name}": { 
                        const user: User = await mondayRepo.getUserInformations(userId);
                        if (user.name) {
                            newName = newName.replace(regEx, user.name);
                        } else {
                            newName = newName.replace(regEx, "N/A"); 
                        }
                        break; 
                    } 
                    case "{board.name}": {
                        if (item.board?.name) newName = newName.replace(regEx, item.board.name);  
                        break; 
                    } 
                    case "{pulse.group}": { 
                        if (item.group?.title) newName = newName.replace(regEx, item.group.title); 
                        break; 
                    } 
                    case "{pulse.name}": { 
                        if (item.name) newName = newName.replace(regEx, item.name); 
                        break; 
                    } 
                    default: { 
                        for (let itemColumnIndex in item.column_values) {
                            if (item.column_values[itemColumnIndex].id === this.getColumnIdFromCode(regEx.toString())) {
                                newName = newName.replace(regEx, item.column_values[itemColumnIndex].text);
                            } else if (item.column_values.length === Number(itemColumnIndex) + 1) {
                                newName = newName.replace(regEx, "N/A"); 
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
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionService.updateItemName');
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
     * $(){pulse.number5}123{pulse.text2}XX{pulse.text45}
     * {board.name}${pulse.group}--{pulse.number5}/{pulse.text2}
     * SUM({pulse.number1}, 23, {pulse.number2}, {pulse.number3}, 10)
     * 
     * RETURNS
     * $()number5Value123text2ValueXXtext45Value
     * boardName$groupName--number5Value/text2Value
     * SUM(number1Value, 23, number2Value, number3Value, 10)
    */
    private async replaceColumnIdsByValues(stringWithColumnIds: string, itemId: number): Promise<string> {
        try {
            let stringWithColumnValues: string = stringWithColumnIds; 

            //Get infos from item
            const item: Item = await mondayRepo.getItemInformations(itemId);

            //Parsing the string : getting the column ids to replace
            const isolatedIds: string[] = this.parseColumnIds(stringWithColumnIds);

            if (!stringWithColumnValues || (isolatedIds.length > 0 && !item)) {
                const message: string = "Couldn't get the data necessary to complete the operation.";
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Data unavailable", message, message) });
            }

            isolatedIds.forEach((columnId) => {
                item.column_values?.forEach((itemColumn) => {
                    if (itemColumn.id === this.getColumnIdFromCode(columnId)) {
                        stringWithColumnValues = itemColumn.text ? stringWithColumnValues.replace(columnId, itemColumn.text) : stringWithColumnValues;
                    } 
                });            
            });

            if (stringWithColumnValues.includes("{")) {
                const message: string = "Characters '{' and '}' should only be used in column identification.";
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Bad Request", message, message) });
            }

            return stringWithColumnValues;
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionService.replaceColumnIdsByValues');
            throw error;
        }
    } 

    /**
        * $(){pulse.number5}123{pulse.text2}XX{pulse.text45}
        * {board.name}${pulse.group}--{pulse.number5}/{pulse.text2}
        * SUM({pulse.number1}, 23, {pulse.number2}, {pulse.number3}, 10)
        * 
        * RETURNS
        * [{pulse.number5}, {pulse.text2}, {pulse.text45}]
        * [{board.name}, {pulse.group}, {pulse.number5}, {pulse.text2}]
        * [{pulse.number1}, {pulse.number2}, {pulse.number3}]
    */
    private parseColumnIds(stringWithColumnIds: string): string[] {
        const regEx = new RegExp("{([^{]*?)}", 'g');
        const columnIds = stringWithColumnIds.match(regEx);
        let valuesToReturn: string[] = [];

        for (let index in columnIds) {
            valuesToReturn.push(columnIds[index]);
        }

        return valuesToReturn;
    }  
}

export default new MondayActionService;