//domain
import { NextItemsPageResponse } from '../NextItemsPageResponse';
//mocks
import MockItemsPage from './ItemsPage';

export class MockItemsPageByColumnValuesResponse {
    mockValidNextItemsPageResponse = (): NextItemsPageResponse => {
        return ({
            data: {
                next_items_page: MockItemsPage.mockValidItemsPage(),
            },
            account_id: 1234
        });
    };
}