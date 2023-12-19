import { Item, ItemConverter } from './Item';

export interface ItemInformationResponse {
    data: {
        items:  Item[],
    };
    account_id: number;
}

export class ItemInformationResponseConverter {
    public static convertToItemArray(response: ItemInformationResponse): Item[] {
        return response.data.items.map(item => ItemConverter.convertToItem(item));
    }
}