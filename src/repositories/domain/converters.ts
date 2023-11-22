import { ItemInformationResponse, Item, Board, Group, Column } from './ItemInformationResponse';
import { UserInformationResponse, User } from './UserInformationResponse';

export class Converters {
    public static convertToItemArray(response: ItemInformationResponse): Item[] {
        return response.data.items.map(item => Converters.convertToItem(item));
    }

    private static convertToItem(data: any): Item {
        return {
            id: data["id"],
            name: data["name"],
            board: Converters.convertToBoard(data["board"]),
            group: Converters.convertToGroup(data["group"]),
            column_values: data["column_values"].map(column => Converters.convertToColumn(column))
        };
    }

    private static convertToBoard(data: any): Board {
        return {
            name: data["name"]
        };
    }

    private static convertToGroup(data: any): Group {
        return {
            title: data["title"],
        };
    }

    private static convertToColumn(data: any): Column {
        return {
            id: data["id"],
            text: data["text"],
            type: data["type"]
        };
    }

    public static convertToUserArray(response: UserInformationResponse): User[] {
        return response.data.users.map(user => Converters.convertToUser(user));
    }

    private static convertToUser(data: any): User {
        return {
            name: data["name"]
        };
    }
}