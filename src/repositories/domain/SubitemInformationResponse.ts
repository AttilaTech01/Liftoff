import { Subitem } from './Subitem';

export interface SubitemInformationResponse {
    data: {
        items:  Subitem[],
    };
    account_id: number;
}