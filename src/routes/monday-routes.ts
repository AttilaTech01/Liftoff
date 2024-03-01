import {Router} from 'express';
import mondayActionController from '../controllers/monday-action-controller';
import authenticationMiddleware from '../middlewares/authentication';

const router = Router();

//UTILITIES
router.post('/utilities/copy-columns-content', authenticationMiddleware, mondayActionController.copyColumnsContent);

//DATES
router.post('/dates/check-all-dates-status', authenticationMiddleware, mondayActionController.checkAllDatesStatusCondition);
router.post('/dates/check-all-dates-empty', authenticationMiddleware, mondayActionController.checkAllDatesEmptyCondition);
router.post('/dates/check-date-status', authenticationMiddleware, mondayActionController.checkDateStatusCondition);
router.post('/dates/check-date-empty', authenticationMiddleware, mondayActionController.checkDateEmptyCondition);

//DUPLICATES
router.post('/duplicates/check-all-duplicates', authenticationMiddleware, mondayActionController.checkAllDuplicates);
router.post('/duplicates/check-duplicates', authenticationMiddleware, mondayActionController.checkDuplicates);

//FORMULAS
router.post('/formulas/apply-formula', authenticationMiddleware, mondayActionController.applyFormula);

//IDS
router.post('/ids/auto-copy', authenticationMiddleware, mondayActionController.autoCopy);
router.post('/ids/auto-id', authenticationMiddleware, mondayActionController.autoId);
router.post('/ids/auto-number', authenticationMiddleware, mondayActionController.autoNumber);

//NAMES
router.post('/names/rename-item', authenticationMiddleware, mondayActionController.updateItemName);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DEPRECATED
router.post('/deprecated', authenticationMiddleware, mondayActionController.deprecated);

export default router;
