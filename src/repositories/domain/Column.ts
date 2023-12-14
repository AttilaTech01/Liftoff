import { MondayColumnType } from '../../constants/mondayTypes';

export interface Column {
    id?: string;
    text?: string;
    title?: string;
    type?: MondayColumnType;
    settings_str?: SettingsStr;
}

export interface SettingsStr {
    allowMultipleItems?: boolean;
    itemTypeName?: string;
    displayType?: string;
    boardIds?: number[];
}