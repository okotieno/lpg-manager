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
        type: Sequelize.ENUM(
          'PENDING',
          'INITIATED',
          'DELIVERING',
          'COMPLETED',
        ),
        allowNull: false,
        defaultValue: 'PENDING'
      },
      dispatchDate: {
        field: 'dispatch_date',
        type: Sequelize.DATE,
        allowNull: false
      },

      initiatedAt: {
        field: 'initiated_at',
        type: Sequelize.DATE,
        allowNull: true,
      },

      depotToDriverConfirmedAt: {
        field: 'depot_to_driver_confirmed_at',
        type: Sequelize.DATE,
        allowNull: true,
      },

      completedAt: {
        field: 'completed_at',
        type: Sequelize.DATE,
        allowNull: true,
      },

      driverFromDepotConfirmedAt: {
        field: 'driver_from_depot_confirmed_at',
        type: Sequelize.DATE,
        allowNull: true,
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable('dispatches');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_dispatches_status;');
  }
};
