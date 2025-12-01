'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      payment_provider: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'paystack',
      },
      transaction_reference: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'success', 'failed'),
        defaultValue: 'pending',
        allowNull: false,
      },
      metadata: {
        type: Sequelize.JSONB, // extra info from Paystack
        allowNull: true,
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payments');
  },
};
