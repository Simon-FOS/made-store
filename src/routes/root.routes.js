import { Router } from "express";
import {
    index_view, about_view, contact_view, prices_view, add_to_cart, get_cart_count, checkout_view, consent_view, policy_view

} from "../controllers/root.controller.js";
import { dashboard_view } from "../controllers/admin.controller.js";

const router = Router();

// Home Route
router.get('/', index_view);
router.get('/about', about_view);
router.get('/contact', contact_view);
router.get('/prices', prices_view);
router.post('/cart/add', add_to_cart);
router.get('/cart/count', get_cart_count);
router.get('/checkout', checkout_view);
router.get('/admin', dashboard_view);
router.get('/consent', consent_view);
router.get('/policy', policy_view);




export default router;