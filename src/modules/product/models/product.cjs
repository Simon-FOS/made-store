'use strict';
const {
  Model
} = require('sequelize');
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // One-To-One: Product belongs to one Category
      Product.hasOne(models.ProductCategory, {
        foreignKey: 'productId',
        as: 'productCategory'
      });
    }
  }
  Product.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
  });
  Product.beforeCreate((product) => {
    product.slug = slugify(product.name, { lower: true, strict: true });
  });

  Product.beforeUpdate((product) => {
    if (product.changed('name')) {
      product.slug = slugify(product.name, { lower: true, strict: true });
    }
  });

  return Product;
};