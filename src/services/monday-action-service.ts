import excelFormulaService from './excel-formula-service';
import { CustomTypeItem, GeneralColumnValue, MondayColumnType, StatusColumnValue } from '../constants/mondayTypes';
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
import Utilities from '../utilities/utilities';

interface IMondayActionService {
    applyFormula(boardId: number, itemId: number, formula: string, columnId: string): Promise<boolean>;
    autoId(boardId: number, itemId: number, columnId: string, format: string, numberOfDigits: number, userId: number): Promise<boolean>;
    autoNumber(boardId: number, itemId: number, columnId: string, incrementValue: number): Promise<boolean>;
    checkAllDatesStatusCondition(boardId: number, numberOfDays: number, dateColumnId: string, statusColumnId: string, statusColumnValue: StatusColumnValue, conditionStatusColumnId: string, conditionStatusColumnValue: StatusColumnValue, bool: CustomTypeItem): Promise<boolean>;
    checkAllDatesEmptyCondition(boardId: number, numberOfDays: number, dateColumnId: string, conditionColumnId: string, statusColumnId: string, statusColumnValue: StatusColumnValue): Promise<boolean>;
    checkAllDuplicates(boardId: number, statusColumnId: string, statusColumnValue: StatusColumnValue, verifiedColumnId: string): Promise<boolean>;
    checkDateStatusCondition(boardId: number, itemId: number, numberOfDays: number, dateColumnId: string, statusColumnId: string, statusColumnValue: StatusColumnValue, conditionStatusColumnId: string, conditionStatusColumnValue: StatusColumnValue, bool: CustomTypeItem): Promise<boolean>;
    checkDateEmptyCondition(boardId: number, itemId: number, numberOfDays: number, dateColumnId: string, conditionColumnId: string, statusColumnId: string, statusColumnValue: StatusColumnValue): Promise<boolean>;
    checkDuplicates(boardId: number, itemId: number, columnId: string, columnValue: GeneralColumnValue, statusColumnId: string, statusColumnValue: StatusColumnValue): Promise<boolean>;
    copyColumnsContent(boardId: number, itemId: number, sourceColumns: string, targetColumns: string): Promise<boolean>;
    updateItemName(boardId: number, itemId: number, value: string, userId: number): Promise<boolean>;
}

class MondayActionService implements IMondayActionService {
    async applyFormula(boardId: number, itemId: number, formula: string, columnId: string): Promise<boolean> {
        try {
            const formulaWithValues: string = await this.replaceIdsByValues(formula, itemId);

            const result = excelFormulaService.Generic(formulaWithValues);

            //Write result in monday's column
            await mondayRepo.changeSimpleColumnValue(boardId, itemId, columnId, result.toString());

            return true;
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionService.applyFormula');
            throw error;
        }
    }

    async autoId(boardId: number, itemId: number, columnId: string, format: string, numberOfDigits: number, userId: number): Promise<boolean> {
        let formatStringWithValues: string = format;

        try {
            //Get filtered items based on board id and params
            const board: Board = await mondayRepo.getItemsPageWithFiltersText(boardId, columnId);

            if (board.items_page == undefined || board.items_page.items == undefined) {
                const message: string = "Couldn't get the data necessary to complete the operation.";
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Data unavailable", message, message) });
            }

            const itemList: Item[] = board.items_page.items;

            //Iterate on cursor value (pagination) and get all items from board
            let currentCursor: string | undefined = board.items_page.cursor;
            while (currentCursor != undefined) {
                const cursorResponse: ItemsPage = await mondayRepo.getItemsNextPageFromCursorWithColumnValues(currentCursor);
                cursorResponse.items?.forEach(item => {
                    itemList.push(item);
                });
                currentCursor = cursorResponse.cursor;
            }
            
            //Getting all {ID} values
            const valueList: string[] = [];
            itemList.forEach(item => {
                const column: Column | undefined = item.column_values?.find((column) => column.id === columnId);
                if (column && column.text) {
                    const startIndexOfId: number = format.indexOf("{ID}");
                                        valueList.push(column.text.substring(startIndexOfId, +startIndexOfId + +numberOfDigits));
                }
            });
            
            //Find biggest value, add on it, replace it in our new string
            if (valueList.length <= 0) {
                const newID: string = Utilities.transformNumberIntoStringWithDigits(1, numberOfDigits);
                formatStringWithValues = formatStringWithValues.replace('{ID}', newID);
            } else {
                const numberValueList: number[] = Utilities.transformStringsWithDigitsIntoNumbers(valueList);
                const newBiggestValue: number = +Math.max(...numberValueList) + +1;
                const newID: string = Utilities.transformNumberIntoStringWithDigits(newBiggestValue, numberOfDigits);
                formatStringWithValues = formatStringWithValues.replace('{ID}', newID);
            }

            //Replacing all other ids in the asked format by their value
            formatStringWithValues = await this.replaceIdsByValues(formatStringWithValues, itemId, userId);

            //Updating Monday's specified column
            await mondayRepo.changeSimpleColumnValue(boardId, itemId, columnId, formatStringWithValues);
            return true;
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionService.autoNumber');
            throw error;
        }
    }

