import { Board } from './domain/Board';
import { BoardInformationResponse, BoardInformationResponseConverter } from './domain/BoardInformationResponse';
import { Item } from './domain/Item';
import { ItemInformationResponse, ItemInformationResponseConverter } from './domain/ItemInformationResponse';
import { ItemsPage } from './domain/ItemsPage';
import { ItemsPageByColumnValuesResponse, ItemsPageByColumnValuesResponseConverter } from './domain/ItemsPageByColumnValuesResponse';
import { NextItemsPageResponse, NextItemsPageResponseConverter } from './domain/NextItemsPageResponse';
import { User } from './domain/User';
import { UserInformationResponse, UserInformationResponseConverter } from './domain/UserInformationResponse';
import errorHandler from '../middlewares/errorHandler';
import { CustomError } from '../models/CustomError';

interface IMondayRepository {
    changeSimpleColumnValue(boardId: number, itemId: number, columnId: string, value: string): Promise<boolean>;
    getItemInformations(itemId: number): Promise<Item>;
    getItemsByBoardId(boardId: number): Promise<Board>;
    getItemsNextPageFromCursor(cursor: string): Promise<ItemsPage>;
    getItemsNextPageFromCursorWithColumnValues(cursor: string): Promise<ItemsPage>;
    getItemsPageByColumnValues(boardId: number, columnId: string, columnValues: string[]): Promise<ItemsPage>;
    getItemsPageWithFiltersNumber(boardId: number, columnId: string): Promise<Board>;
    getItemsPageWithFiltersText(boardId: number, columnId: string): Promise<Board>;
    getUserInformations(userId: number): Promise<User>;
}
  
class MondayRepository implements IMondayRepository {
    async changeSimpleColumnValue(boardId: number, itemId: number, columnId: string, value: string): Promise<boolean> {
        globalThis.mondayClient.setApiVersion("2023-10");

        try {
            const query = `mutation ($boardId: ID!, $itemId: ID!, $columnId: String!, $value: String!) {
                change_simple_column_value (board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
                id
                }
            }
            `;
            const variables = { boardId, columnId, itemId, value };

            await globalThis.mondayClient.api(query, { variables });
            //CHECK IF ERROR
            return true;
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayRepository.changeSimpleColumnValue');
            throw error;
        }
    }

    async getItemInformations(itemId: number): Promise<Item> {
        globalThis.mondayClient.setApiVersion("2023-10");
        
        try {
            const query = `query ($itemId: [ID!]) {
                items (ids: $itemId) {
                    id
                    name
                    board {
                        name
                    }
                    group {
                        title
                    }
                    column_values {
                        id
                        text
                        type
                        ... on MirrorValue {
                            display_value
                        }
                    }
                }
            }
            `;
            const variables = { itemId };

            const response: ItemInformationResponse = await globalThis.mondayClient.api(query, { variables });
            return ItemInformationResponseConverter.convertToItemArray(response)[0];
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayRepository.getItemInformations');
            throw error;
        }
    }
    
    async getItemsByBoardId(boardId: number): Promise<Board> {
        globalThis.mondayClient.setApiVersion("2023-10");

        try {
            const query = `query ($boardId: [ID!]) {
                boards (ids: $boardId) {
                    items_page (limit: 10) {
                        cursor
                        items {
                            id
                            name
                            column_values {
                                id
                                text
                            }
                        }
                    }
                }
            }
            `;
            const variables = { boardId };

            const response: BoardInformationResponse = await globalThis.mondayClient.api(query, { variables });
            return BoardInformationResponseConverter.convertToBoardArray(response)[0];
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayRepository.getItemsFromBoardId');
            throw error;
        }
    }

    async getItemsNextPageFromCursor(cursor: string): Promise<ItemsPage> {
        globalThis.mondayClient.setApiVersion("2023-10");

        try {
            const query = `query ($cursor: String!) {
                next_items_page (limit: 10, cursor: $cursor) {
                    cursor
                    items {
                        id
                    }
                }
            }
            `;
            const variables = { cursor };

            const response: NextItemsPageResponse = await globalThis.mondayClient.api(query, { variables });
            return NextItemsPageResponseConverter.convertToItemsPage(response);
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayRepository.getItemInformations');
            throw error;
        }
    }
    
