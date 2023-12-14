export interface SubitemInformationResponse {
    data: {
        items:  SubitemItem[],
    };
    account_id: number;
}

export interface SubitemItem {
    subitems: Subitem[];
}

export interface Subitem {
    id: string;
    name: string;
    column_values: SubitemColumn[];
}

export interface SubitemColumn {
    id: string;
    title: string;
    text: string;
}