'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, { DataTypes, fn }) {
    await queryInterface.createTable('brand_file_uploads', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      brandId: {
        field: 'brand_id',
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'brands',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      fileUploadId: {
        field: 'file_upload_id',
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'file_uploads',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: fn('NOW'),
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: fn('NOW'),
      },
      deletedAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('brand_file_uploads', [
      'brand_id',
      'file_upload_id',
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('brand_file_uploads');
  },
};
