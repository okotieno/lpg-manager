'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('consolidated_orders', 'status', {
      type: Sequelize.ENUM(
        'CREATED',
        'DRIVER_TO_DEALER_CONFIRMED',
        'DEALER_FROM_DRIVER_CONFIRMED',
        'COMPLETED'
      ),
      allowNull: false,
      defaultValue: 'CREATED'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('consolidated_orders', 'status');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_consolidated_orders_status;');
  }
};
