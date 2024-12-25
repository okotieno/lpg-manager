'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
        field: 'updated_at',
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'deleted_at',
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
      roleId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'role_id',
        references: {
          model: 'roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      stationId: {
        type: Sequelize.UUID,
        allowNull: true,
        field: 'station_id',
        references: {
          model: 'stations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
        field: 'created_at',
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
        field: 'updated_at',
      }
    });

    // Add composite unique constraint
    await queryInterface.addConstraint('role_user', {
      fields: ['user_id', 'role_id', 'station_id'],
      type: 'unique',
      name: 'unique_user_role_station'
    });
  },

  async down(queryInterface) {
    // Drop the index first
    await queryInterface.removeIndex('roles', 'roles_name_unique_not_deleted');
    
    // Then drop the tables
    await queryInterface.dropTable('role_user');
    await queryInterface.dropTable('roles');
  }
};
