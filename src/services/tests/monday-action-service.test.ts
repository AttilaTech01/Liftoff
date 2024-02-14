import mathService from '../excel-formula-service';
import mondayService from '../monday-action-service';
import { CustomTypeItem, GeneralColumnValue, StatusColumnValue } from '../../constants/mondayTypes';
import { CustomError } from '../../models/CustomError';
import mondayRepo from '../../repositories/monday-repository';
import { Board } from '../../repositories/domain/Board';
import { Item } from '../../repositories/domain/Item';
import { ItemsPage } from '../../repositories/domain/ItemsPage';
import { User } from '../../repositories/domain/User';
import MockBoard from '../../repositories/domain/__mocks__/Board';
import MockItem from '../../repositories/domain/__mocks__/Item';
import MockItemsPage from '../../repositories/domain/__mocks__/ItemsPage';
import MockUser from '../../repositories/domain/__mocks__/User';

let mockBoard: Board = MockBoard.mockValidBoard();
let mockItem: Item = MockItem.mockValidItem();
let mockItemsPage: ItemsPage = MockItemsPage.mockValidItemsPage();
const mockUser: User = MockUser.mockValidUser();

afterEach(() => {
    jest.restoreAllMocks();
});

describe('applyFormula', () => {
    test('ValidParams_ReturnsTrue', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const formula: string = "SUM({pulse.id},{pulse.id})";
        const columnId: string = '1';
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);
        jest.spyOn(mathService, "Generic").mockImplementation(() => 4);

        //Act
        const result: boolean = await mondayService.applyFormula(boardId, itemId, formula, columnId);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
        expect(mockChangeValue).toHaveBeenCalledTimes(1);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, itemId, columnId, '4');
    });

    test('GetItemReturnsError_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const formula: string = "SUM({pulse.id},{pulse.id})";
        const columnId: string = '1';
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockRejectedValueOnce(new Error('errorMessage'));

        //Act
        await expect(mondayService.applyFormula(boardId, itemId, formula, columnId)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
    });

    test('ExcelFormulaServiceInError_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const formula: string = "SUM({pulse.id},{pulse.id})";
        const columnId: string = '1';
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);
        const mockMathService = jest.spyOn(mathService, "Generic").mockImplementation(() => { throw new Error('errorMessage') });

        //Act
        await expect(mondayService.applyFormula(boardId, itemId, formula, columnId)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
        expect(mockMathService).toHaveBeenCalledTimes(1);
        expect(mockMathService).toHaveBeenCalledWith("SUM(2,2)");
    });
});

