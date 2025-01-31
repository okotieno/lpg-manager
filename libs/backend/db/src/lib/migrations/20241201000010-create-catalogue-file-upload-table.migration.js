'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, { DataTypes, fn }) {
    await queryInterface.createTable('catalogue_file_uploads', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      catalogueId: {
        field: 'catalogue_id',
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'catalogues',
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

    await queryInterface.addIndex('catalogue_file_uploads', [
      'catalogue_id',
      'file_upload_id',
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('catalogue_file_uploads');
  },
};
