'use strict';
const { v4: uuidv4 } = require('uuid');

const permissions = [
  // User Management
  'create user',
  'delete user',
  'update user',

  // Role Management
  'create role',
  'delete role',
  'update role',

  // Permission Management
  'create permission',
  'delete permission',
  'update permission',
  'give permission to role',

  // Role Assignment
  'assign role to user',

  // OTP Management
  'create otp',
  'delete otp',
  'update otp',

  // Password Reset
  'create password-reset',
  'delete password-reset',
  'update password-reset',

  // Notification Management
  'create notification',
  'delete notification',
  'update notification',
  'mark notification as read',

  // Settings Management
  'create setting',
  'delete setting',
  'update setting',

  // Activity Log
  'create activity log',
  'delete activity log',
  'update activity log',

  // Brand
  'create brand',
  'delete brand',
  'update brand',
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const permissionsToInsert = permissions.map(permission => ({
      id: uuidv4(),
      name: permission,
      created_at: new Date(),
      updated_at: new Date()
    }));

    await queryInterface.bulkInsert('permissions', permissionsToInsert);

    // Get admin role ID
    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'admin' LIMIT 1;`
    );

    if (adminRole[0]) {
      // Get all permission IDs
      const [allPermissions] = await queryInterface.sequelize.query(
        `SELECT id FROM permissions;`
      );

      // Create permission_role entries for admin role
      const permissionRoleEntries = allPermissions.map(permission => ({
        role_id: adminRole[0].id,
        permission_id: permission.id,
        created_at: new Date(),
        updated_at: new Date()
      }));

      await queryInterface.bulkInsert('permission_role', permissionRoleEntries);
    }
  },

  async down(queryInterface) {
    // First remove all permission_role entries
    await queryInterface.bulkDelete('permission_role', null, {});

    // Then remove all permissions
    await queryInterface.bulkDelete('permissions', {
      name: permissions
    }, {});
  }
};
