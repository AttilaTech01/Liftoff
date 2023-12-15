import { Item, ItemConverter } from './Item';

export interface ItemsPage {
    cursor?: string;
    items?: Item[];
}

export class ItemsPageConverter {
    public static convertToItemsPage(data: any): ItemsPage {
        return {
            cursor: data["cursor"],
            items: data["items"].map(item => ItemConverter.convertToItem(item))
        };
    }
}