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
    board: ItemBoard;
    group: Group;
    column_values: ItemColumn[];
}

export interface ItemBoard {
    name: string;
}

export interface Group {
    title: string;
}

export interface ItemColumn {
    id: string;
    text: string;
    type: MondayColumnType;
} 