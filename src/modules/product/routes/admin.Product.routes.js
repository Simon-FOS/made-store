import express from 'express';
import useModuleViews from '../../../middlewares/moduleViews.js';
import { withPagination } from '../../../middlewares/paginations.js';
import * as controller from '../controllers/admin.Product.controller.js';
import upload from '../../../config/multerConfig.js';
import setSection from '../../../middlewares/uploadLocation.js';

const router = express.Router();

router.use(useModuleViews('product'));

// Admin view routes
router.route('/')
  .get(withPagination(10), controller.findAll)
  .post(
    setSection('products'), // Middleware to set the section for dynamic folder creation
    upload.array('image_url', 1),
    controller.create
  );

router.get('/create', controller.renderCreate);

router.route('/:id')
  .get(controller.findById)
  .put(
    setSection('products'), // Middleware to set the section for dynamic folder creation
    upload.array('image_url', 1),
    controller.update
  )
  .delete(controller.destroy);

export default router;
