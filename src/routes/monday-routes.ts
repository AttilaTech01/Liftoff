import {Router} from 'express';
import depMondayController from '../controllers/DEP-monday-controller';
import mondayController from '../controllers/monday-controller';
import authenticationMiddleware from '../middlewares/authentication';

const router = Router();

//integrationId: 239133538
//recipeId : 30171042
router.post('/rename-item', authenticationMiddleware, mondayController.updateItemName);

//DEPRECATED
router.post('/execute_action', authenticationMiddleware, depMondayController.executeAction);
router.post('/get_remote_list_options', authenticationMiddleware, depMondayController.getRemoteListOptions);


export default router;
