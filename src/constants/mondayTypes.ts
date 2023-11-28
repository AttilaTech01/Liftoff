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
export enum MondayColumnType {
    BUTTON = "button",
    COLOR = "color",
    LOOKUP = "lookup",
    NUMBERS = "numeric",
    TEXT = "text",
    TIMERANGE = "timerange",
}