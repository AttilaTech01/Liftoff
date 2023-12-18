import { Board, BoardConverter } from './Board';
import { Column, ColumnConverter } from './Column';
import { Group, GroupConverter } from './Group';
import { Subitem } from './Subitem';

export interface Item {
    board?: Board;
    column_values?: Column[];
    group?: Group;
    id?: string;
    name?: string;
    subitems?: Subitem[];
    text?: string;
}

export class ItemConverter {
    public static convertToItem(data: Item): Item {
        return {
            id: data.id,
            name: data.name,
            text: data.text,
            board: data.board ? BoardConverter.convertToBoard(data.board) : undefined,
            group: data.group ? GroupConverter.convertToGroup(data.group) : undefined,
            column_values: data?.column_values?.map(column => ColumnConverter.convertToColumn(column))
        };
    }
}