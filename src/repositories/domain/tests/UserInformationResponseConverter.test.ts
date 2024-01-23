import { User } from '../User';
import { UserInformationResponse, UserInformationResponseConverter } from '../UserInformationResponse';
import MockUserInformationResponse from '../__mocks__/UserInformationResponse';

const mockUserInfoResponse: UserInformationResponse = MockUserInformationResponse.mockValidUserInformationResponse(); 

describe('convertToUserArray', () => {
    test('ReceivesUserInformationResponse_ReturnsUserArray', async () => {
        //Arrange
        const userArray: User[] = mockUserInfoResponse.data.users;

        //Act
        const result: User[] = UserInformationResponseConverter.convertToUserArray(mockUserInfoResponse);

        //Assert
        expect(result).toStrictEqual(userArray);
    });
});