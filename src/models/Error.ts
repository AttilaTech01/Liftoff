import { HttpStatusCode, MondayError } from '../constants/mondayTypes';

export class CustomError extends Error {
    httpCode: HttpStatusCode;
    mondayNotification: MondayError;

    constructor({
        httpCode,
        mondayNotification,
    }: {
        httpCode: HttpStatusCode;
        mondayNotification: MondayError;
    }) {
        super();
        this.httpCode = httpCode;
        this.mondayNotification = mondayNotification;
    }
}