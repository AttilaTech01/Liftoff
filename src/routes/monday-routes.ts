import {Router} from 'express';
import mondayController from '../controllers/monday-controller';
import authenticationMiddleware from '../middlewares/authentication';

const router = Router();

//integrationId: 239133538
//recipeId : 30171042
router.post('/rename-item', authenticationMiddleware, mondayController.updateItemName);

export default router;
