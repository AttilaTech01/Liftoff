export interface Group {
    title?: string;
}

export class GroupConverter {
    public static convertToGroup(data: any): Group {
        return {
            title: data["title"],
        };
    }
}