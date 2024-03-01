import errorHandler from '../errorHandler';
import { CustomError } from '../../models/CustomError';
import { MondayError } from '../../constants/mondayTypes';

// VARIABLES SETUP
const mockErrorMessage: string = "mockErrorMessage"
const mockLocation: string = "middlewares/tests/errorHandler.test.ts"
const mockMondayError: MondayError = {
    "severityCode" : 4000,
    "notificationErrorTitle" : "Internal server error 1",
    "notificationErrorDescription" : mockErrorMessage,
    "runtimeErrorDescription" : mockErrorMessage
};
const mockGeneric500: CustomError = new CustomError({ 
    httpCode: 500, 
    mondayNotification: {
        "severityCode" : 4000,
        "notificationErrorTitle" : "Internal server error 1",
        "notificationErrorDescription" : "Something went wrong, please try again later",
        "runtimeErrorDescription" : "Something went wrong, please try again later"
    } 
});
const mockCustomError: CustomError = new CustomError({ 
    httpCode: 500, 
    mondayNotification: mockMondayError 
});
const mockError: Error = new Error(mockErrorMessage);

afterEach(() => {
    jest.restoreAllMocks();
});

// TESTS
test('handleThrownObject_CustomError_ReturnsItself', () => {
    //Assert
    expect(errorHandler.handleThrownObject(mockCustomError, mockLocation)).toStrictEqual(mockCustomError);
});

test('handleThrownObject_Error_ReturnsCustomError', () => {
    //Assert
    expect(errorHandler.handleThrownObject(mockError, mockLocation)).toStrictEqual(mockCustomError);
});



