'use strict';
const { v4: uuidv4 } = require('uuid');

const rolePermissions = {
  SUPER_ADMIN: {
    label: 'super admin',
    permissions: '*' // Special case - gets all permissions
  },
  ADMIN_PORTAL_ADMIN: {
    label: 'admin admin-portal',
    permissions: [
      // Access Apps
      'ACCESS_ADMIN_PORTAL',
      // User Management
      'CREATE_USER', 'DELETE_USER', 'UPDATE_USER',
      // Role Management
      'CREATE_ROLE', 'DELETE_ROLE', 'UPDATE_ROLE',
      // Permission Management
      'CREATE_PERMISSION', 'DELETE_PERMISSION', 'UPDATE_PERMISSION', 'GIVE_PERMISSION_TO_ROLE',
      // Role Assignment
      'ASSIGN_ROLE_TO_USER',
      // Settings Management
      'CREATE_SETTING', 'DELETE_SETTING', 'UPDATE_SETTING',
      // Brand Management
      'CREATE_BRAND', 'DELETE_BRAND', 'UPDATE_BRAND',
      // Station Management
      'CREATE_STATION', 'DELETE_STATION', 'UPDATE_STATION',
      // Catalogue Management
      'CREATE_BRAND_CATALOGUE', 'DELETE_BRAND_CATALOGUE', 'UPDATE_BRAND_CATALOGUE',
      // Inventory Management
      'CREATE_INVENTORY', 'DELETE_INVENTORY', 'UPDATE_INVENTORY',
      // Cart
      'CREATE_CART', 'UPDATE_CART', 'DELETE_CART',
      // Order
      'CREATE_ORDER', 'UPDATE_ORDER', 'DELETE_ORDER',
      // Notification
      'MARK_NOTIFICATION_AS_READ',
      // Dispatch Management
      'CREATE_DISPATCH', 'DELETE_DISPATCH', 'UPDATE_DISPATCH', 'VIEW_DISPATCH', 'CONFIRM_VIA_SCANNING',
      // Driver Management
      'CREATE_DRIVER', 'DELETE_DRIVER', 'UPDATE_DRIVER', 'VIEW_DRIVER',
      // Transporter Management
      'CREATE_TRANSPORTER', 'DELETE_TRANSPORTER', 'UPDATE_TRANSPORTER', 'VIEW_TRANSPORTER'
    ]
  },
  ADMIN_DEALER: {
    label: 'admin dealer',
    permissions: [
      // Access Apps
      'ACCESS_DEALER_APP',
      // Activity Log
      'CREATE_ACTIVITY_LOG', 'DELETE_ACTIVITY_LOG', 'UPDATE_ACTIVITY_LOG',
      // Inventory Management
      'CREATE_INVENTORY', 'DELETE_INVENTORY', 'UPDATE_INVENTORY',
      // Cart
      'CREATE_CART', 'UPDATE_CART', 'DELETE_CART',
      // Order
      'CREATE_ORDER', 'UPDATE_ORDER', 'DELETE_ORDER',
      // Notification
      'MARK_NOTIFICATION_AS_READ',
      // Dispatch Management
      'CONFIRM_VIA_SCANNING', 'VIEW_DISPATCH'
    ]
  },
  ADMIN_DEPOT: {
    label: 'admin depot',
    permissions: [
      // Access Apps
      'ACCESS_DEPOT_APP',
      // Activity Log
      'CREATE_INVENTORY', 'DELETE_INVENTORY', 'UPDATE_INVENTORY',
      // Order
      'CREATE_ORDER', 'UPDATE_ORDER', 'DELETE_ORDER',
      // Notification
      'MARK_NOTIFICATION_AS_READ',
      // Dispatch Management
      'CREATE_DISPATCH', 'DELETE_DISPATCH', 'UPDATE_DISPATCH', 'VIEW_DISPATCH', 'CONFIRM_VIA_SCANNING',
      // Transporter
      'VIEW_TRANSPORTER',
      // Driver
      'VIEW_DRIVER'
    ]
  },
  DRIVER: {
    label: 'driver',
    permissions: [
      // Access Apps
      'ACCESS_DRIVER_APP',
      // Notification
      'MARK_NOTIFICATION_AS_READ',
      // Dispatch
      'VIEW_DISPATCH',
      // Dispatch Management
      'CONFIRM_VIA_SCANNING'
    ]
  }
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create roles
    for (const [name, roleData] of Object.entries(rolePermissions)) {
      const roleId = uuidv4();
      await queryInterface.bulkInsert('roles', [{
        id: roleId,
        name: name,
        label: roleData.label,
        created_at: new Date(),
        updated_at: new Date()
      }]);

      // If this is the super admin role, they get all permissions
      if (roleData.permissions === '*') {
        const allPermissions = await queryInterface.sequelize.query(
          `SELECT id FROM permissions WHERE deleted_at IS NULL`,
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        
        await queryInterface.bulkInsert('permission_role',
          allPermissions.map(permission => ({
            role_id: roleId,
            permission_id: permission.id,
            created_at: new Date(),
            updated_at: new Date()
          }))
        );
        continue;
      }

      // For other roles, assign specific permissions
      const permissions = await queryInterface.sequelize.query(
        `SELECT id FROM permissions WHERE name IN (${roleData.permissions.map(p => `'${p}'`).join(',')}) AND deleted_at IS NULL`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (permissions.length > 0) {
        await queryInterface.bulkInsert('permission_role',
          permissions.map(permission => ({
            role_id: roleId,
            permission_id: permission.id,
            created_at: new Date(),
            updated_at: new Date()
          }))
        );
      }
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('permission_role', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
};
