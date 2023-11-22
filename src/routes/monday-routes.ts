import {Router} from 'express';
import mondayController from '../controllers/monday-controller';
import authenticationMiddleware from '../middlewares/authentication';

const router = Router();

//integrationId: 240018139
//recipeId : 30172153
router.post('/apply-formula', authenticationMiddleware, mondayController.applyFormula);

//integrationId: 239133538
//recipeId : 30171042
router.post('/rename-item', authenticationMiddleware, mondayController.updateItemName);

export default router;