describe('autoId', () => {
    test('ValidParams_ReturnsTrue', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const columnId: string = 'id2';
        const format: string = "TEST-{ID}-{board.name}-{pulse.id}";
        const nbOfDigits: number = 5;
        const userId: number = 1;
        const mockBoard: Board = MockBoard.mockCustomBoard();

        const mockGetItemsPage = jest.spyOn(mondayRepo, "getItemsPageWithFiltersText").mockResolvedValue(mockBoard);
        const mockGetNextItemsPage = jest.spyOn(mondayRepo, "getItemsNextPageFromCursorWithColumnValues").mockResolvedValue(mockItemsPage);
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.autoId(boardId, itemId, columnId, format, nbOfDigits, userId);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetItemsPage).toHaveBeenCalledWith(boardId, columnId);
        expect(mockGetNextItemsPage).not.toHaveBeenCalled();
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
        expect(mockChangeValue).toHaveBeenCalledTimes(1);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, itemId, columnId, "TEST-00235-boardName-2");
    });

    test('ValidParamsWithCursor_ReturnsTrue', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const columnId: string = 'id2';
        const format: string = "TEST-{ID}-{board.name}-{pulse.id}";
        const nbOfDigits: number = 5;
        const userId: number = 1;
        const mockBoard: Board = MockBoard.mockCustomBoard('withCursor');

        const mockGetItemsPage = jest.spyOn(mondayRepo, "getItemsPageWithFiltersText").mockResolvedValue(mockBoard);
        const mockGetNextItemsPage = jest.spyOn(mondayRepo, "getItemsNextPageFromCursorWithColumnValues").mockResolvedValue(mockItemsPage);
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.autoId(boardId, itemId, columnId, format, nbOfDigits, userId);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetItemsPage).toHaveBeenCalledWith(boardId, columnId);
        expect(mockGetNextItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetNextItemsPage).toHaveBeenCalledWith(mockBoard.items_page?.cursor);
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
        expect(mockChangeValue).toHaveBeenCalledTimes(1);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, itemId, columnId, "TEST-00235-boardName-2");
    });

    test('GetItemsPageReturnsError_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const columnId: string = 'id2';
        const format: string = "TEST-{ID}-{board.name}-{pulse.id}";
        const nbOfDigits: number = 5;
        const userId: number = 1;

        const mockGetItemsPage = jest.spyOn(mondayRepo, "getItemsPageWithFiltersText").mockRejectedValueOnce(new Error('errorMessage'));

        //Act
        await expect(mondayService.autoId(boardId, itemId, columnId, format, nbOfDigits, userId)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetItemsPage).toHaveBeenCalledWith(boardId, columnId);
    });

    test('ItemNotFound_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const columnId: string = 'id2';
        const format: string = "TEST-{ID}-{board.name}-{pulse.id}";
        const nbOfDigits: number = 5;
        const userId: number = 1;
        mockBoard.items_page = undefined;

        const mockGetItemsPage = jest.spyOn(mondayRepo, "getItemsPageWithFiltersText").mockResolvedValue(mockBoard);

        //Act
        await expect(mondayService.autoId(boardId, itemId, columnId, format, nbOfDigits, userId)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetItemsPage).toHaveBeenCalledWith(boardId, columnId);
    });

    test('GetItemReturnsError_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const columnId: string = 'id2';
        const format: string = "TEST-{ID}-{board.name}-{pulse.id}";
        const nbOfDigits: number = 5;
        const userId: number = 1;
        const mockBoard: Board = MockBoard.mockCustomBoard();

        const mockGetItemsPage = jest.spyOn(mondayRepo, "getItemsPageWithFiltersText").mockResolvedValue(mockBoard);
        const mockGetNextItemsPage = jest.spyOn(mondayRepo, "getItemsNextPageFromCursorWithColumnValues").mockResolvedValue(mockItemsPage);
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockRejectedValueOnce(new Error('errorMessage'));

        //Act
        await expect(mondayService.autoId(boardId, itemId, columnId, format, nbOfDigits, userId)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetItemsPage).toHaveBeenCalledWith(boardId, columnId);
        expect(mockGetNextItemsPage).not.toHaveBeenCalled();
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
    });
});

describe('autoNumber', () => {
    test('ValidParams_ReturnsTrue', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const columnId: string = 'id1';
        const incrementValue: number = 1;
        mockBoard = MockBoard.mockCustomBoard();

        const mockGetItemsPage = jest.spyOn(mondayRepo, "getItemsPageWithFiltersNumber").mockResolvedValue(mockBoard);
        const mockGetNextItemsPage = jest.spyOn(mondayRepo, "getItemsNextPageFromCursorWithColumnValues").mockResolvedValue(mockItemsPage);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.autoNumber(boardId, itemId, columnId, incrementValue);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetItemsPage).toHaveBeenCalledWith(boardId, columnId);
        expect(mockGetNextItemsPage).not.toHaveBeenCalled();
        expect(mockChangeValue).toHaveBeenCalledTimes(1);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, itemId, columnId, "7");
    });

    test('ValidParamsWithCursor_ReturnsTrue', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const columnId: string = 'id1';
        const incrementValue: number = 1;
        mockBoard = MockBoard.mockCustomBoard('withCursor');

        const mockGetItemsPage = jest.spyOn(mondayRepo, "getItemsPageWithFiltersNumber").mockResolvedValue(mockBoard);
        const mockGetNextItemsPage = jest.spyOn(mondayRepo, "getItemsNextPageFromCursorWithColumnValues").mockResolvedValue(mockItemsPage);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.autoNumber(boardId, itemId, columnId, incrementValue);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetItemsPage).toHaveBeenCalledWith(boardId, columnId);
        expect(mockGetNextItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetNextItemsPage).toHaveBeenCalledWith(mockBoard.items_page?.cursor);
        expect(mockChangeValue).toHaveBeenCalledTimes(1);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, itemId, columnId, "7");
    });

    test('GetItemsPageReturnsError_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const columnId: string = 'id1';
        const incrementValue: number = 1;

        const mockGetItemsPage = jest.spyOn(mondayRepo, "getItemsPageWithFiltersNumber").mockRejectedValueOnce(new Error('errorMessage'));

        //Act
        await expect(mondayService.autoNumber(boardId, itemId, columnId, incrementValue)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetItemsPage).toHaveBeenCalledWith(boardId, columnId);
    });

    test('ItemNotFound_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const columnId: string = 'id1';
        const incrementValue: number = 1;
        mockBoard.items_page = undefined;

        const mockGetItemsPage = jest.spyOn(mondayRepo, "getItemsPageWithFiltersNumber").mockResolvedValue(mockBoard);

        //Act
        await expect(mondayService.autoNumber(boardId, itemId, columnId, incrementValue)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetItemsPage).toHaveBeenCalledWith(boardId, columnId);
    });
});

