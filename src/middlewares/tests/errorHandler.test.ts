import errorHandler from '../errorHandler';
import { CustomError } from '../../models/Error';
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
const mockResponse: any = {};

// TESTS
test('handleThrownObject_CustomError_ReturnsItself', () => {
    //Assert
    expect(errorHandler.handleThrownObject(mockCustomError, mockLocation)).toStrictEqual(mockCustomError);
});

test('handleThrownObject_Error_ReturnsCustomError', () => {
    //Assert
    expect(errorHandler.handleThrownObject(mockError, mockLocation)).toStrictEqual(mockCustomError);
});

test('handleThrownObject_OtherTypes_ReturnsGenericCustomError', () => {
    //Assert
    expect(errorHandler.handleThrownObject(2, mockLocation)).toStrictEqual(mockGeneric500);
    expect(errorHandler.handleThrownObject('2', mockLocation)).toStrictEqual(mockGeneric500);
});

test('handleError_CustomErrorWithResponse_LogsMessage', () => {
    //Arrange
    const logSpy = jest.spyOn(console, 'log');
    mockResponse.status = jest.fn().mockReturnValue(mockResponse);
    mockResponse.send = jest.fn().mockReturnValue(mockResponse);

    //Act
    errorHandler.handleError(mockCustomError, mockResponse);

    //Assert
    expect(logSpy).toHaveBeenCalledWith('Application encountered an trusted error.');
});

test('handleError_Otherwise_LogsMessage', () => {
    //Arrange
    const logSpy = jest.spyOn(console, 'log');
    mockResponse.status = jest.fn().mockReturnValue(mockResponse);
    mockResponse.send = jest.fn().mockReturnValue(mockResponse);

    //Act
    errorHandler.handleError(mockError, mockResponse);

    //Assert
    expect(logSpy).toHaveBeenCalledWith('Application encountered an untrusted error.');
});



