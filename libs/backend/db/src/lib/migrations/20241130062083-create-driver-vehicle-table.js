'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('driver_vehicle', {
      driverId: {
        field: 'driver_id',
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'drivers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      vehicleId: {
        field: 'vehicle_id',
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'vehicles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      }
    });

    // Add composite primary key
    await queryInterface.addConstraint('driver_vehicle', {
      fields: ['driver_id', 'vehicle_id'],
      type: 'primary key',
      name: 'driver_vehicle_pkey'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('driver_vehicle');
  }
};
