'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'dispatch_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'dispatches',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('orders', 'dispatch_id');
  }
}; 