'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'consolidated_order_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'consolidated_orders',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addIndex('orders', ['consolidated_order_id']);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('orders', 'consolidated_order_id');
  }
}; 