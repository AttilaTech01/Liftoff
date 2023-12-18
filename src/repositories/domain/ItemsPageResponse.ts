import { ItemsPage, ItemsPageConverter } from './ItemsPage';

export interface ItemsPageResponse {
    data: {
        next_items_page:  ItemsPage,
    };
    account_id: number;
}

export class ItemsPageResponseConverter {
    public static convertToItemsPage(response: ItemsPageResponse): ItemsPage {
        return ItemsPageConverter.convertToItemsPage(response.data.next_items_page);
    }
}