describe('checkAllDatesStatusCondition', () => {
    test('ValidParams_ReturnsTrue', async () => {
        //Arrange
        const boardId: number = 1;
        const numberOfDays: number = 7;
        const dateColumnId: string = 'date';
        const statusColumnId: string = 'status';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };
        const bool: CustomTypeItem = {
            title: 'title',
            value: 'true'
        };
        mockBoard = MockBoard.mockCustomBoard();

        const mockGetItems = jest.spyOn(mondayRepo, "getItemsByBoardId").mockResolvedValue(mockBoard);
        const mockGetNextItemsPage = jest.spyOn(mondayRepo, "getItemsNextPageFromCursorWithColumnValues").mockResolvedValue(mockItemsPage);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.checkAllDatesStatusCondition(boardId, numberOfDays, dateColumnId, statusColumnId, statusColumnValue, statusColumnId, statusColumnValue, bool);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItems).toHaveBeenCalledTimes(1);
        expect(mockGetItems).toHaveBeenCalledWith(boardId);
        expect(mockGetNextItemsPage).not.toHaveBeenCalled();
        expect(mockChangeValue).toHaveBeenCalledTimes(2);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, 2, statusColumnId, String(statusColumnValue.index));
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, 3, statusColumnId, String(statusColumnValue.index));
    });

    test('ValidParamsButConditionNotRespected_ReturnsTrue', async () => {
        //Arrange
        const boardId: number = 1;
        const numberOfDays: number = 7;
        const dateColumnId: string = 'date';
        const statusColumnId: string = 'status';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };
        const bool: CustomTypeItem = {
            title: 'title',
            value: 'false'
        };
        mockBoard = MockBoard.mockCustomBoard();

        const mockGetItems = jest.spyOn(mondayRepo, "getItemsByBoardId").mockResolvedValue(mockBoard);
        const mockGetNextItemsPage = jest.spyOn(mondayRepo, "getItemsNextPageFromCursorWithColumnValues").mockResolvedValue(mockItemsPage);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.checkAllDatesStatusCondition(boardId, numberOfDays, dateColumnId, statusColumnId, statusColumnValue, statusColumnId, statusColumnValue, bool);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItems).toHaveBeenCalledTimes(1);
        expect(mockGetItems).toHaveBeenCalledWith(boardId);
        expect(mockGetNextItemsPage).not.toHaveBeenCalled();
        expect(mockChangeValue).not.toHaveBeenCalled();
    });

    test('ValidParamsWithCursor_ReturnsTrue', async () => {
        //Arrange
        const boardId: number = 1;
        const numberOfDays: number = 7;
        const dateColumnId: string = 'date';
        const statusColumnId: string = 'status';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };
        const bool: CustomTypeItem = {
            title: 'title',
            value: 'true'
        };
        mockBoard = MockBoard.mockCustomBoard('withCursor');

        const mockGetItems = jest.spyOn(mondayRepo, "getItemsByBoardId").mockResolvedValue(mockBoard);
        const mockGetNextItemsPage = jest.spyOn(mondayRepo, "getItemsNextPageFromCursorWithColumnValues").mockResolvedValue(mockItemsPage);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.checkAllDatesStatusCondition(boardId, numberOfDays, dateColumnId, statusColumnId, statusColumnValue, statusColumnId, statusColumnValue, bool);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItems).toHaveBeenCalledTimes(1);
        expect(mockGetItems).toHaveBeenCalledWith(boardId);
        expect(mockGetNextItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetNextItemsPage).toHaveBeenCalledWith(mockBoard.items_page?.cursor);
        expect(mockChangeValue).toHaveBeenCalledTimes(2);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, 2, statusColumnId, String(statusColumnValue.index));
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, 3, statusColumnId, String(statusColumnValue.index));
    });

    test('GetItemsReturnsError_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const numberOfDays: number = 7;
        const dateColumnId: string = 'date';
        const statusColumnId: string = 'status';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };
        const bool: CustomTypeItem = {
            title: 'title',
            value: 'true'
        };

        const mockGetItems = jest.spyOn(mondayRepo, "getItemsByBoardId").mockRejectedValueOnce(new Error('errorMessage'));

        //Act
        await expect(mondayService.checkAllDatesStatusCondition(boardId, numberOfDays, dateColumnId, statusColumnId, statusColumnValue, statusColumnId, statusColumnValue, bool)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItems).toHaveBeenCalledTimes(1);
        expect(mockGetItems).toHaveBeenCalledWith(boardId);
    });

    test('ItemNotFound_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const numberOfDays: number = 7;
        const dateColumnId: string = 'date';
        const statusColumnId: string = 'status';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };
        const bool: CustomTypeItem = {
            title: 'title',
            value: 'true'
        };
        mockBoard.items_page = undefined;

        const mockGetItems = jest.spyOn(mondayRepo, "getItemsByBoardId").mockResolvedValue(mockBoard);

        //Act
        await expect(mondayService.checkAllDatesStatusCondition(boardId, numberOfDays, dateColumnId, statusColumnId, statusColumnValue, statusColumnId, statusColumnValue, bool)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItems).toHaveBeenCalledTimes(1);
        expect(mockGetItems).toHaveBeenCalledWith(boardId);
    });

    test('ItemWithoutId_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const numberOfDays: number = 7;
        const dateColumnId: string = 'date';
        const statusColumnId: string = 'status';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };
        const bool: CustomTypeItem = {
            title: 'title',
            value: 'true'
        };
        if (mockBoard.items_page?.items) {
            mockBoard.items_page.items[0].id = undefined;
        }

        const mockGetItems = jest.spyOn(mondayRepo, "getItemsByBoardId").mockResolvedValue(mockBoard);
        const mockGetNextItemsPage = jest.spyOn(mondayRepo, "getItemsNextPageFromCursorWithColumnValues").mockResolvedValue(mockItemsPage);

        //Act
        await expect(mondayService.checkAllDatesStatusCondition(boardId, numberOfDays, dateColumnId, statusColumnId, statusColumnValue, statusColumnId, statusColumnValue, bool)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItems).toHaveBeenCalledTimes(1);
        expect(mockGetItems).toHaveBeenCalledWith(boardId);
        expect(mockGetNextItemsPage).not.toHaveBeenCalled();
    });
});

