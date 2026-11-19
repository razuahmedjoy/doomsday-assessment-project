import { Router } from 'express';
import * as movieController from '../controllers/movieController.js';

const router = Router();

router.get('/', movieController.list);
router.post('/', movieController.create);
router.patch('/:id', movieController.update);
router.get('/:id/rewatch-order', movieController.rewatchOrder);

export default router;
