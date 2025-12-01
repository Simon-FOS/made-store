'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'items' });
      Order.hasOne(models.Payment, { foreignKey: 'order_id', as: 'payment' });
    }
  }

  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
        allowNull: false
      },
      tracking_id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: uuidv4(),
      },
      customer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customer_email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customer_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      payment_status: {
        type: DataTypes.ENUM('pending', 'paid', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'orders',
    }
  );

  return Order;
};
