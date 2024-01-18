import { ItemsPage } from '../ItemsPage';
import MockItem from './Item';

class MockItemsPage {
    mockValidItemsPage = (): ItemsPage => {
        return ({
            cursor: 'cursor',
            items: [MockItem.mockValidItem()]
        });
    };
}

export default new MockItemsPage; 