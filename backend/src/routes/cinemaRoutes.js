import { Router } from 'express';
import * as cinemaController from '../controllers/cinemaController.js';

const router = Router();

router.get('/', cinemaController.list);
router.post('/', cinemaController.create);
router.get('/:id/booking', cinemaController.booking);

export default router;
