'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventory', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      stationId: {
        field: 'station_id',
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'stations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      catalogueId: {
        field: 'catalogue_id',
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'catalogues',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        field: 'deleted_at',
        type: Sequelize.DATE,
        allowNull: true
      },
    });

    await queryInterface.addIndex('inventory', ['station_id', 'catalogue_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('inventory');
  }
}; 