import { CustomTypeListItem, MondayColumnType } from '../constants/mondayTypes';
import errorHandler from '../middlewares/errorHandler';
import { CustomError } from '../models/Error';
import { Board } from '../repositories/domain/BoardInformationResponse';
import mondayRepo from '../repositories/monday-repository';

interface IMondayGetterService {
    getSubitemColumnsTitle(boardId: number): Promise<CustomTypeListItem[]>;
}

class MondayGetterService implements IMondayGetterService {
    async getSubitemColumnsTitle(boardId: number): Promise<CustomTypeListItem[]> {
        try {
            /*
            //Get subitem board ID from current board
            const board: Board = await mondayRepo.getBoardInformations(boardId);

            let subitemBoardId: number = 0;
            for (let column of board.columns) {
                if (column.type === MondayColumnType.SUBTASKS && column.settings_str.boardIds) {
                    subitemBoardId = column.settings_str.boardIds[0];
                    break;
                }
            }

            //Get subitem board columns info
            const subitemBoard: Board = await mondayRepo.getBoardInformations(subitemBoardId);

            //Build the array to return
            let subitemColumnsArray: CustomTypeListItem[] = [];
            for (let column of subitemBoard.columns) {
                subitemColumnsArray.push({ title: column.title, value: column.id });
            }
            */
            /*
            //Get subitems of an item
            const subitems: Subitem[] = await mondayRepo.getSubitemsFromItem(itemId);

            //Build the array to return
            let subitemColumnsArray: CustomTypeListItem[] = [];
            for (let column of subitems[0].column_values) {
                subitemColumnsArray.push({ title: column.title, value: column.id });
            }
            */
            let subitemColumnsArray: CustomTypeListItem[] = [];
            return subitemColumnsArray;
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayGetterService.getSubitemColumnsTitle');
            throw error;
        }
      }
}

export default new MondayGetterService;