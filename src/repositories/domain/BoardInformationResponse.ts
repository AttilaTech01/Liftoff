import { MondayColumnType } from '../../constants/mondayTypes';

export interface BoardInformationResponse {
    data: {
        boards:  Board[],
    };
    account_id: number;
}

export interface Board {
    columns: Column[];
}

export interface Column {
    id: string;
    title: string;
    type: MondayColumnType;
    settings_str: SettingsStr;
}

export interface SettingsStr {
    allowMultipleItems?: boolean;
    itemTypeName?: string;
    displayType?: string;
    boardIds?: number[];
}