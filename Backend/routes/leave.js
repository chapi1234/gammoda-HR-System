import express from 'express';
import authorize from '../middlewares/authorize.js';
import {
  createLeave,
  listLeaves,
  reviewLeave,
  updateLeave,
  deleteLeave
} from '../controllers/leaveController.js';

const router = express.Router();

// Employee: create leave
router.post('/', authorize(['employee', 'hr']), createLeave);
// List: HR gets all, employee gets own
router.get('/', authorize(['employee', 'hr']), listLeaves);
// HR: approve/reject
router.patch('/:id/review', authorize(['hr']), reviewLeave);
// Employee: update own pending leave
router.patch('/:id', authorize(['employee', 'hr']), updateLeave);
// Employee: delete own pending leave
router.delete('/:id', authorize(['employee', 'hr']), deleteLeave);

export default router;
