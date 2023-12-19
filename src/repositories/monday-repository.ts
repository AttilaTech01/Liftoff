import { Board } from './domain/Board';
import { BoardInformationResponse, BoardInformationResponseConverter } from './domain/BoardInformationResponse';
import { Item } from './domain/Item';
import { ItemInformationResponse, ItemInformationResponseConverter } from './domain/ItemInformationResponse';
import { ItemsPage } from './domain/ItemsPage';
import { ItemsPageResponse, ItemsPageResponseConverter } from './domain/ItemsPageResponse';
import { User } from './domain/User';
import { UserInformationResponse, UserInformationResponseConverter } from './domain/UserInformationResponse';
import errorHandler from '../middlewares/errorHandler';
import { CustomError } from '../models/Error';

interface IMondayRepository {
    changeSimpleColumnValue(boardId: number, itemId: number, columnId: string, value: string): Promise<boolean>;
    getItemInformations(itemId: number): Promise<Item>;
    getItemsFromBoardId(boardId: number): Promise<Board>;
    getItemsNextPageFromCursor(cursor: string): Promise<ItemsPage>;
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

            const response = await globalThis.mondayClient.api(query, { variables });
            //CHECK IF ERROR
            console.log(response);
            return true;
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayRepository.changeSimpleColumnValue');
            throw error;
        }
    }

    async getItemInformations(itemId: number): Promise<Item> {
        try {
            const query = `query ($itemId: [Int]) {
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
    
    async getItemsFromBoardId(boardId: number): Promise<Board> {
        globalThis.mondayClient.setApiVersion("2023-10");

        try {
            const query = `query ($boardId: [ID!]) {
                boards (ids: $boardId) {
                    items_page (limit: 3) {
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
                next_items_page (limit: 3, cursor: $cursor) {
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

            const response: ItemsPageResponse = await globalThis.mondayClient.api(query, { variables });
            return ItemsPageResponseConverter.convertToItemsPage(response);
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayRepository.getItemInformations');
            throw error;
        }
    }

    async getUserInformations(userId: number): Promise<User> {
        try {
            const query = `query ($userId: [Int]) {
                users (ids: $userId, limit: 1) {
                    name
                }
            }
            `;
            const variables = { userId };

            const response: UserInformationResponse = await globalThis.mondayClient.api(query, { variables });
            return UserInformationResponseConverter.convertToUserArray(response)[0];
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayRepository.getUserInformations');
            throw error;
        }
    }
}
  
export default new MondayRepository;