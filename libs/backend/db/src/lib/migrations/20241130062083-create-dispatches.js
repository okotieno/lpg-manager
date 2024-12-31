'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dispatches', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      transporterId: {
        field: 'transporter_id',
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'transporters',
          key: 'id'
        }
      },
      driverId: {
        field: 'driver_id',
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'drivers',
          key: 'id'
        }
      },
      vehicleId: {
        field: 'vehicle_id',
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'vehicles',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELED'),
        allowNull: false,
        defaultValue: 'PENDING'
      },
      dispatchDate: {
        field: 'dispatch_date',
        type: Sequelize.DATE,
        allowNull: false
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
      }
    });
  }
}; 