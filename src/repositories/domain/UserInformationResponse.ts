import { User } from './User';

export interface UserInformationResponse {
    data: {
        users:  User[],
    };
    account_id: number;
}