describe('checkAllDatesEmptyCondition', () => {
    test('ValidParams_ReturnsTrue', async () => {
        //Arrange
        const boardId: number = 1;
        const numberOfDays: number = 7;
        const dateColumnId: string = 'date';
        const conditionColumnId: string = 'id1';
        const statusColumnId: string = 'id2';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };
        mockBoard = MockBoard.mockCustomBoard();

        const mockGetItems = jest.spyOn(mondayRepo, "getItemsByBoardId").mockResolvedValue(mockBoard);
        const mockGetNextItemsPage = jest.spyOn(mondayRepo, "getItemsNextPageFromCursorWithColumnValues").mockResolvedValue(mockItemsPage);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.checkAllDatesEmptyCondition(boardId, numberOfDays, dateColumnId, conditionColumnId, statusColumnId, statusColumnValue);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItems).toHaveBeenCalledTimes(1);
        expect(mockGetItems).toHaveBeenCalledWith(boardId);
        expect(mockGetNextItemsPage).not.toHaveBeenCalled();
        expect(mockChangeValue).toHaveBeenCalledTimes(1);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, 2, statusColumnId, String(statusColumnValue.index));
    });

    test('ValidParamsWithCursor_ReturnsTrue', async () => {
        //Arrange
        const boardId: number = 1;
        const numberOfDays: number = 7;
        const dateColumnId: string = 'date';
        const conditionColumnId: string = 'id1';
        const statusColumnId: string = 'id2';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };
        mockBoard = MockBoard.mockCustomBoard('withCursor');

        const mockGetItems = jest.spyOn(mondayRepo, "getItemsByBoardId").mockResolvedValue(mockBoard);
        const mockGetNextItemsPage = jest.spyOn(mondayRepo, "getItemsNextPageFromCursorWithColumnValues").mockResolvedValue(mockItemsPage);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.checkAllDatesEmptyCondition(boardId, numberOfDays, dateColumnId, conditionColumnId, statusColumnId, statusColumnValue);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItems).toHaveBeenCalledTimes(1);
        expect(mockGetItems).toHaveBeenCalledWith(boardId);
        expect(mockGetNextItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetNextItemsPage).toHaveBeenCalledWith(mockBoard.items_page?.cursor);
        expect(mockChangeValue).toHaveBeenCalledTimes(1);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, 2, statusColumnId, String(statusColumnValue.index));
    });

    test('GetItemsReturnsError_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const numberOfDays: number = 7;
        const dateColumnId: string = 'date';
        const conditionColumnId: string = 'id1';
        const statusColumnId: string = 'id2';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };

        const mockGetItems = jest.spyOn(mondayRepo, "getItemsByBoardId").mockRejectedValueOnce(new Error('errorMessage'));

        //Act
        await expect(mondayService.checkAllDatesEmptyCondition(boardId, numberOfDays, dateColumnId, conditionColumnId, statusColumnId, statusColumnValue)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItems).toHaveBeenCalledTimes(1);
        expect(mockGetItems).toHaveBeenCalledWith(boardId);
    });

    test('ItemNotFound_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const numberOfDays: number = 7;
        const dateColumnId: string = 'date';
        const conditionColumnId: string = 'id1';
        const statusColumnId: string = 'id2';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };
        mockBoard.items_page = undefined;

        const mockGetItems = jest.spyOn(mondayRepo, "getItemsByBoardId").mockResolvedValue(mockBoard);

        //Act
        await expect(mondayService.checkAllDatesEmptyCondition(boardId, numberOfDays, dateColumnId, conditionColumnId, statusColumnId, statusColumnValue)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItems).toHaveBeenCalledTimes(1);
        expect(mockGetItems).toHaveBeenCalledWith(boardId);
    });
});

