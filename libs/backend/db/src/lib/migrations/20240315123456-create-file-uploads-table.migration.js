'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('file_uploads', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        field: 'name',
        type: Sequelize.STRING,
        allowNull: true
      },
      encoding: {
        field: 'encoding',
        type: Sequelize.STRING,
        allowNull: true
      },
      size: {
        field: 'size',
        type: Sequelize.FLOAT,
        allowNull: true
      },
      mimetype: {
        field: 'mimetype',
        type: Sequelize.STRING,
        allowNull: true
      },
      originalName: {
        field: 'original_name',
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('file_uploads');
  }
}; 