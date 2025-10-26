import express from 'express';
import { createActivity, listActivities } from '../controllers/activityController.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

// GET /api/activities?limit=5
router.get('/', authorize(), listActivities);

// POST /api/activities (body: { action, type, meta, actorId? })
router.post('/', authorize(), createActivity);

export default router;
