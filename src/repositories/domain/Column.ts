import { MondayColumnType } from '../../constants/mondayTypes';

export interface Column {
    id?: string;
    text?: string;
    title?: string;
    type?: MondayColumnType;
    settings_str?: SettingsStr;
}

export class ColumnConverter {
    public static convertToColumn(data: Column): Column {
        return {
            id: data.id,
            text: data.text,
            type: data.type
        };
    }
}

export interface SettingsStr {
    allowMultipleItems?: boolean;
    itemTypeName?: string;
    displayType?: string;
    boardIds?: number[];
}