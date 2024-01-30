//domain
import { UserInformationResponse } from '../UserInformationResponse';
//mocks
import MockUser from './User';

class MockUserInformationResponse {
    mockValidUserInformationResponse = (): UserInformationResponse => {
        return ({
            data: {
                users: [MockUser.mockValidUser()],
            },
            account_id: 1234
        });
    };
}

export default new MockUserInformationResponse;