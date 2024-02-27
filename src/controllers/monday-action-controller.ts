import mondaySdk from 'monday-sdk-js';
import errorHandler from '../middlewares/errorHandler';
import { CustomError } from '../models/CustomError';
import mondayActionService from '../services/monday-action-service';

class MondayActionController {
    //integrationId: 252431281 
    //recipeId: 30191128 
    async autoId(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields } = payload;
            const { boardId, userId, itemId, columnId, format, numberOfDigits, prefixOrSuffix } = inputFields;

            await mondayActionService.autoId(boardId, itemId, columnId, format, numberOfDigits, userId, prefixOrSuffix);

            return res.status(200).send({message: 'ID generation has been completed successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.autoId');
            next(error);
        }
    }

    //integrationId: 251833390 
    //recipeId: 30189637 
    async autoNumber(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields } = payload;
            const { boardId, itemId, columnId, incrementValue } = inputFields;

            await mondayActionService.autoNumber(boardId, itemId, columnId, incrementValue);

            return res.status(200).send({message: 'Increment has been completed successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.autoNumber');
            next(error);
        }
    }

    //integrationId: 240018139, 245343033
    //recipeId: 30172153, 30180577
    async applyFormula(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
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

    //integrationId: 253298894 
    //recipeId: 30192621
    async checkAllDatesStatusCondition(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields } = payload;
            const { boardId, numberOfDays, dateColumnId, statusColumnId, statusColumnValue, conditionStatusColumnId, conditionStatusColumnValue, bool } = inputFields;

            await mondayActionService.checkAllDatesStatusCondition(boardId, numberOfDays, dateColumnId, statusColumnId, statusColumnValue, conditionStatusColumnId, conditionStatusColumnValue, bool);

            return res.status(200).send({message: 'All dates have been checked successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.checkAllDates');
            next(error);
        }
    }

    //integrationId: 254096271
    //recipeId: 30192747
    async checkAllDatesEmptyCondition(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields } = payload;
            const { boardId, numberOfDays, dateColumnId, conditionColumnId, statusColumnId, statusColumnValue } = inputFields;

            await mondayActionService.checkAllDatesEmptyCondition(boardId, numberOfDays, dateColumnId, conditionColumnId, statusColumnId, statusColumnValue);

            return res.status(200).send({message: 'All dates have been checked successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.checkAllDatesCondition');
            next(error);
        }
    }

    //integrationId: 245738684
    //recipeId: 30181398
    async checkAllDuplicates(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
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

    //integrationId: 253299306
    //recipeId: 30192624
    async checkDateStatusCondition(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields } = payload;
            const { boardId, itemId, numberOfDays, dateColumnId, statusColumnId, statusColumnValue, conditionStatusColumnId, conditionStatusColumnValue, bool } = inputFields;

            await mondayActionService.checkDateStatusCondition(boardId, itemId, numberOfDays, dateColumnId, statusColumnId, statusColumnValue, conditionStatusColumnId, conditionStatusColumnValue, bool);

            return res.status(200).send({message: 'Date has been checked successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.checkDates');
            next(error);
        }
    }

    //integrationId: 253560537
    //recipeId: 30192750
    async checkDateEmptyCondition(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields } = payload;
            const { boardId, itemId, numberOfDays, dateColumnId, conditionColumnId, statusColumnId, statusColumnValue } = inputFields;

            await mondayActionService.checkDateEmptyCondition(boardId, itemId, numberOfDays, dateColumnId, conditionColumnId, statusColumnId, statusColumnValue);

            return res.status(200).send({message: 'Date has been checked successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.checkDateCondition');
            next(error);
        }
    }

    //integrationId: 246741839
    //recipeId: 30182862
    async checkDuplicates(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields } = payload;
            const { boardId, itemId, columnId, columnValue, statusColumnId, statusColumnValue } = inputFields;

            await mondayActionService.checkDuplicates(boardId, itemId, columnId, columnValue, statusColumnId, statusColumnValue);

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
            globalThis.mondayClient = mondaySdk();
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
            globalThis.mondayClient = mondaySdk();
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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async deprecated(req, res, next): Promise<void> {
        try {
            return res.status(200).send({message: 'Call has been received successfully but this scenario is deprecated.'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.deprecated');
            next(error);
        }
    }
}

export default new MondayActionController;