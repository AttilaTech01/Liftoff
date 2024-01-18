//domain
import { UserInformationResponse } from '../UserInformationResponse';
//mocks
import MockUser from './User';

export class MockItemsPageByColumnValuesResponse {
    mockValidUserInformationResponse = (): UserInformationResponse => {
        return ({
            data: {
                users: [MockUser.mockValidUser()],
            },
            account_id: 1234
        });
    };
}