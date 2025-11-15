import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import { withPagination } from '../../../middlewares/paginations.js';
import * as controller from '../controllers/Product.controller.js';

const router = express.Router();

router.use(useModuleViews('product'));

// Public view routes
router.get('/', withPagination(10), controller.findAll);
router.get('/:slug', controller.findBySlug);
router.get('/:id', controller.findById);

export default router;
