import express from 'express';
import authorize from '../middlewares/authorize.js';
import { listByDate, myHistory, checkIn, checkOut, upsert, statsByDate } from '../controllers/attendanceController.js';

const router = express.Router();

// HR: list for date
router.get('/', authorize(['hr']), listByDate);

// Self: my history
router.get('/me', authorize(['employee', 'hr']), myHistory);

// Stats by date
router.get('/stats', authorize(['employee', 'hr']), statsByDate);

// Employee actions
router.post('/check-in', authorize(['employee', 'hr']), checkIn);
router.post('/check-out', authorize(['employee', 'hr']), checkOut);

// HR upsert
router.post('/upsert', authorize(['hr']), upsert);

export default router;
