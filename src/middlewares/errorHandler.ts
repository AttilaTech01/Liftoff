import { Response } from 'express';
import { CustomError } from '../models/Error';
import MondayErrorGenerator from '../utilities/mondayErrorGenerator';

class ErrorHandler {
    public handleThrownObject(value: any, location: string): CustomError {
        if (value instanceof CustomError) {
            return value;
        } 
        else if (value instanceof Error) {
            //LOGGER
            console.log(`Error with name ${value.name} has occurred in ${location}. Message : ${value.message}`);
            return new CustomError({ httpCode: 500, mondayNotification: MondayErrorGenerator.severityCode4000(value.name, value.message, value.message) });
        }
        else {
            let stringified: string = '[Unable to stringify the thrown value]'
            try {
                stringified = JSON.stringify(value)
            } catch {}
            //LOGGER
            console.log(`This value was thrown as is, not through an Error: ${stringified}`);
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
        response.status(error.httpCode).send(error.mondayNotification);
    }

    private handleUntrustedError(error: Error | CustomError, response?: Response): void {
        if (response) {
          response.status(500).json({ message: error.message });
        }
        //LOGGER
        console.log('Application encountered an untrusted error.');
    }
}

export default new ErrorHandler;
