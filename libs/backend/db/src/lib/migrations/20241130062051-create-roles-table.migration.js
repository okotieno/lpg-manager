'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create roles table
    await queryInterface.createTable('roles', {
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
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add unique index on name where deleted_at is null
    await queryInterface.addIndex('roles', {
      fields: ['name'],
      unique: true,
      where: {
        deleted_at: null
      },
      name: 'roles_name_unique_not_deleted'
    });

    // Create role_user junction table
    await queryInterface.createTable('role_user', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      station_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'stations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      }
    });

    // Add unique constraint for role_id and user_id combination
    await queryInterface.addConstraint('role_user', {
      fields: ['role_id', 'user_id'],
      type: 'unique',
      name: 'unique_role_user'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('role_user', 'unique_role_user');
    await queryInterface.dropTable('role_user');
    await queryInterface.removeIndex('roles', 'roles_name_unique_not_deleted');
    await queryInterface.dropTable('roles');
  }
};
