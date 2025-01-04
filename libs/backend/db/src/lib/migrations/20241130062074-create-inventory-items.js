'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventory_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      inventoryId: {
        field: 'inventory_id',
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'inventory',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      serialNumber: {
        field: 'serial_number',
        type: Sequelize.STRING,
        allowNull: true,
      },
      batchNumber: {
        field: 'batch_number',
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('AVAILABLE', 'SOLD', 'RESERVED', 'DAMAGED', 'RETURNED'),
        allowNull: false,
        defaultValue: 'AVAILABLE',
      },
      manufactureDate: {
        field: 'manufacture_date',
        type: Sequelize.DATE,
        allowNull: true,
      },
      expiryDate: {
        field: 'expiry_date',
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdBy: {
        field: 'created_by',
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
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

    await queryInterface.addIndex('inventory_items', ['inventory_id']);
    await queryInterface.addIndex('inventory_items', ['serial_number'], {
      unique: true,
      where: {
        deleted_at: null,
      },
    });
    await queryInterface.addIndex('inventory_items', ['batch_number']);
    await queryInterface.addIndex('inventory_items', ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('inventory_items');
  },
}; 