import { Router } from 'express';
import movieRoutes from './movieRoutes.js';
import cinemaRoutes from './cinemaRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.use('/movies', movieRoutes);
router.use('/cinemas', cinemaRoutes);

// Demo helper that wipes all data, so it is not exposed in production.
if (process.env.NODE_ENV !== 'production') router.use('/admin', adminRoutes);

export default router;
