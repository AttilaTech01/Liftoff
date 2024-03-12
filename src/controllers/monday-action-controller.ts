import mondaySdk from 'monday-sdk-js';
import { Logger } from '@mondaycom/apps-sdk';
import errorHandler from '../middlewares/errorHandler';
import { CustomError } from '../models/CustomError';
import mondayActionService from '../services/monday-action-service';

class MondayActionController {
    async autoCopy(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields, integrationId } = payload;
            const { boardId, userId, itemId, format, columnId } = inputFields;

            globalThis.logger = new Logger(`${globalThis.appName}-${integrationId}`);
            globalThis.logger.info(`POST resquest at /ids/auto-copy`);

            await mondayActionService.autoCopy(boardId, userId, itemId, format, columnId);

            return res.status(200).send({message: 'ID generation has been completed successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.autoCopy');
            next(error);
        }
    }

    async autoId(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields, integrationId } = payload;
            const { boardId, userId, itemId, columnId, format, numberOfDigits, prefixOrSuffix } = inputFields;

            globalThis.logger = new Logger(`${globalThis.appName}-${userId}-${integrationId}`);
            globalThis.logger.info(`POST resquest at /ids/auto-id`);

            await mondayActionService.autoId(boardId, itemId, columnId, format, numberOfDigits, userId, prefixOrSuffix);

            return res.status(200).send({message: 'ID generation has been completed successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.autoId');
            next(error);
        }
    }

    async autoNumber(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields, integrationId } = payload;
            const { boardId, itemId, columnId, incrementValue } = inputFields;

            globalThis.logger = new Logger(`${globalThis.appName}-${integrationId}`);
            globalThis.logger.info(`POST resquest at /ids/auto-id`);

            await mondayActionService.autoNumber(boardId, itemId, columnId, incrementValue);

            return res.status(200).send({message: 'Increment has been completed successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.autoNumber');
            next(error);
        }
    }

    async applyFormula(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields, integrationId } = payload;
            const { boardId, itemId, formula, columnId } = inputFields;

            globalThis.logger = new Logger(`${globalThis.appName}-${integrationId}`);
            globalThis.logger.info(`POST resquest at /formulas/apply-formula`);

            await mondayActionService.applyFormula(boardId, itemId, formula, columnId);

            return res.status(200).send({message: 'Formula has been applied successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.applyFormula');
            next(error);
        }
    }

    async checkAllDatesStatusCondition(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields, integrationId } = payload;
            const { boardId, numberOfDays, dateColumnId, statusColumnId, statusColumnValue, conditionStatusColumnId, conditionStatusColumnValue, bool } = inputFields;

            globalThis.logger = new Logger(`${globalThis.appName}-${integrationId}`);
            globalThis.logger.info(`POST resquest at /dates/check-all-dates-status`);

            await mondayActionService.checkAllDatesStatusCondition(boardId, numberOfDays, dateColumnId, statusColumnId, statusColumnValue, conditionStatusColumnId, conditionStatusColumnValue, bool);

            return res.status(200).send({message: 'All dates have been checked successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.checkAllDates');
            next(error);
        }
    }

    async checkAllDatesEmptyCondition(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields, integrationId } = payload;
            const { boardId, numberOfDays, dateColumnId, conditionColumnId, statusColumnId, statusColumnValue } = inputFields;

            globalThis.logger = new Logger(`${globalThis.appName}-${integrationId}`);
            globalThis.logger.info(`POST resquest at /dates/check-all-dates-empty`);

            await mondayActionService.checkAllDatesEmptyCondition(boardId, numberOfDays, dateColumnId, conditionColumnId, statusColumnId, statusColumnValue);

            return res.status(200).send({message: 'All dates have been checked successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.checkAllDatesCondition');
            next(error);
        }
    }

    async checkAllDuplicates(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields, integrationId } = payload;
            const { boardId, itemId, statusColumnId, statusColumnValue, verifiedColumnId } = inputFields;

            globalThis.logger = new Logger(`${globalThis.appName}-${integrationId}`);
            globalThis.logger.info(`POST resquest at /duplicates/check-all-duplicates`);

            await mondayActionService.checkAllDuplicates(boardId, statusColumnId, statusColumnValue, verifiedColumnId);

            return res.status(200).send({message: 'All duplicates have been checked successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.checkAllDuplicates');
            next(error);
        }
    }

    async checkDateStatusCondition(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields, integrationId } = payload;
            const { boardId, itemId, numberOfDays, dateColumnId, statusColumnId, statusColumnValue, conditionStatusColumnId, conditionStatusColumnValue, bool } = inputFields;

            globalThis.logger = new Logger(`${globalThis.appName}-${integrationId}`);
            globalThis.logger.info(`POST resquest at /dates/check-date-status`);

            await mondayActionService.checkDateStatusCondition(boardId, itemId, numberOfDays, dateColumnId, statusColumnId, statusColumnValue, conditionStatusColumnId, conditionStatusColumnValue, bool);

            return res.status(200).send({message: 'Date has been checked successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.checkDates');
            next(error);
        }
    }

    async checkDateEmptyCondition(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields, integrationId } = payload;
            const { boardId, itemId, numberOfDays, dateColumnId, conditionColumnId, statusColumnId, statusColumnValue } = inputFields;

            globalThis.logger = new Logger(`${globalThis.appName}-${integrationId}`);
            globalThis.logger.info(`POST resquest at /dates/check-date-empty`);

            await mondayActionService.checkDateEmptyCondition(boardId, itemId, numberOfDays, dateColumnId, conditionColumnId, statusColumnId, statusColumnValue);

            return res.status(200).send({message: 'Date has been checked successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.checkDateCondition');
            next(error);
        }
    }

    async checkDuplicates(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields, integrationId } = payload;
            const { boardId, itemId, columnId, columnValue, statusColumnId, statusColumnValue } = inputFields;

            globalThis.logger = new Logger(`${globalThis.appName}-${integrationId}`);
            globalThis.logger.info(`POST resquest at /duplicates/check-duplicates`);

            await mondayActionService.checkDuplicates(boardId, itemId, columnId, columnValue, statusColumnId, statusColumnValue);

            return res.status(200).send({message: 'Duplicates have been checked successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.checkDuplicates');
            next(error);
        }
    }

    async checkDuplicatesItemCreation(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields, integrationId } = payload;
            const { boardId, itemId, columnId } = inputFields;

            globalThis.logger = new Logger(`${globalThis.appName}-${integrationId}`);
            globalThis.logger.info(`POST resquest at /duplicates/check-duplicates-item-creation`);

            await mondayActionService.checkDuplicatesItemCreation(boardId, itemId, columnId);

            return res.status(200).send({message: 'Duplicates have been checked successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.checkDuplicatesItemCreation');
            next(error);
        }
    }

    async copyColumnsContent(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields, integrationId } = payload;
            const { boardId, itemId, sourceColumns, targetColumns } = inputFields;

            globalThis.logger = new Logger(`${globalThis.appName}-${integrationId}`);
            globalThis.logger.info(`POST resquest at /utilities/copy-columns-content`);

            await mondayActionService.copyColumnsContent(boardId, itemId, sourceColumns, targetColumns);

            return res.status(200).send({message: 'Columns have been copied successfully'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.copyColumnsContent');
            next(error);
        }
    }

    async event(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { type, data } = payload;
            const { app_id, user_id, user_email, accound_id, account_name } = data;

            globalThis.logger = new Logger(`${globalThis.appName}-${account_name}`);
            globalThis.logger.info(`POST resquest of type ${type} at /event`);

            return res.status(200).send();
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.event');
            next(error);
        }
    }

    async updateItemName(req, res, next): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = mondaySdk();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields, integrationId } = payload;
            const { boardId, itemId, nameNewValue, userId } = inputFields;

            globalThis.logger = new Logger(`${globalThis.appName}-${userId}-${integrationId}`);
            globalThis.logger.info(`POST resquest at /names/rename-item`);

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
            globalThis.logger = new Logger(`${globalThis.appName}-deprecated-route`);
            globalThis.logger.warn(`POST resquest at /deprecated`);

            return res.status(200).send({message: 'Call has been received successfully but this scenario is deprecated.'});
        } catch (err) {
            const error: CustomError = errorHandler.handleThrownObject(err, 'MondayActionController.deprecated');
            next(error);
        }
    }
}

export default new MondayActionController;