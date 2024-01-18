import { Item } from '../Item';
import MockBoard from './Board';
import MockColumn from './Column';
import MockGroup from './Group';
import MockSubitem from './Subitem';

class MockItem {
    mockValidItem = (): Item => {
        return ({
            board: MockBoard.mockValidBoard(),
            column_values: [MockColumn.mockValidColumn()],
            group: MockGroup.mockValidGroup(),
            id: 5678,
            name: 'name',
            subitems: [MockSubitem.mockValidSubitem()],
            text: 'text',
        });
    };
}

export default new MockItem;