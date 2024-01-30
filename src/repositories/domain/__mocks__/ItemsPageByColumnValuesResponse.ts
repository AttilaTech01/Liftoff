//domain
import { ItemsPageByColumnValuesResponse } from '../ItemsPageByColumnValuesResponse';
//mocks
import MockItemsPage from './ItemsPage';

class MockItemsPageByColumnValuesResponse {
    mockValidItemsPageByColumnValuesResponse = (): ItemsPageByColumnValuesResponse => {
        return ({
            data: {
                items_page_by_column_values: MockItemsPage.mockValidItemsPage(),
            },
            account_id: 1234
        });
    };
}

export default new MockItemsPageByColumnValuesResponse;