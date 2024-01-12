import { Converters } from '../converters';
import { Item } from '../Item';
import { ItemInformationResponse } from '../ItemInformationResponse';
import { User } from '../User';
import { UserInformationResponse } from '../UserInformationResponse';
import { MondayColumnType } from '../../../constants/mondayTypes';

// TODO - needs to test each converter and not the deprecated global class
const itemInfoResponse: ItemInformationResponse = {
    data: {
        items: [
            {
                id: 1,
                name: 'name1',
                board: {
                    name: 'board1'
                },
                group: {
                    title: 'group1'
                },
                column_values: [
                    {
                        id: 'column1',
                        text: 'text1',
                        type: MondayColumnType.TEXT
                    },
                    {
                        id: 'column2',
                        text: 'text2',
                        type: MondayColumnType.TEXT
                    }  
                ]
            },
            {
                id: 2,
                name: 'name2',
                board: {
                    name: 'board2'
                },
                group: {
                    title: 'group2'
                },
                column_values: [
                    {
                        id: 'column1',
                        text: 'text3',
                        type: MondayColumnType.TEXT
                    },
                    {
                        id: 'column2',
                        text: 'text4',
                        type: MondayColumnType.TEXT
                    }  
                ]
            },
            {
                id: 3,
                name: 'name3',
                board: {
                    name: 'board3'
                },
                group: {
                    title: 'group3'
                },
                column_values: [
                    {
                        id: 'column1',
                        text: 'text5',
                        type: MondayColumnType.TEXT
                    },
                    {
                        id: 'column2',
                        text: 'text6',
                        type: MondayColumnType.TEXT
                    }  
                ]
            }
        ],
    },
    account_id: 1,
};

const userInfoResponse: UserInformationResponse = {
    data: {
        users: [
            {
                name: 'User1'
            },
            {
                name: 'User2'
            },
            {
                name: 'User3'
            }
        ],
    },
    account_id: 1,
};

describe('convertToItemArray', () => {
    test('ReceivesItemInformationResponse_ReturnsItemArray', async () => {
        //Arrange
        const itemArray: Item[] = itemInfoResponse.data.items;

        //Act
        const result: Item[] = await Converters.convertToItemArray(itemInfoResponse);

        //Assert
        expect(result).toStrictEqual(itemArray);
    });
});

describe('convertToUserArray', () => {
    test('ReceivesUserInformationResponse_ReturnsUserArray', async () => {
        //Arrange
        const userArray: User[] = userInfoResponse.data.users;

        //Act
        const result: User[] = await Converters.convertToUserArray(userInfoResponse);

        //Assert
        expect(result).toStrictEqual(userArray);
    });
});