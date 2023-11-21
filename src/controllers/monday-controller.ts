import initMondayClient from 'monday-sdk-js';
import errorCodes from '../constants/mondayErrorCodes';
import mondayService from '../services/monday-service';


class MondayController {
    //integrationId: 239133538
    //recipeId : 30171042
    async updateItemName(req, res): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = initMondayClient();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields } = payload;
            const { boardId, itemId, nameNewValue } = inputFields;

            await mondayService.updateItemName(boardId, itemId, nameNewValue);

            return res.status(200).send({message: 'Name has been updated successfully'});
        } catch (err) {
            console.log(err);
            return res.status(500).send(errorCodes.generic500());
        }
    }
}

export default new MondayController;