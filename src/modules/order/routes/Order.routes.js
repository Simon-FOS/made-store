import express from 'express';
import * as controller from '../controllers/Order.controller.js';
import moduleView from '../../../middlewares/moduleViews.js';

const router = express.Router();

router.use(moduleView('order'))

router.post('/initiate', controller.initiatePayment);
router.get('/verify', controller.verifyPaystackTransaction);


export default router;
