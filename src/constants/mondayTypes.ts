//CUSTOM ACTION/TRIGGERS
export type CustomTypeItem = {
    title: string;
    value: string;
    invalid?: boolean;
};

export enum PrefixOrSuffixEnum {
    PREFIX = 'PREFIX',
    SUFFIX = 'SUFFIX'
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
    BOARD_RELATION = "board_relation",
    BUTTON = "button",
    COLOR = "color",
    DATE = "date",
    EMAIL = "email",
    LOOKUP = "lookup",
    MIRROR = "mirror",
    MULTIPLE_PERSON = "multiple-person",
    NAME = "name",
    NUMBERS = "numeric",
    STATUS = "status",
    SUBTASKS = "subtasks",
    TEXT = "text",
    TIMERANGE = "timerange",
}

export type StatusColumnValue = {
    index: number;
    invalid: boolean;
};