describe('checkAllDuplicates', () => {
    test('ValidParams_ReturnsTrue', async () => {
        //Arrange
        const boardId: number = 1;
        const statusColumnId: string = 'id2';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };
        const verifiedColumnId: string = 'id5';
        mockBoard = MockBoard.mockCustomBoard();

        const mockGetItems = jest.spyOn(mondayRepo, "getItemsByBoardId").mockResolvedValue(mockBoard);
        const mockGetNextItemsPage = jest.spyOn(mondayRepo, "getItemsNextPageFromCursorWithColumnValues").mockResolvedValue(mockItemsPage);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.checkAllDuplicates(boardId, statusColumnId, statusColumnValue, verifiedColumnId);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItems).toHaveBeenCalledTimes(1);
        expect(mockGetItems).toHaveBeenCalledWith(boardId);
        expect(mockGetNextItemsPage).not.toHaveBeenCalled();
        expect(mockChangeValue).toHaveBeenCalledTimes(2);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, 1, statusColumnId, String(statusColumnValue.index));
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, 3, statusColumnId, String(statusColumnValue.index));
    });

    test('ValidParamsWithCursor_ReturnsTrue', async () => {
        //Arrange
        const boardId: number = 1;
        const statusColumnId: string = 'id2';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };
        const verifiedColumnId: string = 'id5';
        mockBoard = MockBoard.mockCustomBoard('withCursor');

        const mockGetItems = jest.spyOn(mondayRepo, "getItemsByBoardId").mockResolvedValue(mockBoard);
        const mockGetNextItemsPage = jest.spyOn(mondayRepo, "getItemsNextPageFromCursorWithColumnValues").mockResolvedValue(mockItemsPage);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.checkAllDuplicates(boardId, statusColumnId, statusColumnValue, verifiedColumnId);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItems).toHaveBeenCalledTimes(1);
        expect(mockGetItems).toHaveBeenCalledWith(boardId);
        expect(mockGetNextItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetNextItemsPage).toHaveBeenCalledWith(mockBoard.items_page?.cursor);
        expect(mockChangeValue).toHaveBeenCalledTimes(2);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, 1, statusColumnId, String(statusColumnValue.index));
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, 3, statusColumnId, String(statusColumnValue.index));
    });

    test('GetItemsReturnsError_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const statusColumnId: string = 'id2';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };
        const verifiedColumnId: string = 'id3';

        const mockGetItems = jest.spyOn(mondayRepo, "getItemsByBoardId").mockRejectedValueOnce(new Error('errorMessage'));

        //Act
        await expect(mondayService.checkAllDuplicates(boardId, statusColumnId, statusColumnValue, verifiedColumnId)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItems).toHaveBeenCalledTimes(1);
        expect(mockGetItems).toHaveBeenCalledWith(boardId);
    });

    test('ItemNotFound_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const statusColumnId: string = 'id2';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };
        const verifiedColumnId: string = 'id3';
        mockBoard.items_page = undefined;

        const mockGetItems = jest.spyOn(mondayRepo, "getItemsByBoardId").mockResolvedValue(mockBoard);

        //Act
        await expect(mondayService.checkAllDuplicates(boardId, statusColumnId, statusColumnValue, verifiedColumnId)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItems).toHaveBeenCalledTimes(1);
        expect(mockGetItems).toHaveBeenCalledWith(boardId);
    });
});

