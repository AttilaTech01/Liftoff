import { Board } from '../Board';
import MockItemsPage from './ItemsPage';

class MockBoard {
    mockValidBoard = (): Board => {
        return ({
            items_page: MockItemsPage.mockValidItemsPage(),
            name: 'mockValidBoard',
        });
    };
}

export default new MockBoard;