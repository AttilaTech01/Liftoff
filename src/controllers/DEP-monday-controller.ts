import depMondayService from '../services/DEP-monday-service';
import TRANSFORMATION_TYPES from '../constants/DEP-transformation';
import depTransformationService from '../services/DEP-transformation-service';

// DEPRECATED - Example given by Monday - TO BE DELETED
class DepMondayController {
  async executeAction(req, res): Promise<void> {
    const { shortLivedToken } = req.session;
    const { payload } = req.body;

    try {
      const { inboundFieldValues } = payload;
      const { boardId, itemId, sourceColumnId, targetColumnId, transformationType } = inboundFieldValues;

      const text = await depMondayService.getColumnValue(shortLivedToken, itemId, sourceColumnId);
      if (!text) {
        return res.status(200).send({});
      }
      const transformedText = depTransformationService.transformText(
        text,
        transformationType ? transformationType.value : 'TO_UPPER_CASE'
      );

      await depMondayService.changeColumnValue(shortLivedToken, boardId, itemId, targetColumnId, transformedText);

      return res.status(200).send({});
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'internal server error' });
    }
  }

  async getRemoteListOptions(req, res): Promise<void> {
    try {
      return res.status(200).send(TRANSFORMATION_TYPES);
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'internal server error' });
    }
  }
}

export default new DepMondayController;