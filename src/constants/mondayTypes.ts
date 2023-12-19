//CUSTOM ACTION/TRIGGERS
export type CustomTypeListItem = {
    title: string;
    value: string;
};

//ERROR HANDLING
export type SeverityCode = 4000 | 6000;

export type HttpStatusCode = 200 | 400 |401 | 402 | 403 | 404 | 410 | 422 | 500;

export type MondayError = {
    severityCode: SeverityCode;
    notificationErrorTitle: string;
    notificationErrorDescription: string;
    runtimeErrorDescription: string;
};

//GENERAL INFORMATIONS
export type GeneralColumnValue = {
    value: any;
    unit?: any;
};

export enum MondayColumnType {
    BUTTON = "button",
    COLOR = "color",
    DATE = "date",
    LOOKUP = "lookup",
    MULTIPLE_PERSON = "multiple-person",
    NAME = "name",
    NUMBERS = "numeric",
    SUBTASKS = "subtasks",
    TEXT = "text",
    TIMERANGE = "timerange",
}

export type StatusColumnValue = {
    index: number;
    invalid: boolean;
};