import initMondayClient from 'monday-sdk-js';
import errorHandler from '../middlewares/errorHandler';
import { CustomError } from '../models/Error';
import mondayService from '../services/monday-service';

class MondayController {
    //integrationId: 240018139
    //recipeId : 30172153
    async applyFormula(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = initMondayClient();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields } = payload;
            const { boardId, itemId, formula, columnId } = inputFields;

            await mondayService.applyFormula(formula, itemId, columnId, boardId);

            return res.status(200).send({message: 'Formula has been applied successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayController.applyFormula');
            next(error);
        }
    }

    //integrationId: 239133538
    //recipeId : 30171042
    async updateItemName(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = initMondayClient();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields } = payload;
            const { boardId, itemId, nameNewValue, userId } = inputFields;

            await mondayService.updateItemName(boardId, itemId, nameNewValue, userId);

            return res.status(200).send({message: 'Name has been updated successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayController.updateItemName');
            next(error);
        }
    }
}

export default new MondayController;