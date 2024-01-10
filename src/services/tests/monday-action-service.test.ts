import mathService from '../excel-formula-service';
import mondayService from '../monday-action-service';
import { MondayColumnType } from '../../constants/mondayTypes';
import { CustomError } from '../../models/CustomError';
import mondayRepo from '../../repositories/monday-repository';
import { Item } from '../../repositories/domain/Item';
import { User } from '../../repositories/domain/User';

const mockItem: Item = {
    id: 123, 
    name: 'name', 
    board: { 
        name: 'name' 
    }, 
    group: { 
        title: 'title'
    }, 
    column_values: [
        {
            id: 'column1',
            text: '1',
            type: MondayColumnType.NUMBERS
        },
        {
            id: 'column2',
            text: 'text2',
            type: MondayColumnType.TEXT
        },
        {
            id: 'column3',
            text: '3',
            type: MondayColumnType.NUMBERS
        },
        {
            id: 'column4',
            text: 'text4',
            type: MondayColumnType.TEXT
        },
        {
            id: 'column5',
            text: '0',
            type: MondayColumnType.NUMBERS
        },
    ] 
}

const mockUser: User = {
    name: 'userName', 
}

afterEach(() => {
    jest.restoreAllMocks();
});

describe('applyFormula', () => {
    test('ValidParams_ReturnsTrue', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const formula: string = "SUM({pulse.column1},{pulse.column3})";
        const columnId: string = '1';
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);
        const mockSUM = jest.spyOn(mathService, "Generic").mockImplementation(() => 4);

        //Act
        const result: boolean = await mondayService.applyFormula(boardId, itemId, formula, columnId);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
        expect(mockChangeValue).toHaveBeenCalledTimes(1);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, itemId, columnId, '4');
    });

    test('FormulaIsUnknown_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const formula: string = "SIM({pulse.column1},{pulse.column3})";
        const columnId: string = '1';
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);

        //Assert
        await expect(mondayService.applyFormula(boardId, itemId, formula, columnId)).rejects.toThrow(CustomError);
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
    });

    test('DivisionAndCouldntFindTwoValues_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const formula: string = "DIVIDE({pulse.column1},{pulse.column123})";
        const columnId: string = '1';
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);

        //Assert
        await expect(mondayService.applyFormula(boardId, itemId, formula, columnId)).rejects.toThrow(CustomError);
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
    });

    test('RepoReturnsError_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const formula: string = "SUM({pulse.column1},{pulse.column3})";
        const columnId: string = '1';
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockRejectedValueOnce(new Error('errorMessage'));

        //Assert
        await expect(mondayService.applyFormula(boardId, itemId, formula, columnId)).rejects.toThrow(CustomError);
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
    });
});

describe('copyColumnsContent', () => {
    test('ValidParams_ReturnsTrue', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const sourceColumns: string = "{pulse.column1}{pulse.column2}";
        const targetColumns: string = "{pulse.column3}{pulse.column4}";
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.copyColumnsContent(boardId, itemId, sourceColumns, targetColumns);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
        expect(mockChangeValue).toHaveBeenCalledTimes(2);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, itemId, expect.any(String), expect.any(String));
    });

    test('InvalidNumberOfColumns_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const sourceColumns: string = "{pulse.column1}{pulse.column2}";
        const targetColumns: string = "{pulse.column3}";

        //Assert
        await expect(mondayService.copyColumnsContent(boardId, itemId, sourceColumns, targetColumns))
            .rejects
            .toThrow(CustomError);
    });

    /*
    test('MismatchColumnIds_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const sourceColumns: string = "{pulse.column1}{pulse.column99}";
        const targetColumns: string = "{pulse.column3}{pulse.column4}";
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Assert
        await expect(mondayService.copyColumnsContent(boardId, itemId, sourceColumns, targetColumns)).rejects.toThrow(CustomError);
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
        expect(mockChangeValue).toHaveBeenCalledTimes(1);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, itemId, "column3", "1");
    });
    */

    test('RepoReturnsError_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const sourceColumns: string = "{pulse.column1}{pulse.column2}";
        const targetColumns: string = "{pulse.column3}{pulse.column4}";
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockRejectedValueOnce(new Error('errorMessage'));

        //Assert
        await expect(mondayService.copyColumnsContent(boardId, itemId, sourceColumns, targetColumns)).rejects.toThrow(CustomError);
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
    });
});

describe('updateItemName', () => {
    test('ValidParams_ReturnsTrue', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const value: string = "{user.name}-{board.name}-{pulse.group}-{pulse.name}-{pulse.column2}-{pulse.column3}";
        const userId: number = 1;
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockResolvedValue(mockItem);
        const mockGetUser = jest.spyOn(mondayRepo, "getUserInformations").mockResolvedValue(mockUser);
        const mockChangeValue = jest.spyOn(mondayRepo, "changeSimpleColumnValue").mockResolvedValue(true);

        //Act
        const result: boolean = await mondayService.updateItemName(boardId, itemId, value, userId);

        //Assert
        expect(result).toBe(true);
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
        expect(mockGetUser).toHaveBeenCalledTimes(1);
        expect(mockGetUser).toHaveBeenCalledWith(userId);
        expect(mockChangeValue).toHaveBeenCalledTimes(1);
        expect(mockChangeValue).toHaveBeenCalledWith(boardId, itemId, "name", expect.any(String));
    });

    test('RepoReturnsError_ThrowsError', async () => {
        //Arrange
        const boardId: number = 1;
        const itemId: number = 1;
        const value: string = "{user.name}-{board.name}-{pulse.group}-{pulse.name}-{pulse.column2}-{pulse.column3}";
        const userId: number = 1;
        const mockGetItem = jest.spyOn(mondayRepo, "getItemInformations").mockRejectedValueOnce(new Error('errorMessage'));

        //Assert
        await expect(mondayService.updateItemName(boardId, itemId, value, userId)).rejects.toThrow(CustomError);
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(itemId);
    });
});