describe('checkDateStatusCondition', () => {
    test('ValidParams_ReturnsTrue', async () => {
        //Arrange
        mockItem = MockItem.mockCustomItem();
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const numberOfDays: number = 7;
        const dateColumnId: string = 'date';
        const statusColumnId: string = 'status';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };
        const bool: CustomTypeItem = {
            title: 'title',
            value: 'true'
        };

        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.checkDateStatusCondition(boardId, itemId, numberOfDays, dateColumnId, statusColumnId, statusColumnValue, statusColumnId, statusColumnValue, bool);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(boardId);
        expect(mockChangeValue).toHaveBeenCalledTimes(1);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, itemId, statusColumnId, String(statusColumnValue.index));
    });

    test('ValidParamsButConditionNotRespected_ReturnsTrue', async () => {
        //Arrange
        mockItem = MockItem.mockCustomItem();
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const numberOfDays: number = 7;
        const dateColumnId: string = 'date';
        const statusColumnId: string = 'status';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };
        const bool: CustomTypeItem = {
            title: 'title',
            value: 'false'
        };

        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.checkDateStatusCondition(boardId, itemId, numberOfDays, dateColumnId, statusColumnId, statusColumnValue, statusColumnId, statusColumnValue, bool);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(boardId);
        expect(mockChangeValue).not.toHaveBeenCalled();
    });

    test('ItemWithoutId_ThrowsError', async () => {
        //Arrange
        mockItem = MockItem.mockCustomItem();
        mockItem.id = undefined;
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const numberOfDays: number = 7;
        const dateColumnId: string = 'date';
        const statusColumnId: string = 'status';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };
        const bool: CustomTypeItem = {
            title: 'title',
            value: 'true'
        };

        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);

        //Act
        await expect(mondayService.checkDateStatusCondition(boardId, itemId, numberOfDays, dateColumnId, statusColumnId, statusColumnValue, statusColumnId, statusColumnValue, bool)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
    });

    test('DateColumnNotFound_ThrowsError', async () => {
        //Arrange
        mockItem = MockItem.mockValidItem();
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const numberOfDays: number = 7;
        const dateColumnId: string = 'date';
        const statusColumnId: string = 'status';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };
        const bool: CustomTypeItem = {
            title: 'title',
            value: 'true'
        };

        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);

        //Act
        await expect(mondayService.checkDateStatusCondition(boardId, itemId, numberOfDays, dateColumnId, statusColumnId, statusColumnValue, statusColumnId, statusColumnValue, bool)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
    });
});

describe('checkDateEmptyCondition', () => {
    test('ValidParams_ReturnsTrue', async () => {
        //Arrange
        mockItem = MockItem.mockCustomItem();
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const numberOfDays: number = 7;
        const dateColumnId: string = 'date';
        const conditionColumnId: string = 'id1';
        const statusColumnId: string = 'id2';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };

        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.checkDateEmptyCondition(boardId, itemId, numberOfDays, dateColumnId, conditionColumnId, statusColumnId, statusColumnValue);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(boardId);
        expect(mockChangeValue).toHaveBeenCalledTimes(1);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, itemId, statusColumnId, String(statusColumnValue.index));
    });

    test('ConditionIsMet_ReturnsTrue', async () => {
        //Arrange
        mockItem = MockItem.mockCustomItem();
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const numberOfDays: number = 7;
        const dateColumnId: string = 'date';
        const conditionColumnId: string = 'id2';
        const statusColumnId: string = 'id2';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };

        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.checkDateEmptyCondition(boardId, itemId, numberOfDays, dateColumnId, conditionColumnId, statusColumnId, statusColumnValue);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(boardId);
        expect(mockChangeValue).not.toHaveBeenCalled();
    });

    test('ItemHasNoColumnValues_ThrowsError', async () => {
        //Arrange
        mockItem = MockItem.mockCustomItem();
        mockItem.column_values = undefined;
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const numberOfDays: number = 7;
        const dateColumnId: string = 'date';
        const conditionColumnId: string = 'id1';
        const statusColumnId: string = 'id2';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };

        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        await expect(mondayService.checkDateEmptyCondition(boardId, itemId, numberOfDays, dateColumnId, conditionColumnId, statusColumnId, statusColumnValue)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(boardId);
        expect(mockChangeValue).not.toHaveBeenCalled();
    });
});

