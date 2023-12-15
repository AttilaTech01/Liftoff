import { Board, BoardConverter } from './Board';

export interface BoardInformationResponse {
    data: {
        boards:  Board[],
    };
    account_id: number;
}

export class BoardInformationResponseConverter {
    public static convertToBoardArray(response: BoardInformationResponse): Board[] {
        return response.data.boards.map(board => BoardConverter.convertToBoard(board));
    }
}