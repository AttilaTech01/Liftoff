import { Board } from './Board';
import { Column } from './Column';
import { Group } from './Group';
import { Item } from './Item';
import { ItemInformationResponse } from './ItemInformationResponse';
import { User } from './User';
import { UserInformationResponse } from './UserInformationResponse';

// IN TRANSITION - TO BE REPLACED - looking for best solution
export class Converters {
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

    private static convertToItemBoard(data: any): Board {
        return {
            name: data["name"]
        };
    }

    private static convertToGroup(data: any): Group {
        return {
            title: data["title"],
        };
    }

    private static convertToItemColumn(data: any): Column {
        return {
            id: data["id"],
            text: data["text"],
            type: data["type"]
        };
    }

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