    async getItemsNextPageFromCursorWithColumnValues(cursor: string): Promise<ItemsPage> {
        globalThis.mondayClient.setApiVersion("2023-10");

        try {
            const query = `query ($cursor: String!) {
                next_items_page (limit: 10, cursor: $cursor) {
                    cursor
                    items {
                        id
                        name
                        column_values {
                            id
                            text
                        }
                    }
                }
            }
            `;
            const variables = { cursor };

            const response: NextItemsPageResponse = await globalThis.mondayClient.api(query, { variables });
            return NextItemsPageResponseConverter.convertToItemsPage(response);
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayRepository.getItemInformations');
            throw error;
        }
    }

    async getItemsPageByColumnValues(boardId: number, columnId: string, columnValues: string[]): Promise<ItemsPage> {
        globalThis.mondayClient.setApiVersion("2023-10");

        try {
            const query = `query ($boardId: ID!, $columnId: String!, $columnValues: [String]!) {
                items_page_by_column_values (limit: 10, board_id: $boardId, columns: [{ column_id: $columnId, column_values: $columnValues }]) {
                    cursor
                    items {
                        id
                    }
                }
            }
            `;
            const variables = { boardId, columnId, columnValues };

            const response: ItemsPageByColumnValuesResponse = await globalThis.mondayClient.api(query, { variables });
            return ItemsPageByColumnValuesResponseConverter.convertToItemsPage(response);
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayRepository.getItemsFromBoardId');
            throw error;
        }
    }

    async getItemsPageWithFiltersNumber(boardId: number, columnId: string): Promise<Board> {
        globalThis.mondayClient.setApiVersion("2023-10");
        const orderColumnId: string = columnId;
        const rulesColumnId: string = columnId;

        try {
            const query = `query ($boardId: [ID!], $orderColumnId: String!, $rulesColumnId: ID!) {
                boards (ids: $boardId) {
                    items_page (limit: 10, query_params: {
                        order_by: [{
                            column_id: $orderColumnId,
                            direction: desc 
                        }], 
                        rules: [{
                            column_id: $rulesColumnId,
                            compare_value: [],
                            operator: is_not_empty
                        }]
                    }) {
                        cursor
                        items {
                            id
                            column_values {
                                id
                                text
                            }
                        }
                    }
                }
            }
            `;
            const variables = { boardId, orderColumnId, rulesColumnId };

            const response: BoardInformationResponse = await globalThis.mondayClient.api(query, { variables });
            return BoardInformationResponseConverter.convertToBoardArray(response)[0];
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayRepository.getItemsPageWithFilters');
            throw error;
        } 
    }

    async getItemsPageWithFiltersText(boardId: number, columnId: string): Promise<Board> {
        globalThis.mondayClient.setApiVersion("2023-10");

        try {
            const query = `query ($boardId: [ID!], $columnId: ID!) {
                boards (ids: $boardId) {
                    items_page (limit: 10, query_params: { 
                        rules: [{
                            column_id: $columnId,
                            compare_value: [],
                            operator: is_not_empty
                        }]
                    }) {
                        cursor
                        items {
                            id
                            column_values {
                                id
                                text
                            }
                        }
                    }
                }
            }
            `;
            const variables = { boardId, columnId };

            const response: BoardInformationResponse = await globalThis.mondayClient.api(query, { variables });
            return BoardInformationResponseConverter.convertToBoardArray(response)[0];
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayRepository.getItemsPageWithFilters');
            throw error;
        } 
    }

    async getUserInformations(userId: number): Promise<User> {
        try {
            const query = `query ($userId: [ID!]) {
                users (ids: $userId, limit: 1) {
                    name
                }
            }
            `;
            const variables = { userId };

            const response: UserInformationResponse = await globalThis.mondayClient.api(query, { variables });
            console.log('getUserInformations : ' + JSON.stringify(response));
            return UserInformationResponseConverter.convertToUserArray(response)[0];
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayRepository.getUserInformations');
            throw error;
        }
    }
}
  
export default new MondayRepository;