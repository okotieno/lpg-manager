'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('inventory_changes', 'reference_type', {
      type: Sequelize.ENUM('MANUAL', 'ORDER', 'RETURN', 'DISPATCH', 'TRANSFER', 'ADJUSTMENT'),
      allowNull: false,
      defaultValue: 'MANUAL',
    });

    await queryInterface.addColumn('inventory_changes', 'reference_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    await queryInterface.addIndex('inventory_changes', ['reference_type', 'reference_id']);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('inventory_changes', 'reference_id');
    await queryInterface.removeColumn('inventory_changes', 'reference_type');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_inventory_changes_reference_type;');
  },
}; 