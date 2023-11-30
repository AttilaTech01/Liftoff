import mondayErrorGenerator from '../mondayErrorGenerator';

// VARIABLES SETUP
const notificationErrorTitle: string = "notificationErrorTitleExemple";
const notificationErrorDescription: string = "notificationErrorDescriptionExemple";
const runtimeErrorDescription: string = "runtimeErrorDescriptionExemple";

// TESTS
test('generic500_Get_ReturnsMatchingMondayError', () => {
    //Assert
    expect(mondayErrorGenerator.generic500()).toStrictEqual({
        "severityCode" : 4000,
        "notificationErrorTitle" : "Internal server error 1",
        "notificationErrorDescription" : "Something went wrong, please try again later",
        "runtimeErrorDescription" : "Something went wrong, please try again later"
    });
});

test('severityCode4000_Get_ReturnsMatchingMondayError', () => {
    //Assert
    expect(mondayErrorGenerator.severityCode4000(notificationErrorTitle, notificationErrorDescription, runtimeErrorDescription)).toStrictEqual({
        "severityCode" : 4000,
        "notificationErrorTitle" : notificationErrorTitle,
        "notificationErrorDescription" : notificationErrorDescription,
        "runtimeErrorDescription" : runtimeErrorDescription
    });
});

test('severityCode6000_Get_ReturnsMatchingMondayError', () => {
    //Assert
    expect(mondayErrorGenerator.severityCode6000(notificationErrorTitle, notificationErrorDescription, runtimeErrorDescription)).toStrictEqual({
        "severityCode" : 6000,
        "notificationErrorTitle" : notificationErrorTitle,
        "notificationErrorDescription" : notificationErrorDescription,
        "runtimeErrorDescription" : runtimeErrorDescription
    });
});