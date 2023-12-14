import { Item } from './Item';

export interface ItemInformationResponse {
    data: {
        items:  Item[],
    };
    account_id: number;
}