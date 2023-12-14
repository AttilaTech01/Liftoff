//import { BoardInformationResponse, Board, Column, SettingsStr } from './BoardInformationResponse';
import { ItemInformationResponse, Item, ItemBoard, Group, ItemColumn } from './ItemInformationResponse';
//import { SubitemInformationResponse, SubitemItem, Subitem, SubitemColumn } from './SubitemInformationResponse';
import { UserInformationResponse, User } from './UserInformationResponse';

export class Converters {
    /*
    // Board
    public static convertToBoardArray(response: BoardInformationResponse): Board[] {
        return response.data.boards.map(board => Converters.convertToBoard(board));
    }

    private static convertToBoard(data: any): Board {
        return {
            columns: data["columns"].map(column => Converters.convertToColumn(column))
        };
    }

    private static convertToColumn(data: any): Column {
        return {
            id: data["id"],
            title: data["title"],
            type: data["type"],
            settings_str: Converters.convertToSettingsStr(JSON.parse(data["settings_str"])),
        };
    }

    private static convertToSettingsStr(data: any): SettingsStr {
        return {
            allowMultipleItems: data["allowMultipleItems"],
            itemTypeName: data["itemTypeName"],
            displayType: data["displayType"],
            boardIds: data["boardIds"]
        };
    }
    */
    // Item
    public static convertToItemArray(response: ItemInformationResponse): Item[] {
        return response.data.items.map(item => Converters.convertToItem(item));
    }

    private static convertToItem(data: any): Item {
        return {
            id: data["id"],
            name: data["name"],
            board: Converters.convertToItemBoard(data["board"]),
            group: Converters.convertToGroup(data["group"]),
            column_values: data["column_values"].map(column => Converters.convertToItemColumn(column))
        };
    }

    private static convertToItemBoard(data: any): ItemBoard {
        return {
            name: data["name"]
        };
    }

    private static convertToGroup(data: any): Group {
        return {
            title: data["title"],
        };
    }

    private static convertToItemColumn(data: any): ItemColumn {
        return {
            id: data["id"],
            text: data["text"],
            type: data["type"]
        };
    }

    /*
    // Subitem
    public static convertToSubitemArray(response: SubitemInformationResponse): Subitem[] {
        return response.data.items[0].subitems.map(subitem => Converters.convertToSubitem(subitem));
    }

    private static convertToSubitem(data: any): Subitem {
        return {
            id: data["id"],
            name: data["name"],
            column_values: data["column_values"].map(column => Converters.convertToSubitemColumn(column))
        };
    }

    private static convertToSubitemColumn(data: any): SubitemColumn {
        return {
            id : data["id"],
            title : data["title"],
            text : data["text"],
        };
    }
    */

    // User
    public static convertToUserArray(response: UserInformationResponse): User[] {
        return response.data.users.map(user => Converters.convertToUser(user));
    }

    private static convertToUser(data: any): User {
        return {
            name: data["name"]
        };
    }
}