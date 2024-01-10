import { Response } from 'express';
import customLogger from '../middlewares/logger';
import { CustomError } from '../models/Error';
import MondayErrorGenerator from '../utilities/mondayErrorGenerator';

class ErrorHandler {
    public handleThrownObject(value: any, location: string): CustomError {
        if (value instanceof CustomError) {
            return value;
        } 
        else if (value instanceof Error) {
            return new CustomError({ httpCode: 400, mondayNotification: MondayErrorGenerator.severityCode4000(value.name, value.message, value.message) });
        }
        else {
            let stringified: string = '[Unable to stringify the thrown value]';
            try {
                stringified = JSON.stringify(value);
            } catch {}
            customLogger.logError(`This value was thrown as is, not through an Error: ${stringified}`);
            return new CustomError({ httpCode: 500, mondayNotification: MondayErrorGenerator.generic500() });
        }
    }

    public handleError(error: Error | CustomError, response?: Response): void {
        if (error instanceof CustomError && response) {
            this.handleTrustedError(error as CustomError, response);
        } else {
            this.handleUntrustedError(error, response);
        }
    }

    private handleTrustedError(error: CustomError, response: Response): void {
        customLogger.logError(`CustomError with http code ${error.httpCode} has occurred.\n Monday notification : ${JSON.stringify(error.mondayNotification)}. \n Stack trace : ${error.stack}`);
        response.status(error.httpCode).send(error.mondayNotification);
    }

    private handleUntrustedError(error: Error | CustomError, response?: Response): void {
        customLogger.logError(`Error with name ${error.name} has occurred.\n Message : ${error.message}. \n Stack trace : ${error.stack}`);
        if (response) {
          response.status(500).send({ message: error.message });
        }
    }
}

export default new ErrorHandler;
