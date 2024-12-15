'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('brands', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      companyName: {
        field: 'company_name',
        type: Sequelize.STRING,
        allowNull: true,
      },
      licenceNumber: {
        field: 'licence_number',
        type: Sequelize.STRING,
        allowNull: true,
      },
      licenceDescription: {
        field: 'licence_description',
        type: Sequelize.STRING,
        allowNull: true,
      },
      licenceExpiry: {
        field: 'licence_expiry',
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
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
    await queryInterface.dropTable('brands');
  },
};
