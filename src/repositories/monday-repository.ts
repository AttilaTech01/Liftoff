import { Converters } from './domain/converters';
import { Item, Column } from './domain/ItemInformationResponse';


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

            const response = await globalThis.mondayClient.api(query, { variables });
            const parsedResponse: Item[] = Converters.convertToItemArray(response);

            const itemColumns: Column[] = parsedResponse[0].column_values;
            for (let index in itemColumns) {
                console.log("index " + index);
                console.log("column id : " + parsedResponse[0].column_values[index].id);
                console.log("column text : " + parsedResponse[0].column_values[index].text);
                console.log("*************************************");
            }

            return parsedResponse[0];
        } catch (err) {
            console.log(err);
        }
    }
}
  
export default new MondayRepository;