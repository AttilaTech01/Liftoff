export interface UserInformationResponse {
    data: {
        users:  User[],
    };
    account_id: number;
}

export interface User {
    name: string;
}