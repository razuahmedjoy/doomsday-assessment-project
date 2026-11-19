import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';

const router = Router();

router.post('/reset', adminController.reset);

export default router;
