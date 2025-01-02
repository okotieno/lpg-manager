'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      cartId: {
        field: 'cart_id',
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'carts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      depotId: {
        field: 'depot_id',
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'stations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      dealerId: {
        field: 'dealer_id',
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'stations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      totalPrice: {
        field: 'total_price',
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          'PENDING',
          'CONFIRMED',
          'DELIVERING',
          'COMPLETED',
          'REJECTED',
          'CANCELLED',
          'RETURNED'
        ),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      cancelledAt: {
        field: 'cancelled_at',
        type: Sequelize.DATE,
        allowNull: true,
      },
      returnedAt: {
        field: 'returned_at',
        type: Sequelize.DATE,
        allowNull: true,
      },
      statusComment: {
        field: 'status_comment',
        type: Sequelize.STRING,
        allowNull: true,
      },
      depotToDriverConfirmedAt: {
        field: 'depot_to_driver_confirmed_at',
        type: Sequelize.DATE,
        allowNull: true,
      },
      driverFromDepotConfirmedAt: {
        field: 'driver_from_depot_confirmed_at',
        type: Sequelize.DATE,
        allowNull: true,
      },
      releasedFromDepotAt: {
        field: 'released_for_delivery_at',
        type: Sequelize.DATE,
        allowNull: true,
      },
      driverToDealerConfirmedAt: {
        field: 'driver_to_dealer_confirmed_at',
        type: Sequelize.DATE,
        allowNull: true,
      },
      dealerFromDriverConfirmedAt: {
        field: 'dealer_from_depot_confirmed_at',
        type: Sequelize.DATE,
        allowNull: true,
      },
      dealerToDriverConfirmedAt: {
        field: 'dealer_to_driver_confirmed_at',
        type: Sequelize.DATE,
        allowNull: true,
      },
      driverFromDealerConfirmedAt: {
        field: 'driver_from_dealer_confirmed_at',
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        field: 'deleted_at',
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('orders');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS enum_orders_status;'
    );
  },
};
