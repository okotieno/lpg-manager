'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
        field: "username",
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "first_name",
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "last_name",
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
        field: "email",
      },
      phone: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
        field: "phone",
      },
      emailVerifiedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: "email_verified_at",
      },
      phoneVerifiedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: "phone_verified_at",
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "password",
      },
      profileDescription: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: "profile_description",
      },
      profilePhotoLink: {
        field: 'profile_photo_link',
        allowNull: true,
        type: DataTypes.STRING,
      },
      lastLoginAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: "last_login_at",
      },
      lastLoginIp: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "last_login_ip",
      },
      lastActivityAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: "last_activity_at",
      },
      rememberToken: {
        type: Sequelize.STRING,
        allowNull: true,
        field: "remember_token",
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

  async down (queryInterface) {
    await queryInterface.dropTable("users");
  }
};
