import { Column } from '../Column';
import { MondayColumnType } from '../../../constants/mondayTypes';

class MockColumn {
    mockValidColumn = (): Column => {
        return ({
            display_value: 'display_value',
            id: 'id',
            text: 'text',
            title: 'title',
            type: MondayColumnType.NUMBERS
        });
    };
}

export default new MockColumn;