    async autoNumber(boardId: number, itemId: number, columnId: string, incrementValue: number): Promise<boolean> {
        try {
            //Get filtered items based on board id and params
            const response: Board = await mondayRepo.getItemsPageWithFiltersNumber(boardId, columnId);

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

    async checkAllDatesStatusCondition(boardId: number, numberOfDays: number, dateColumnId: string, statusColumnId: string, statusColumnValue: StatusColumnValue, conditionStatusColumnId: string, conditionStatusColumnValue: StatusColumnValue, bool: CustomTypeItem): Promise<boolean> {
        try {
            //Get items from a board
            const response: Board = await mondayRepo.getItemsByBoardId(boardId);

            if (response.items_page == undefined || response.items_page.items == undefined) {
                const message: string = "Couldn't get the data necessary to complete the operation.";
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Data unavailable", message, message) });
            }

            //Iterate on cursor value (pagination) and get all items from board
            const itemList: Item[] = response.items_page.items;
            let currentCursor: string | undefined = response.items_page.cursor;
            while (currentCursor != undefined) {
                const cursorResponse: ItemsPage = await mondayRepo.getItemsNextPageFromCursorWithColumnValues(currentCursor);
                cursorResponse.items?.forEach(item => {
                    itemList.push(item);
                });
                currentCursor = cursorResponse.cursor;
            }

            //If status respects condition, check dates for each item in board
            itemList.forEach(async item => {
                let index;
                const trueOrFalse: boolean = bool.value == "true" ? true : false;
                if (item.column_values) {
                    for (let column of item.column_values) {
                        if (column.id === conditionStatusColumnId) {
                            index = column.index;
                        } 
                    }
                }

                if (index != undefined && ((index === conditionStatusColumnValue.index) === trueOrFalse)) {
                    await this.localCheckAllDates(boardId, item, numberOfDays, dateColumnId, statusColumnId, statusColumnValue);
                }
            });

            return true;   
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionService.checkAllDatesStatusCondition');
            throw error;
        }
    }

    async checkAllDatesEmptyCondition(boardId: number, numberOfDays: number, dateColumnId: string, conditionColumnId: string, statusColumnId: string, statusColumnValue: StatusColumnValue): Promise<boolean> {
        try {
            //Get items from a board
            const response: Board = await mondayRepo.getItemsByBoardId(boardId);

            if (response.items_page == undefined || response.items_page.items == undefined) {
                const message: string = "Couldn't get the data necessary to complete the operation.";
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Data unavailable", message, message) });
            }

            //Iterate on cursor value (pagination) and get all items from board
            const itemList: Item[] = response.items_page.items;
            let currentCursor: string | undefined = response.items_page.cursor;
            while (currentCursor != undefined) {
                const cursorResponse: ItemsPage = await mondayRepo.getItemsNextPageFromCursorWithColumnValues(currentCursor);
                cursorResponse.items?.forEach(item => {
                    itemList.push(item);
                });
                currentCursor = cursorResponse.cursor;
            }

            //If value in condition column, check dates for each item in board
            itemList.forEach(async item => {
                let value;
                if (item.column_values) {
                    for (let column of item.column_values) {
                        if (column.id === conditionColumnId) {
                            value = column.text;
                        } 
                    }
                }

                if (!value) {
                    await this.localCheckAllDates(boardId, item, numberOfDays, dateColumnId, statusColumnId, statusColumnValue);
                }
            });

            return true;
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionService.checkAllDatesEmptyCondition');
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

    async checkDateStatusCondition(boardId: number, itemId: number, numberOfDays: number, dateColumnId: string, statusColumnId: string, statusColumnValue: StatusColumnValue, conditionStatusColumnId: string, conditionStatusColumnValue: StatusColumnValue, bool: CustomTypeItem): Promise<boolean> {
        try {
            const trueOrFalse: boolean = bool.value == "true" ? true : false;

            //Get item informations
            const item: Item = await mondayRepo.getItemInformations(itemId);

            //Get status condition value
            let index;
            if (item.column_values) {
                for (let column of item.column_values) {
                    if (column.id === conditionStatusColumnId) {
                        index = column.index;
                    } 
                }
            }

            if (index == undefined) {
                const message: string = "Given columns couldn't be found.";
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Data unavailable", message, message) });
            }

            //Only check date if condition is met
            if ((index === conditionStatusColumnValue.index) === trueOrFalse) {
                await this.localCheckAllDates(boardId, item, numberOfDays, dateColumnId, statusColumnId, statusColumnValue);
            }

            return true;   
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionService.checkDateStatusCondition');
            throw error;
        }
    }

    async checkDateEmptyCondition(boardId: number, itemId: number, numberOfDays: number, dateColumnId: string, conditionColumnId: string, statusColumnId: string, statusColumnValue: StatusColumnValue): Promise<boolean> {
        try {
            //Get item informations
            const item: Item = await mondayRepo.getItemInformations(itemId);

            if (!item || !item.column_values) {
                const message: string = "Couldn't get the data necessary to complete the operation.";
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Data unavailable", message, message) });
            }

            //Check if the condition value is empty
            let value;
            for (let column of item.column_values) {
                if (column.id === conditionColumnId) {
                    value = column.text;
                } 
            }

            if (!value) {
                await this.localCheckDate(boardId, item, numberOfDays, dateColumnId, statusColumnId, statusColumnValue);  
            }
            return true;
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionService.checkDateEmptyCondition');
            throw error;
        }
    }

    async checkDuplicates(boardId: number, itemId: number, columnId: string, columnValue: GeneralColumnValue, statusColumnId: string, statusColumnValue: StatusColumnValue): Promise<boolean> {
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

            //If duplicates have been found, change status
            if (response.items.length > 1) {
                mondayRepo.changeSimpleColumnValue(boardId, itemId, statusColumnId, String(statusColumnValue.index));
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
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Received parameters are incorrect", message, message) });
            }

            const item: Item = await mondayRepo.getItemInformations(itemId);
            let targetColumnsArray: Column[] = [];

            targetIds.forEach(async (targetId) => {
                const targetColumn: Column | undefined = item.column_values?.find(column => column.id === targetId);

                if (targetColumn == undefined || targetColumn.text == undefined) {
                    const message: string = "The target column with id " + targetId + " couldn't be found.";
                    throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Value is missing", message, message) });
                }

                targetColumnsArray.push(targetColumn);
            });

            sourceIds.forEach(async (sourceId, index) => {
                const columnToCopy: Column | undefined = item.column_values?.find(column => column.id === sourceId);

                if (columnToCopy == undefined || columnToCopy.text == undefined) {
                    const message: string = "The value of column with id " + sourceId + " couldn't be obtained.";
                    throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Value is missing", message, message) });
                }

                if (targetColumnsArray[index].type === MondayColumnType.EMAIL) {
                    await mondayRepo.changeSimpleEmailColumnValue(boardId, itemId, targetIds[index], columnToCopy.text);
                } else {
                    await mondayRepo.changeSimpleColumnValue(boardId, itemId, targetIds[index], columnToCopy.text);
                }
            });

            return true;
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionService.copyColumnsContent');
            throw error;
        }
    }

    async updateItemName(boardId: number, itemId: number, value: string, userId: number): Promise<boolean> { 
        try { 
            //Create new name
            let newName: string = await this.replaceIdsByValues(value, itemId, userId);

            //Updating Monday item's name
            await mondayRepo.changeSimpleColumnValue(boardId, itemId, "name", newName);
            return true;
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionService.updateItemName');
            throw error;
        }
    }

    //PRIVATE FUNCTIONS

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

    private async localCheckAllDates(boardId: number, item: Item, numberOfDays: number, dateColumnId: string, statusColumnId: string, statusColumnValue: StatusColumnValue): Promise<boolean> {
        try {
            if (!item.id || !item.column_values) {
                const message: string = "Couldn't get the data necessary to complete the operation.";
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Data unavailable", message, message) });
            }

            //Find the value of the date
            let dateAsString: string | undefined;
            for (let column of item.column_values) {
                if (column.id === dateColumnId) {
                    dateAsString = column.text;
                }
            }

            if (!dateAsString) {
                return true;
            }

            //Compare with numberOfDays
            const [year, month, day] = dateAsString.split('-');
            const dateAsDate: Date = new Date(+year, +month - 1, +day);
            const today: Date = new Date(new Date().toDateString());
            const daysDiff = Math.round((today.getTime() - dateAsDate.getTime()) / (24 * 60 * 60 * 1000));

            //Update Monday status if needed
            if (daysDiff > numberOfDays) {
                await mondayRepo.changeSimpleColumnValue(boardId, item.id, statusColumnId, String(statusColumnValue.index));
            }

            return true;   
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionService.localCheckAllDates');
            throw error;
        }
    }

    private async localCheckDate(boardId: number, item: Item, numberOfDays: number, dateColumnId: string, statusColumnId: string, statusColumnValue: StatusColumnValue): Promise<boolean> {
        try {
            if (!item.id || !item.column_values) {
                const message: string = "Couldn't get the data necessary to complete the operation.";
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Data unavailable", message, message) });
            }

            //Find the value of the date
            let dateAsString: string | undefined;
            for (let column of item.column_values) {
                if (column.id === dateColumnId) {
                    dateAsString = column.text;
                } 
            }

            if (!dateAsString) {
                const message: string = "Couldn't find a date from the given column id.";
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Data unavailable", message, message) });
            }

            //Compare with numberOfDays
            const [year, month, day] = dateAsString.split('-');
            const dateAsDate: Date = new Date(+year, +month - 1, +day);
            const today: Date = new Date(new Date().toDateString());
            const daysDiff = Math.round((today.getTime() - dateAsDate.getTime()) / (24 * 60 * 60 * 1000));

            //Update Monday status if needed
            if (daysDiff > numberOfDays) {
                await mondayRepo.changeSimpleColumnValue(boardId, item.id, statusColumnId, String(statusColumnValue.index));
            }

            return true;   
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionService.localCheckDate');
            throw error;
        }
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
    private async replaceIdsByValues(stringWithContextAndColumnIds: string, itemId: number, userId?: number): Promise<string> {
        try {
            let stringWithColumnValues: string = stringWithContextAndColumnIds; 

            //Parsing the string : getting the context and/or column ids to replace
            const isolatedIds: string[] = this.parseContextAndColumnIds(stringWithContextAndColumnIds);

            if (!isolatedIds || isolatedIds.length <= 0) {
                return stringWithColumnValues;
            }

            //Get infos from item
            const item: Item = await mondayRepo.getItemInformations(itemId);

            if (!item) {
                const message: string = "Couldn't get the data necessary to complete the operation.";
                throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Data unavailable", message, message) });
            }

            //Iterate on ids and get the value
            for (let index in isolatedIds) {
                const regEx = new RegExp(isolatedIds[index]);
                switch(isolatedIds[index]) { 
                    case "{user.name}": { 
                        if (userId) {
                            const user: User = await mondayRepo.getUserInformations(userId);
                            if (user.name) {
                                stringWithColumnValues = stringWithColumnValues.replace(regEx, user.name);
                            } else {
                                stringWithColumnValues = stringWithColumnValues.replace(regEx, "N/D"); 
                            }
                        } else {
                            const message: string = "Couldn't find the user name.";
                            throw new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000("Data unavailable", message, message) });
                        }
                        break; 
                    } 
                    case "{board.name}": {
                        if (item.board?.name) stringWithColumnValues = stringWithColumnValues.replace(regEx, item.board.name);  
                        break; 
                    } 
                    case "{pulse.group}": { 
                        if (item.group?.title) stringWithColumnValues = stringWithColumnValues.replace(regEx, item.group.title); 
                        break; 
                    } 
                    case "{pulse.name}": { 
                        if (item.name) stringWithColumnValues = stringWithColumnValues.replace(regEx, item.name); 
                        break; 
                    } 
                    default: { 
                        for (let itemColumnIndex in item.column_values) {
                            if (item.column_values[itemColumnIndex].id === this.getColumnIdFromCode(isolatedIds[index])) {
                                stringWithColumnValues = item.column_values[itemColumnIndex].text ? stringWithColumnValues.replace(regEx, item.column_values[itemColumnIndex].text) : stringWithColumnValues.replace(regEx, "N/D");
                            } else if (item.column_values.length === Number(itemColumnIndex) + 1) {
                                stringWithColumnValues = stringWithColumnValues.replace(regEx, "N/D"); 
                            }
                        }
                        break; 
                    } 
                } 
            }

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
    private parseContextAndColumnIds(stringWithColumnIds: string): string[] {
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