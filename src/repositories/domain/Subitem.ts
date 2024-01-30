import { Column, ColumnConverter } from './Column';

export interface Subitem {
    column_values?: Column[];
    id?: string;
    name?: string;
}

export class SubitemConverter {
    public static convertToSubitem(data: Subitem): Subitem {
        return {
            column_values: data?.column_values?.map(column => ColumnConverter.convertToColumn(column)),
            id: data.id,
            name: data.name
        };
    }
}