import { Subitem } from '../Subitem';
import MockColumn from './Column';

class MockSubitem {
    mockValidSubitem = (): Subitem => {
        return ({
            column_values: [MockColumn.mockValidColumn()],
            id: 'id',
            name: 'name'
        });
    };
}

export default new MockSubitem;