import { ItemsPage, ItemsPageConverter } from './ItemsPage';

export interface ItemsPageByColumnValuesResponse {
    data: {
        items_page_by_column_values:  ItemsPage,
    };
    account_id: number;
}

export class ItemsPageByColumnValuesResponseConverter {
    public static convertToItemsPage(response: ItemsPageByColumnValuesResponse): ItemsPage {
        return ItemsPageConverter.convertToItemsPage(response.data.items_page_by_column_values);
    }
}