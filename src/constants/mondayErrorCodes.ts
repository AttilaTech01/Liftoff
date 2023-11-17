class ErrorCodes {
    generic500 = (): MondayError => {
        return ({
            "severityCode" : 4000,
            "notificationErrorTitle" : "Internal server error",
            "notificationErrorDescription" : "Something went wrong, please try again later",
            "runtimeErrorDescription" : "Internal server error"
        });
    };

    severityCode4000 = (description: string): MondayError => {
        return ({
            "severityCode" : 4000,
            "notificationErrorTitle" : "Failed automation",
            "notificationErrorDescription" : description,
            "runtimeErrorDescription" : description
        });
    };

    severityCode6000 = (notifTitle: string, description: string): MondayError => {
        return ({
            "severityCode" : 6000,
            "notificationErrorTitle" : notifTitle,
            "notificationErrorDescription" : description,
            "runtimeErrorDescription" : description
        });
    };
}

export default new ErrorCodes;

export type MondayError = {
    severityCode: number;
    notificationErrorTitle: string;
    notificationErrorDescription: string;
    runtimeErrorDescription: string;
};