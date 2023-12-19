import { User, UserConverter } from './User';

export interface UserInformationResponse {
    data: {
        users:  User[],
    };
    account_id: number;
}

export class UserInformationResponseConverter {
    public static convertToUserArray(response: UserInformationResponse): User[] {
        return response.data.users.map(user => UserConverter.convertToUser(user));
    }
}