import express from 'express';
import mondayRoutes from './monday-routes';

const router = express.Router();

router.use(mondayRoutes);

router.get('/health', function(req, res) {
  return res.status(200).send({
    message: 'Healthy',
  });
});

export default router;
