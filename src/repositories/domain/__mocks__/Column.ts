import { Column } from '../Column';
import { MondayColumnType } from '../../../constants/mondayTypes';

class MockColumn {
    mockValidColumn = (content?: string): Column => {
        return ({
            display_value: 'display_value',
            id: 'id',
            text: content || '2',
            title: 'title',
            type: MondayColumnType.NUMBERS
        });
    };
}

export default new MockColumn;