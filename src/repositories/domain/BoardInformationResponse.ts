import { Board } from './Board';

export interface BoardInformationResponse {
    data: {
        boards:  Board[],
    };
    account_id: number;
}