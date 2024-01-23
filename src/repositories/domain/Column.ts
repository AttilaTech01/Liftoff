import { MondayColumnType } from '../../constants/mondayTypes';

export interface Column {
    display_value?: string;
    id?: string;
    text?: string;
    title?: string;
    type?: MondayColumnType;
    settings_str?: SettingsStr;
}

export class ColumnConverter {
    public static convertToColumn(data: Column): Column {
        return {
            display_value: data.display_value,
            id: data.id,
            text: data.type === MondayColumnType.MIRROR || data.type === MondayColumnType.BOARD_RELATION ? data.display_value : data.text,
            title: data.title,
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