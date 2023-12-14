import { Board } from './Board';
import { Column } from './Column';
import { Group } from './Group';
import { Subitem } from './Subitem';

export interface Item {
    board?: Board;
    column_values?: Column[];
    group?: Group;
    id?: string;
    name?: string;
    subitems?: Subitem[];
}