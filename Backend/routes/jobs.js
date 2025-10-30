import express from 'express';
import authorize from '../middlewares/authorize.js';
import { createJob, listJobs, getJob, updateJob, deleteJob } from '../controllers/jobController.js';

const router = express.Router();

// Public listing & detail
router.get('/', listJobs);
router.get('/:id', getJob);

// Admin/HR protected
router.post('/', authorize(['hr','admin']), createJob);
router.patch('/:id', authorize(['hr','admin']), updateJob);
router.delete('/:id', authorize(['hr','admin']), deleteJob);

export default router;
