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
}

export class ItemConverter {
    public static convertToItem(data: any): Item {
        return {
            id: data["id"],
            name: data["name"],
            board: BoardConverter.convertToBoard(data["board"]),
            group: GroupConverter.convertToGroup(data["group"]),
            column_values: data["column_values"].map(column => ColumnConverter.convertToColumn(column))
        };
    }
}