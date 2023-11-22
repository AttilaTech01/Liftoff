import { Converters } from './domain/converters';
import { ItemInformationResponse, Item } from './domain/ItemInformationResponse';
import { UserInformationResponse, User } from './domain/UserInformationResponse';


interface IMondayRepository {
    changeSimpleColumnValue(boardId: number, itemId: number, columnId: string, value: string): Promise<boolean>;
    getItemInformations(itemId: number);
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
            console.log(err);
            return false;
        }
    }

    async getItemInformations(itemId: number): Promise<Item | undefined> {
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
                    }
                }
            }
            `;
            const variables = { itemId };

            const response: ItemInformationResponse = await globalThis.mondayClient.api(query, { variables });
            return Converters.convertToItemArray(response)[0];
        } catch (err) {
            console.log(err);
        }
    }

    async getUserInformations(userId: number): Promise<User | undefined> {
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
            console.log(err);
        }
    }
}
  
export default new MondayRepository;