//domain
import { NextItemsPageResponse } from '../NextItemsPageResponse';
//mocks
import MockItemsPage from './ItemsPage';

class MockNextItemsPageResponse {
    mockValidNextItemsPageResponse = (): NextItemsPageResponse => {
        return ({
            data: {
                next_items_page: MockItemsPage.mockValidItemsPage(),
            },
            account_id: 1234
        });
    };
}

export default new MockNextItemsPageResponse;