describe('checkDuplicates', () => {
    test('ValidParams_ReturnsTrue', async () => {
        //Arrange
        mockItemsPage = MockItemsPage.mockCustomItemsPage();
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const columnId: string = 'id3';
        const columnValue: GeneralColumnValue = {
            value: '6',
        }
        const statusColumnId: string = 'id2';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };

        const mockGetItemsPage = jest.spyOn(mondayRepo, "getItemsPageByColumnValues").mockResolvedValue(mockItemsPage);
        const mockGetNextItemsPage = jest.spyOn(mondayRepo, "getItemsNextPageFromCursor").mockResolvedValue(mockItemsPage);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.checkDuplicates(boardId, itemId, columnId, columnValue, statusColumnId, statusColumnValue);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetItemsPage).toHaveBeenCalledWith(boardId, columnId, [String(columnValue.value)]);
        expect(mockGetNextItemsPage).not.toHaveBeenCalled();
        expect(mockChangeValue).toHaveBeenCalledTimes(1);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, itemId, statusColumnId, String(statusColumnValue.index));
    });

    test('ValidParamsWithCursor_ReturnsTrue', async () => {
        //Arrange
        const mockItemsPageWithCursor: ItemsPage = MockItemsPage.mockCustomItemsPage('withCursor');
        mockItemsPage = MockItemsPage.mockCustomItemsPage();
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const columnId: string = 'id3';
        const columnValue: GeneralColumnValue = {
            value: '6',
        }
        const statusColumnId: string = 'id2';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };

        const mockGetItemsPage = jest.spyOn(mondayRepo, "getItemsPageByColumnValues").mockResolvedValue(mockItemsPageWithCursor);
        const mockGetNextItemsPage = jest.spyOn(mondayRepo, "getItemsNextPageFromCursor").mockResolvedValue(mockItemsPage);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.checkDuplicates(boardId, itemId, columnId, columnValue, statusColumnId, statusColumnValue);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetItemsPage).toHaveBeenCalledWith(boardId, columnId, [String(columnValue.value)]);
        expect(mockGetNextItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetNextItemsPage).toHaveBeenCalledWith(mockItemsPageWithCursor.cursor);
        expect(mockChangeValue).toHaveBeenCalledTimes(1);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, itemId, statusColumnId, String(statusColumnValue.index));
    });
    
    test('GetItemsPageReturnsError_ThrowsError', async () => {
        //Arrange
        mockItemsPage = MockItemsPage.mockCustomItemsPage();
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const columnId: string = 'id3';
        const columnValue: GeneralColumnValue = {
            value: '6',
        }
        const statusColumnId: string = 'id2';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };

        const mockGetItemsPage = jest.spyOn(mondayRepo, "getItemsPageByColumnValues").mockRejectedValueOnce(new Error('errorMessage'));

        //Act
        await expect(mondayService.checkDuplicates(boardId, itemId, columnId, columnValue, statusColumnId, statusColumnValue)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetItemsPage).toHaveBeenCalledWith(boardId, columnId, [String(columnValue.value)]);
    });

    test('ItemsNotFound_ThrowsError', async () => {
        //Arrange
        mockItemsPage = MockItemsPage.mockCustomItemsPage();
        mockItemsPage.items = undefined;
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const columnId: string = 'id3';
        const columnValue: GeneralColumnValue = {
            value: '6',
        }
        const statusColumnId: string = 'id2';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };

        const mockGetItemsPage = jest.spyOn(mondayRepo, "getItemsPageByColumnValues").mockResolvedValue(mockItemsPage);

        //Act
        await expect(mondayService.checkDuplicates(boardId, itemId, columnId, columnValue, statusColumnId, statusColumnValue)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetItemsPage).toHaveBeenCalledWith(boardId, columnId, [String(columnValue.value)]);
    });

    test('NoDuplicatesFound_ReturnTrue', async () => {
        //Arrange
        mockItemsPage = MockItemsPage.mockCustomItemsPage();
        mockItemsPage.items = [];
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const columnId: string = 'id3';
        const columnValue: GeneralColumnValue = {
            value: '6',
        }
        const statusColumnId: string = 'id2';
        const statusColumnValue: StatusColumnValue = {
            index: 1,
            invalid: false
        };

        const mockGetItemsPage = jest.spyOn(mondayRepo, "getItemsPageByColumnValues").mockResolvedValue(mockItemsPage);
        const mockGetNextItemsPage = jest.spyOn(mondayRepo, "getItemsNextPageFromCursor").mockResolvedValue(mockItemsPage);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.checkDuplicates(boardId, itemId, columnId, columnValue, statusColumnId, statusColumnValue);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItemsPage).toHaveBeenCalledTimes(1);
        expect(mockGetItemsPage).toHaveBeenCalledWith(boardId, columnId, [String(columnValue.value)]);
        expect(mockGetNextItemsPage).not.toHaveBeenCalled();
        expect(mockChangeValue).not.toHaveBeenCalled();
    });
});

