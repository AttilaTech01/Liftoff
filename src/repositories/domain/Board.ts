import { ItemsPage, ItemsPageConverter } from './ItemsPage';

export interface Board {
    items_page?: ItemsPage;
    name?: string;
}

export class BoardConverter {
    public static convertToBoard(data: any): Board {
        return {
            name: data["name"],
            items_page: ItemsPageConverter.convertToItemsPage(data["items_page"]),
        };
    }
}