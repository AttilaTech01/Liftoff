import { MondayError } from '../constants/mondayTypes';

class MondayErrorGenerator {
    generic500 = (): MondayError => {
        return ({
            "severityCode" : 4000,
            "notificationErrorTitle" : "Internal server error 1",
            "notificationErrorDescription" : "Something went wrong, please try again later",
            "runtimeErrorDescription" : "Something went wrong, please try again later"
        });
        
    };

    severityCode4000 = (title: string, notifDescription: string, runtimeDescription: string): MondayError => {
        return ({
            "severityCode" : 4000,
            "notificationErrorTitle" : title,
            "notificationErrorDescription" : notifDescription,
            "runtimeErrorDescription" : runtimeDescription
        });
    };

    severityCode6000 = (title: string, notifDescription: string, runtimeDescription: string): MondayError => {
        return ({
            "severityCode" : 6000,
            "notificationErrorTitle" : title,
            "notificationErrorDescription" : notifDescription,
            "runtimeErrorDescription" : runtimeDescription
        });
    };
}

export default new MondayErrorGenerator; 