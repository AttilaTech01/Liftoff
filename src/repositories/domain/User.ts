export interface User {
    name: string;
}

export class UserConverter {
    public static convertToUser(data: User): User {
        return {
            name: data.name
        };
    }
}