import {Router} from 'express';
import mondayActionController from '../controllers/monday-action-controller';
import authenticationMiddleware from '../middlewares/authentication';

const router = Router();

//COPY CONTENT
//integrationId: 242184509, 245096112
//recipeId: 30175811, 30180045
router.post('/copy-columns-content', authenticationMiddleware, mondayActionController.copyColumnsContent);

//DATES
//integrationId: 253298894
//recipeId: 30192621
router.post('/check-all-dates', authenticationMiddleware, mondayActionController.checkAllDates);
//integrationId: 253299306
//recipeId: 30192624
router.post('/check-date', authenticationMiddleware, mondayActionController.checkDate);

//DOUBLONS
//integrationId: 245738684
//recipeId: 30181398
router.post('/check-all-duplicates', authenticationMiddleware, mondayActionController.checkAllDuplicates);
//integrationId: 246741839
//recipeId: 30182862
router.post('/check-duplicates', authenticationMiddleware, mondayActionController.checkDuplicates);

//FORMULAS
//integrationId: 240018139, 245343033
//recipeId : 30172153, 30180577
router.post('/apply-formula', authenticationMiddleware, mondayActionController.applyFormula);

//IDS
//integrationId: 252431281
//recipeId: 30191128
router.post('/auto-id', authenticationMiddleware, mondayActionController.autoId);
//integrationId: 251833390
//recipeId: 30189637
router.post('/auto-number', authenticationMiddleware, mondayActionController.autoNumber);

//ITEM RENAMING
//integrationId: 239133538, 245268407
//recipeId: 30171042, 30180578
router.post('/rename-item', authenticationMiddleware, mondayActionController.updateItemName);

export default router;
