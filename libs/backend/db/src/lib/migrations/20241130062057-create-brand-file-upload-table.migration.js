'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('brand_file_uploads', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
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
      fileUploadId: {
        field: 'file_upload_id',
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'file_uploads',
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

    await queryInterface.addIndex('brand_file_uploads', ['brand_id', 'file_upload_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('brand_file_uploads');
  }
};
