'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('permissions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add unique index on name
    await queryInterface.addIndex('permissions', {
      fields: ['name'],
      unique: true,
      where: {
        deleted_at: null
      },
      name: 'permissions_name_unique_not_deleted'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('permissions', 'permissions_name_unique_not_deleted');
    await queryInterface.dropTable('permissions');
  }
};
