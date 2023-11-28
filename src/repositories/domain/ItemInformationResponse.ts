import { MondayColumnType } from '../../constants/mondayTypes';

export interface ItemInformationResponse {
    data: {
        items:  Item[],
    };
    account_id: number;
}

export interface Item {
    id: string;
    name: string;
    board: Board;
    group: Group;
    column_values: Column[];
}

export interface Board {
    name: string;
}

export interface Group {
    title: string;
}

export interface Column {
    id: string;
    text: string;
    type: MondayColumnType;
} 