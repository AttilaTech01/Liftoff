import initMondayClient from 'monday-sdk-js';
import errorHandler from '../middlewares/errorHandler';
import { CustomError } from '../models/Error';
import mondayActionService from '../services/monday-action-service';

class MondayActionController {
    //integrationId: 240018139, 245343033
    //recipeId: 30172153, 30180577
    async applyFormula(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = initMondayClient();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields } = payload;
            const { boardId, itemId, formula, columnId } = inputFields;

            await mondayActionService.applyFormula(boardId, itemId, formula, columnId);

            return res.status(200).send({message: 'Formula has been applied successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.applyFormula');
            next(error);
        }
    }

    //integrationId: 245738684
    //recipeId: 30181398
    async checkAllDuplicates(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = initMondayClient();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields } = payload;
            const { boardId, itemId, statusColumnId, statusColumnValue, verifiedColumnId } = inputFields;

            await mondayActionService.checkAllDuplicates(boardId, statusColumnId, statusColumnValue, verifiedColumnId);

            return res.status(200).send({message: 'All duplicates have been checked successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.checkAllDuplicates');
            next(error);
        }
    }

    //integrationId: 246741839
    //recipeId: 30182862
    async checkDuplicates(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = initMondayClient();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields } = payload;
            const { boardId, itemId, columnId, columnValue, statusColumnId, statusColumnValue } = inputFields;

            await mondayActionService.checkDuplicates(boardId, columnId, columnValue, statusColumnId, statusColumnValue);

            return res.status(200).send({message: 'Duplicates have been checked successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.checkDuplicates');
            next(error);
        }
    }

    //integrationId: 242184509, 245096112
    //recipeId: 30175811, 30180045
    async copyColumnsContent(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = initMondayClient();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields } = payload;
            const { boardId, itemId, sourceColumns, targetColumns } = inputFields;

            await mondayActionService.copyColumnsContent(boardId, itemId, sourceColumns, targetColumns);

            return res.status(200).send({message: 'Columns have been copied successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.copyColumnsContent');
            next(error);
        }
    }

    //integrationId: 239133538, 245268407
    //recipeId: 30171042, 30180578
    async updateItemName(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = initMondayClient();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields } = payload;
            const { boardId, itemId, nameNewValue, userId } = inputFields;

            await mondayActionService.updateItemName(boardId, itemId, nameNewValue, userId);

            return res.status(200).send({message: 'Name has been updated successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.updateItemName');
            next(error);
        }
    }
}

export default new MondayActionController;