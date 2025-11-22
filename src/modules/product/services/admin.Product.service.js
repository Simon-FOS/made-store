import db from '../../../models/index.cjs';
import { getPublicIdFromUrl } from '../../../utils/utils.js';
import cloudinary from '../../../config/cloudinaryConfig.js';

export const findAll = async ({ limit, offset }) => {
  try {
    const { rows: products, count: totalItems } = await db.Product.findAndCountAll({
      limit,
      offset,
      distinct: true,
      order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
      include: [
        {
          model: db.ProductCategory,
          as: 'productCategory',
          include: [{ model: db.Category, as: 'category' }]
        }
      ]
    });

    return {
      products,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    };
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching records: ' + error.message);
  }
};


export const findById = async (id) => {
  try {
    const item = await db.Product.findByPk(id, {
      include: [
        {
          model: db.ProductCategory,
          as: 'productCategory',
          include: [{ model: db.Category, as: 'category' }]
        }
      ]
    });

    if (!item) throw new Error('Not found');
    return item;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching record: ' + error.message);
  }
};


export const create = async (data) => {
  const { categoryId, ...productData } = data;

  try {
    const product = await db.Product.create(productData);

    await db.ProductCategory.create({
      productId: product.id,
      categoryId
    });

    return product;
  } catch (error) {
    console.log(error);
    throw new Error('Error creating record: ' + error.message);
  }
};

export const update = async (id, data) => {
  try {
    const item = await db.Product.findByPk(id);

    if (!item) throw new Error('Not found');

    const { categoryId, ...updateData } = data;

    // Handle image replacement logic (preserved)
    if (updateData.image_url === undefined || updateData.image_url === null || updateData.image_url === '') {
      updateData.image_url = item.image_url;
    }

    if (updateData.image_url && item.image_url && updateData.image_url !== item.image_url) {
      const publicId = getPublicIdFromUrl(item.image_url);

      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log('Error deleting image:', err);
      }
    }

    // Update product
    await item.update(updateData);

    // Update category in pivot table
    const pivot = await db.ProductCategory.findOne({
      where: { productId: id }
    });

    if (pivot) {
      await pivot.update({ categoryId });
    } else {
      await db.ProductCategory.create({
        productId: id,
        categoryId
      });
    }

    return item;
  } catch (error) {
    console.log(error);
    throw new Error('Error updating record: ' + error.message);
  }
};


export const destroy = async (id) => {
  try {
    const item = await db.Product.findByPk(id);
    if (!item) throw new Error('Not found');

    // delete pivot table entry
    await db.ProductCategory.destroy({
      where: { productId: id }
    });

    // delete cloudinary image
    if (item.image_url) {
      const publicId = getPublicIdFromUrl(item.image_url);
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log('Error deleting image:', err);
      }
    }

    return await item.destroy();
  } catch (error) {
    console.log(error);
    throw new Error('Error deleting record: ' + error.message);
  }
};
