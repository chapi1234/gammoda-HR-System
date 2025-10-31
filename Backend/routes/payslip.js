import express from 'express';
import authorize from '../middlewares/authorize.js';
import { listPayslips, getPayslip, createPayslip, deletePayslip } from '../controllers/payslipController.js';

const router = express.Router();

router.get('/', authorize(['hr','employee']), listPayslips);
router.get('/:id', authorize(['hr','employee']), getPayslip);
router.post('/', authorize(['hr']), createPayslip);
router.delete('/:id', authorize(['hr']), deletePayslip);

export default router;
