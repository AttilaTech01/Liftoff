interface IMondayRepository {
    changeSimpleColumnValue(boardId: number, itemId: number, columnId: string, value: string): Promise<boolean>;
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
}
  
export default new MondayRepository;