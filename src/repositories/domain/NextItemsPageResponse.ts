import { ItemsPage, ItemsPageConverter } from './ItemsPage';

export interface NextItemsPageResponse {
    data: {
        next_items_page:  ItemsPage,
    };
    account_id: number;
}

export class NextItemsPageResponseConverter {
    public static convertToItemsPage(response: NextItemsPageResponse): ItemsPage {
        return ItemsPageConverter.convertToItemsPage(response.data.next_items_page);
    }
}