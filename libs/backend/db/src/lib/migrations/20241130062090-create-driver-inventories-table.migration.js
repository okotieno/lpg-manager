'use strict';

const DriverInventoryStatus = {
  ASSIGNED: 'ASSIGNED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERING: 'DELIVERING',
  DRIVER_FROM_DEPOT_CONFIRMED: 'DRIVER_FROM_DEPOT_CONFIRMED',
  DRIVER_TO_DEALER_CONFIRMED: 'DRIVER_TO_DEALER_CONFIRMED',
  DEALER_FROM_DRIVER_CONFIRMED: 'DEALER_FROM_DRIVER_CONFIRMED',
  DELIVERED: 'DELIVERED',
  RETURNED: 'RETURNED',
};

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, { DataTypes }) {
    await queryInterface.createTable('driver_inventories', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      driver_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'drivers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      inventory_item_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'inventory_items',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      dispatch_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'dispatches',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: DataTypes.ENUM(...Object.values(DriverInventoryStatus)),
        allowNull: false,
        defaultValue: DriverInventoryStatus.ASSIGNED,
      },
      assigned_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      returned_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      driverToDealerConfirmedAt: {
        field: 'driver_to_dealer_confirmed_at',
        type: DataTypes.DATE,
        allowNull: true,
      },
      dealerFromDriverConfirmedAt: {
        field: 'dealer_from_driver_confirmed_at',
        type: DataTypes.DATE,
        allowNull: true,
      },
      recipientStationId: {
        field: 'recipient_station_id',
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'stations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('driver_inventories', ['driver_id']);
    await queryInterface.addIndex('driver_inventories', ['inventory_item_id']);
    await queryInterface.addIndex('driver_inventories', ['dispatch_id']);
    await queryInterface.addIndex('driver_inventories', ['status']);
    await queryInterface.addIndex('driver_inventories', ['recipient_station_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('driver_inventories');
  },
};
