import {Router} from 'express';
import mondayActionController from '../controllers/monday-action-controller';
//import mondayGetterController from '../controllers/monday-getter-controller';
import authenticationMiddleware from '../middlewares/authentication';

const router = Router();
//FORMULAS
//integrationId: 240018139, 245343033
//recipeId : 30172153, 30180577
router.post('/apply-formula', authenticationMiddleware, mondayActionController.applyFormula);

//COPY CONTENT
//integrationId: 242184509, 245096112
//recipeId: 30175811, 30180045
router.post('/copy-columns-content', authenticationMiddleware, mondayActionController.copyColumnsContent);

//GROUP ACTIONS
//integrationId: 245738684
//recipeId: 30181398
router.post('/check-duplicates', authenticationMiddleware, mondayActionController.checkDuplicates);

//ITEM RENAMING
//integrationId: 239133538, 245268407
//recipeId: 30171042, 30180578
router.post('/rename-item', authenticationMiddleware, mondayActionController.updateItemName);

//------------------------------------------------------------------------------------------------------------
//GETTERS

export default router;
