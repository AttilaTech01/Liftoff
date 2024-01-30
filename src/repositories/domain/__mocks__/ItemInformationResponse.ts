//domain
import { ItemInformationResponse } from '../ItemInformationResponse';
//mocks
import MockItem from './Item';

class MockItemInformationResponse {
    mockValidItemInformationResponse = (): ItemInformationResponse => {
        return ({
            data: {
                items: [MockItem.mockValidItem()],
            },
            account_id: 1234
        });
    };
}

export default new MockItemInformationResponse;