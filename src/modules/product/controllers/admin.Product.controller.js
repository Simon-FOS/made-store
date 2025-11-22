import * as service from '../services/admin.Product.service.js';
import * as categoryService from '../../category/services/admin.Category.service.js';

export const findAll = async (req, res) => {
  const { page, limit, offset } = req.pagination
  try {
    const data = await service.findAll({ limit, offset });
    res.status(200).render('./admins/product_list', {
      success: true,
      pageTitle: "Admin",
      layout: "admin",
      PageTitle: "Admin",
      products: data.products,
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      currentPage: page
    });
  } catch (err) {
    console.log(err)
    res.status(500).render('errors/500', { error: err });
  }
};

export const findById = async (req, res) => {
  try {
    const data = await service.findById(req.params.id);
    const categories = await categoryService.findAll({ limit: 1000, offset: 0 });
    res.status(200).render('./admins/product_update', {
      success: true,
      pageTitle: "Update Record",
      layout: "admin",
      PageTitle: "Admin",
      categories: categories.categorys,
      product: data,
    });
  } catch (err) {
    console.log(err)
    res.status(404).render('errors/404', { error: err });
  }
};

export const create = async (req, res) => {
  try {

    //get request files
    const files = req.files;
    if (files && files.length > 0) {
      // Assuming only one file is uploaded for image_url
      req.body.image_url = files[0].path; // or files[0].filename based on your storage setup

    }

    const data = await service.create(req.body);
    res.status(201).json({ success: true, redirectTo: "/admin/product", message: "Created successfully" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err, message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    //get request files
    const files = req.files;
    if (files && files.length > 0) {
      // Assuming only one file is uploaded for image_url
      req.body.image_url = files[0].path; // or files[0].filename based on your storage setup

    }
    const data = await service.update(req.params.id, req.body);
    res.status(200).json({ success: true, data, redirectTo: `/admin/product/${req.params.id}`, message: "Updated successfully" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const destroy = async (req, res) => {
  try {
    const data = await service.destroy(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully', redirectTo: "/admin/product" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const renderCreate = async (req, res) => {
  try {

    const categories = await categoryService.findAll({ limit: 1000, offset: 0 });
    res.status(200).render('./admins/product_create', {
      pageTitle: "Create Product",
      layout: "admin",
      categories: categories.categorys,
      PageTitle: "Admin"
    });
  } catch (err) {
    console.log(err)
    res.status(500).render('errors/500', { error: err });
  }
};