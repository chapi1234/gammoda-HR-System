import express from 'express';
import authorize from '../middlewares/authorize.js';
import {
  createPayroll,
  getPayrolls,
  updatePayroll,
  deletePayroll
} from '../controllers/payrollController.js';

const router = express.Router();

// HR: create payroll
router.post('/', authorize('hr'), createPayroll);
// HR/Employee: get payrolls
router.get('/', authorize(['hr', 'employee']), getPayrolls);
// HR: update payroll
router.patch('/:id', authorize('hr'), updatePayroll);
// HR: delete payroll
router.delete('/:id', authorize('hr'), deletePayroll);

export default router;
