import { Item } from '../Item';
import MockColumn from './Column';
import MockGroup from './Group';
import MockSubitem from './Subitem';
import { MondayColumnType } from '../../../constants/mondayTypes';

class MockItem {
    mockValidItem = (): Item => {
        return ({
            board: {
                items_page: undefined,
                name: 'boardName'
            },
            column_values: [MockColumn.mockValidColumn()],
            group: MockGroup.mockValidGroup(),
            id: 5678,
            name: 'name',
            subitems: [MockSubitem.mockValidSubitem()],
            text: 'text',
        });
    };

    mockCustomItem = (): Item => {
        return ({
            board: {
                items_page: undefined,
                name: 'boardName'
            },
            column_values: [
                {
                    display_value: 'display_value',
                    id: 'id1',
                    text: undefined,
                    title: 'title',
                    type: MondayColumnType.NUMBERS
                },
                {
                    display_value: 'display_value',
                    id: 'id2',
                    text: 'TEST-00006-boardName-1',
                    title: 'title',
                    type: MondayColumnType.TEXT
                },
                {
                    display_value: 'display_value',
                    id: 'id3',
                    text: '6',
                    title: 'title',
                    type: MondayColumnType.NUMBERS
                },
                {
                    display_value: 'display_value',
                    id: 'date',
                    text: '2021-01-01',
                    title: 'title',
                    type: MondayColumnType.DATE
                },
            ],
            group: {
                title: 'groupTitle',
            },
            id: 1,
            name: 'name1',
            subitems: [
                {
                    column_values: [
                        {
                            display_value: 'display_value',
                            id: 'subitemColumnId1',
                            text: 'subitem1',
                            title: 'title',
                            type: MondayColumnType.NUMBERS
                        },
                        {
                            display_value: 'display_value',
                            id: 'subiteColumnId2',
                            text: 'subitem2',
                            title: 'title',
                            type: MondayColumnType.NUMBERS
                        }
                    ],
                    id: 'subitemId1',
                    name: 'subitemName1'
                },
                {
                    column_values: [
                        {
                            display_value: 'display_value',
                            id: 'subitemColumnId1',
                            text: 'subitem1',
                            title: 'title',
                            type: MondayColumnType.NUMBERS
                        },
                        {
                            display_value: 'display_value',
                            id: 'subitemColumnId2',
                            text: 'subitem2',
                            title: 'title',
                            type: MondayColumnType.NUMBERS
                        }
                    ],
                    id: 'subitemId2',
                    name: 'subitemName2'
                },
                {
                    column_values: [
                        {
                            display_value: 'display_value',
                            id: 'subitemColumnId1',
                            text: 'subitem1',
                            title: 'title',
                            type: MondayColumnType.NUMBERS
                        },
                        {
                            display_value: 'display_value',
                            id: 'subitemColumnId2',
                            text: 'subitem2',
                            title: 'title',
                            type: MondayColumnType.NUMBERS
                        }
                    ],
                    id: 'subitemId3',
                    name: 'subitemName3'
                },
            ],
            text: 'text1',
        });
    }
}

export default new MockItem;