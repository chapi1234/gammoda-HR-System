import express from 'express';
import upload from '../config/multer.js';
import authorize from '../middlewares/authorize.js';
import { registerCandidate, loginCandidate, getMe, updateProfile, applyToJob, listCandidates, updateApplicationStatus } from '../controllers/candidateController.js';

const router = express.Router();

router.post('/register', registerCandidate);
router.post('/login', loginCandidate);
// List all candidates (HR)
router.get('/', authorize(['hr','admin']), listCandidates);
router.get('/me', authorize(), getMe);
router.patch('/profile', authorize(), updateProfile);

// Apply (supports anonymous or authenticated). resume file field -> 'resume'
router.post('/apply', upload.single('resume'), applyToJob);
    
// Update application status (shortlist/reject/hire) - HR/Admin only
router.patch('/applications/:id/status', authorize(['hr','admin']), updateApplicationStatus);

export default router;
