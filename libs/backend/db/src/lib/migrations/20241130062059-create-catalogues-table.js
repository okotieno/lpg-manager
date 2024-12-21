'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('catalogues', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      brandId: {
        field: 'brand_id',
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'brands',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      unit: {
        type: Sequelize.ENUM('KG', 'LITRE'),
        defaultValue: 'KG',
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
      },
    });

    await queryInterface.addIndex('catalogues', ['brand_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('catalogues');
  }
};
