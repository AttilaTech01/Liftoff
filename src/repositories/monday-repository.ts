import { Converters } from './domain/converters';
//import { BoardInformationResponse, Board } from './domain/BoardInformationResponse';
import { Item } from './domain/Item';
import { ItemInformationResponse } from './domain/ItemInformationResponse';
//import { SubitemInformationResponse, Subitem } from './domain/SubitemInformationResponse';
import { User } from './domain/User';
import { UserInformationResponse } from './domain/UserInformationResponse';
import errorHandler from '../middlewares/errorHandler';
import { CustomError } from '../models/Error';

interface IMondayRepository {
    changeSimpleColumnValue(boardId: number, itemId: number, columnId: string, value: string): Promise<boolean>;
    //getBoardInformations(boardId: number): Promise<Board>;
    getItemInformations(itemId: number): Promise<Item>;
    //getSubitemsFromItem(itemId: number): Promise<Subitem[]>;
    getUserInformations(userId: number): Promise<User>;
}
  
class MondayRepository implements IMondayRepository {
    async changeSimpleColumnValue(boardId: number, itemId: number, columnId: string, value: string): Promise<boolean> {
        try {
            const query = `mutation ($boardId: Int!, $itemId: Int!, $columnId: String!, $value: String!) {
                change_simple_column_value (board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
                id
                }
            }
            `;
            const variables = { boardId, columnId, itemId, value };

            await globalThis.mondayClient.api(query, { variables });
            return true;
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayRepository.changeSimpleColumnValue');
            throw error;
        }
    }

    /*
    async getBoardInformations(boardId: number): Promise<Board> {
        try {
            const query = `query ($boardId: [Int]) {
                boards (ids: $boardId) {
                    columns {
                        id
                        title
                        type
                        settings_str
                    }
                }
            }
            `;
            const variables = { boardId };

            const response: BoardInformationResponse = await globalThis.mondayClient.api(query, { variables });
            return Converters.convertToBoardArray(response)[0];
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayRepository.getItemInformations');
            throw error;
        }
    }
    */

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
            return Converters.convertToItemArray(response)[0];
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayRepository.getItemInformations');
            throw error;
        }
    }

    /*
    async getSubitemsFromItem(itemId: number): Promise<Subitem[]> {
        try {
            const query = `query ($itemId: [Int]) {
                items (ids: $itemId) {
                    subitems {
                        id
                        name
                        column_values {
                            id
                            title
                            text
                        }
                    }
                }
            }
            `;
            const variables = { itemId };

            const response: SubitemInformationResponse = await globalThis.mondayClient.api(query, { variables });
            return Converters.convertToSubitemArray(response);
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayRepository.getSubitemsFromItem');
            throw error;
        }
    }
    */

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
            return Converters.convertToUserArray(response)[0];
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayRepository.getUserInformations');
            throw error;
        }
    }
}
  
export default new MondayRepository;