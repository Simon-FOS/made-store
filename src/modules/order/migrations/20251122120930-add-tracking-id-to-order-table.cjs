'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('orders', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn('orders', "tracking_id", { type: Sequelize.UUID, allowNull: true }, { transaction });
    })


  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('orders');
     */
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('orders', 'tracking_id', { transaction });
    })
  }
};
