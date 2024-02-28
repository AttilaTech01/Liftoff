import {Router} from 'express';
import mondayActionController from '../controllers/monday-action-controller';
import authenticationMiddleware from '../middlewares/authentication';

const router = Router();

//UTILITIES
//integrationId: 242184509, 245096112
//recipeId: 30175811, 30180045
router.post('/utilities/copy-columns-content', authenticationMiddleware, mondayActionController.copyColumnsContent);

//DATES
//integrationId: 253298894
//recipeId: 30192621
router.post('/dates/check-all-dates-status', authenticationMiddleware, mondayActionController.checkAllDatesStatusCondition);
//integrationId: 254096271
//recipeId: 30192747
router.post('/dates/check-all-dates-empty', authenticationMiddleware, mondayActionController.checkAllDatesEmptyCondition);
//integrationId: 253299306
//recipeId: 30192624
router.post('/dates/check-date-status', authenticationMiddleware, mondayActionController.checkDateStatusCondition);
//integrationId: 253560537
//recipeId: 30192750
router.post('/dates/check-date-empty', authenticationMiddleware, mondayActionController.checkDateEmptyCondition);

//DUPLICATES
//integrationId: 245738684
//recipeId: 30181398
router.post('/duplicates/check-all-duplicates', authenticationMiddleware, mondayActionController.checkAllDuplicates);
//integrationId: 246741839
//recipeId: 30182862
router.post('/duplicates/check-duplicates', authenticationMiddleware, mondayActionController.checkDuplicates);

//FORMULAS
//integrationId: 240018139, 245343033
//recipeId : 30172153, 30180577
router.post('/formulas/apply-formula', authenticationMiddleware, mondayActionController.applyFormula);

//IDS
//integrationId: 266160326
//recipeId: 30210752
router.post('/ids/auto-copy', authenticationMiddleware, mondayActionController.autoCopy);
//integrationId: 252431281
//recipeId: 30191128
router.post('/ids/auto-id', authenticationMiddleware, mondayActionController.autoId);
//integrationId: 251833390
//recipeId: 30189637
router.post('/ids/auto-number', authenticationMiddleware, mondayActionController.autoNumber);

//NAMES
//integrationId: 239133538, 245268407
//recipeId: 30171042, 30180578
router.post('/names/rename-item', authenticationMiddleware, mondayActionController.updateItemName);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//DEPRECATED
router.post('/deprecated', authenticationMiddleware, mondayActionController.deprecated);

export default router;
