import express from 'express';
import * as controller from '../controllers/Order.controller.js';
import moduleView from '../../../middlewares/moduleViews.js';
import bodyParser from 'body-parser';

const router = express.Router();

router.use(moduleView('order'))

router.post('/initiate', controller.initiatePayment);
router.get('/verify', controller.verifyPaystackTransaction);
router.post('/paystack/webhook', bodyParser.raw({ type: '*/*' }), controller.paystackWebhook);

export default router;