describe('copyColumnsContent', () => {
    test('ValidParams_ReturnsTrue', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const sourceColumns: string = "{pulse.id}{pulse.id}";
        const targetColumns: string = "{pulse.id}{pulse.id}";
        mockItem = MockItem.mockValidItem();

        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.copyColumnsContent(boardId, itemId, sourceColumns, targetColumns);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
        expect(mockChangeValue).toHaveBeenCalledTimes(2);0
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, itemId, "id", "2");
    });

    test('InvalidNumberOfColumns_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const sourceColumns: string = "{pulse.id}{pulse.id}";
        const targetColumns: string = "{pulse.id}";

        //Assert
        await expect(mondayService.copyColumnsContent(boardId, itemId, sourceColumns, targetColumns))
            .rejects
            .toThrow(CustomError);
    });

    test('GetItemReturnsError_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const sourceColumns: string = "{pulse.id}{pulse.id}";
        const targetColumns: string = "{pulse.id}{pulse.id}";

        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockRejectedValueOnce(new Error('errorMessage'));

        //Act
        await expect(mondayService.copyColumnsContent(boardId, itemId, sourceColumns, targetColumns)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
    });
});

describe('updateItemName', () => {
    test('ValidParams_ReturnsTrue', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const value: string = "{user.name}-{board.name}-{pulse.group}-{pulse.name}-{pulse.id}-{pulse.id}";
        const userId: number = 1;
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);
        const mockGetUser = jest.spyOn(mondayRepo, "getUserInformations").mockResolvedValue(mockUser);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.updateItemName(boardId, itemId, value, userId);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(mockItem.id);
        expect(mockGetUser).toHaveBeenCalledTimes(1);
        expect(mockGetUser).toHaveBeenCalledWith(userId);
        expect(mockChangeValue).toHaveBeenCalledTimes(1);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, itemId, "name", expect.any(String));
    });

    test('UnknownColumnId_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const value: string = "{user.name}-{board.name}-{pulse.group}-{pulse.name}-{pulse.UNKNOWN}-{pulse.id}";
        const userId: number = 1;
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);
        const mockGetUser = jest.spyOn(mondayRepo, "getUserInformations").mockResolvedValue(mockUser);

        //Act
        await expect(mondayService.updateItemName(boardId, itemId, value, userId)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(mockItem.id);
        expect(mockGetUser).toHaveBeenCalledTimes(1);
        expect(mockGetUser).toHaveBeenCalledWith(userId);
    });

    test('GetItemReturnsError_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const value: string = "{user.name}-{board.name}-{pulse.group}-{pulse.name}-{pulse.id}-{pulse.id}";
        const userId: number = 1;
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockRejectedValueOnce(new Error('errorMessage'));

        //Act
        await expect(mondayService.updateItemName(boardId, itemId, value, userId)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
    });

    test('GetUserReturnsError_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = mockItem.id || 1;
        const value: string = "{user.name}-{board.name}-{pulse.group}-{pulse.name}-{pulse.id}-{pulse.id}";
        const userId: number = 1;
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);
        const mockGetUser = jest.spyOn(mondayRepo, "getUserInformations").mockRejectedValueOnce(new Error('errorMessage'));

        //Act
        await expect(mondayService.updateItemName(boardId, itemId, value, userId)).rejects.toThrow(CustomError);

        //Assert
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
        expect(mockGetUser).toHaveBeenCalledTimes(1);
        expect(mockGetUser).toHaveBeenCalledWith(userId);
    });
});