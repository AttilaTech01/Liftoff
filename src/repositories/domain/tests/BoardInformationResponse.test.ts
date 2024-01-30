import { Board } from '../Board';
import { BoardInformationResponse, BoardInformationResponseConverter } from '../BoardInformationResponse';
import MockBoardInformationResponse from '../__mocks__/BoardInformationResponse';

const mockBoardInfoResponse: BoardInformationResponse = MockBoardInformationResponse.mockValidBoardInformationResponse(); 

describe('convertToItemArray', () => {
    test('ReceivesItemInformationResponse_ReturnsItemArray', async () => {
        //Arrange
        const boardArray: Board[] = mockBoardInfoResponse.data.boards;

        //Act
        const result: Board[] = BoardInformationResponseConverter.convertToBoardArray(mockBoardInfoResponse);

        //Assert
        expect(result).toStrictEqual(boardArray);
    });
});