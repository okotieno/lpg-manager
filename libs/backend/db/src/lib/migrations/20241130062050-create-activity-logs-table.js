'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("activity_logs", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "action",
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: "description",
      },
      type: {
        type: Sequelize.ENUM('INFO', 'WARNING', 'ERROR', 'SUCCESS'),
        defaultValue: 'INFO',
        allowNull: false,
        field: "type",
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
        field: "metadata",
      },
      ipAddress: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "ip_address",
      },
      userAgent: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "user_agent",
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
        field: "created_at",
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
        field: "updated_at",
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: "deleted_at",
      },
    });

  },

  async down(queryInterface) {
    await queryInterface.dropTable("activity_logs");
  }
}; 