import initMondayClient from 'monday-sdk-js';
import errorCodes from '../constants/mondayErrorCodes';
import mondayService from '../services/monday-service';


class MondayController {
    //integrationId: 240018139
    //recipeId : 30172153
    async applyFormula(req, res): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;
        console.log(JSON.stringify(payload));

        try {
            globalThis.mondayClient = initMondayClient();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields } = payload;
            const { boardId, itemId, formula, columnId } = inputFields;

            await mondayService.applyFormula(formula, itemId, columnId);

            return res.status(200).send({message: 'Formula has been applied successfully'});
        } catch (err) {
            console.log(err);
            return res.status(500).send(errorCodes.generic500());
        }
    }

    //integrationId: 239133538
    //recipeId : 30171042
    async updateItemName(req, res): Promise<void> {
        const { shortLivedToken } = req.session;
        const { payload } = req.body;

        try {
            globalThis.mondayClient = initMondayClient();
            globalThis.mondayClient.setToken(shortLivedToken);
            
            const { inputFields } = payload;
            const { boardId, itemId, nameNewValue, userId } = inputFields;

            await mondayService.updateItemName(boardId, itemId, nameNewValue, userId);

            return res.status(200).send({message: 'Name has been updated successfully'});
        } catch (err) {
            console.log(err);
            return res.status(500).send(errorCodes.generic500());
        }
    }
}

export default new MondayController;