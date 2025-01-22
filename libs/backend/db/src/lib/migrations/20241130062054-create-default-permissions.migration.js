'use strict';
const { v4: uuidv4 } = require('uuid');

const permissions = [
  // Access Apps
  { name: 'ACCESS_DEALER_APP', label: 'access dealer app' },
  { name: 'ACCESS_DEPOT_APP', label: 'access depot app' },
  { name: 'ACCESS_ADMIN_PORTAL', label: 'access admin portal' },
  { name: 'ACCESS_DRIVER_APP', label: 'access driver app' },

  // User Management
  { name: 'CREATE_USER', label: 'create user' },
  { name: 'DELETE_USER', label: 'delete user' },
  { name: 'UPDATE_USER', label: 'update user' },

  // Role Management
  { name: 'CREATE_ROLE', label: 'create role' },
  { name: 'DELETE_ROLE', label: 'delete role' },
  { name: 'UPDATE_ROLE', label: 'update role' },

  // Permission Management
  { name: 'CREATE_PERMISSION', label: 'create permission' },
  { name: 'DELETE_PERMISSION', label: 'delete permission' },
  { name: 'UPDATE_PERMISSION', label: 'update permission' },
  { name: 'GIVE_PERMISSION_TO_ROLE', label: 'give permission to role' },

  // Role Assignment
  { name: 'ASSIGN_ROLE_TO_USER', label: 'assign role to user' },

  // OTP Management
  { name: 'CREATE_OTP', label: 'create otp' },
  { name: 'DELETE_OTP', label: 'delete otp' },
  { name: 'UPDATE_OTP', label: 'update otp' },

  // Password Reset
  { name: 'CREATE_PASSWORD_RESET', label: 'create password-reset' },
  { name: 'DELETE_PASSWORD_RESET', label: 'delete password-reset' },
  { name: 'UPDATE_PASSWORD_RESET', label: 'update password-reset' },

  // Notification Management
  { name: 'CREATE_NOTIFICATION', label: 'create notification' },
  { name: 'DELETE_NOTIFICATION', label: 'delete notification' },
  { name: 'UPDATE_NOTIFICATION', label: 'update notification' },
  { name: 'MARK_NOTIFICATION_AS_READ', label: 'mark notification as read' },

  // Settings Management
  { name: 'CREATE_SETTING', label: 'create setting' },
  { name: 'DELETE_SETTING', label: 'delete setting' },
  { name: 'UPDATE_SETTING', label: 'update setting' },

  // Activity Log
  { name: 'CREATE_ACTIVITY_LOG', label: 'create activity log' },
  { name: 'DELETE_ACTIVITY_LOG', label: 'delete activity log' },
  { name: 'UPDATE_ACTIVITY_LOG', label: 'update activity log' },

  // Brand Management
  { name: 'CREATE_BRAND', label: 'create brand' },
  { name: 'DELETE_BRAND', label: 'delete brand' },
  { name: 'UPDATE_BRAND', label: 'update brand' },

  // Station Management
  { name: 'CREATE_STATION', label: 'create station' },
  { name: 'DELETE_STATION', label: 'delete station' },
  { name: 'UPDATE_STATION', label: 'update station' },

  // Catalogue Management
  { name: 'CREATE_BRAND_CATALOGUE', label: 'create brand catalogue' },
  { name: 'DELETE_BRAND_CATALOGUE', label: 'delete brand catalogue' },
  { name: 'UPDATE_BRAND_CATALOGUE', label: 'update brand catalogue' },

  // Inventory Management
  { name: 'CREATE_INVENTORY', label: 'create inventory' },
  { name: 'DELETE_INVENTORY', label: 'delete inventory' },
  { name: 'UPDATE_INVENTORY', label: 'update inventory' },

  // Cart Management
  { name: 'CREATE_CART', label: 'create cart' },
  { name: 'UPDATE_CART', label: 'update cart' },
  { name: 'DELETE_CART', label: 'delete cart' },

  // Order Management
  { name: 'CREATE_ORDER', label: 'create order' },
  { name: 'UPDATE_ORDER', label: 'update order' },
  { name: 'DELETE_ORDER', label: 'delete order' },

  // Dispatch Management
  { name: 'CREATE_DISPATCH', label: 'create dispatch' },
  { name: 'DELETE_DISPATCH', label: 'delete dispatch' },
  { name: 'UPDATE_DISPATCH', label: 'update dispatch' },
  { name: 'VIEW_DISPATCH', label: 'view dispatch' },
  { name: 'CONFIRM_VIA_SCANNING', label: 'confirm via scanning' },

  // Driver Management
  { name: 'CREATE_DRIVER', label: 'create driver' },
  { name: 'DELETE_DRIVER', label: 'delete driver' },
  { name: 'UPDATE_DRIVER', label: 'update driver' },
  { name: 'VIEW_DRIVER', label: 'view driver' },

  // Transporter Management
  { name: 'CREATE_TRANSPORTER', label: 'create transporter' },
  { name: 'DELETE_TRANSPORTER', label: 'delete transporter' },
  { name: 'UPDATE_TRANSPORTER', label: 'update transporter' },
  { name: 'VIEW_TRANSPORTER', label: 'view transporter' },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const permissionsToInsert = permissions.map(permission => ({
      id: uuidv4(),
      name: permission.name,
      label: permission.label,
      created_at: new Date(),
      updated_at: new Date()
    }));

    await queryInterface.bulkInsert('permissions', permissionsToInsert);

    // Get admin role ID
    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'admin admin-portal' LIMIT 1;`
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
      name: permissions.map(permission => permission.name)
    }, {});
  }
};
