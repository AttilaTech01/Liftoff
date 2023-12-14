import initMondayClient from 'monday-sdk-js';
import { CustomTypeListItem } from '../constants/mondayTypes';
import errorHandler from '../middlewares/errorHandler';
import { CustomError } from '../models/Error';
import mondayGetterService from '../services/monday-getter-service';

class MondayGetterController {
    //integrationId: 
    //recipeId: 
    async getSubitemColumnsTitle(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = initMondayClient();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { boardId } = payload;

            const response: CustomTypeListItem[] = await mondayGetterService.getSubitemColumnsTitle(boardId);

            return res.status(200).send(response);
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayGetterController.getSubitemColumnsTitle');
            next(error);
        }
    }
}

export default new MondayGetterController;