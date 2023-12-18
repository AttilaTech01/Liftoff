export interface Group {
    title?: string;
}

export class GroupConverter {
    public static convertToGroup(data: Group): Group {
        return {
            title: data.title,
        };
    }
}