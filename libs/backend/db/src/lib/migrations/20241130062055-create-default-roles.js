'use strict';
const { v4: uuidv4 } = require('uuid');

const rolePermissions = {
  ['super admin']: '*', // Special case - gets all permissions

  admin: [
    // Access Apps
    'access dealer app', 'access depot app', 'access admin app', 'access transporter app',
    // User Management
    'create user', 'delete user', 'update user',
    // Role Management
    'create role', 'delete role', 'update role',
    // Permission Management
    'create permission', 'delete permission', 'update permission', 'give permission to role',
    // Role Assignment
    'assign role to user',
    // Settings Management
    'create setting', 'delete setting', 'update setting',
    // Activity Log
    'create activity log', 'delete activity log', 'update activity log',
    // Brand Management
    'create brand', 'delete brand', 'update brand',
    // Station Management
    'create station', 'delete station', 'update station',
    // Catalogue Management
    'create brand catalogue', 'delete brand catalogue', 'update brand catalogue',
    // Inventory Management
    'create inventory', 'delete inventory', 'update inventory',
    // Cart
    'create cart', 'update cart', 'delete cart',
    // Order
    'create order', 'update order', 'update order',
    // Notification
    'mark notification as read'
  ],

  manager: [
    // User Management
    'create user', 'update user',
    // Role Assignment
    'assign role to user',
    // Station Management
    'create station', 'update station',
    // Brand Management
    'create brand', 'update brand',
    // Catalogue Management
    'create brand catalogue', 'update brand catalogue',
    // Inventory Management
    'create inventory', 'update inventory',
    // Activity Log
    'create activity log', 'update activity log',
    // Notification
    'mark notification as read'
  ],

  supervisor: [
    // User Management
    'update user',
    // Station Management
    'update station',
    // Inventory Management
    'create inventory', 'update inventory',
    // Activity Log
    'create activity log',
    // Notification
    'mark notification as read'
  ],

  operator: [
    // Inventory Management
    'create inventory', 'update inventory',
    // Activity Log
    'create activity log',
    // Notification
    'mark notification as read'
  ],

  viewer: [
    // No write permissions - read-only access is handled at the query level
    // Notification
    'mark notification as read'
  ],

  ['station manager']: [
    // Station-specific permissions
    'update station',
    // Inventory Management
    'create inventory', 'update inventory',
    // Activity Log
    'create activity log',
    // Notification
    'mark notification as read'
  ],

  ['station operator']: [
    // Inventory Management
    'create inventory', 'update inventory',
    // Activity Log
    'create activity log',
    // Notification
    'mark notification as read'
  ],

  ['inventory manager']: [
    // Inventory Management
    'create inventory', 'update inventory', 'delete inventory',
    // Activity Log
    'create activity log',
    // Notification
    'mark notification as read'
  ],

  ['sales agent']: [
    // Cart Management
    'create cart',
    // Activity Log
    'create activity log',
    // Notification
    'mark notification as read'
  ],

  auditor: [
    // Activity Log
    'create activity log',
    // Notification
    'mark notification as read'
  ]
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Create roles first
    const rolesToInsert = Object.entries(rolePermissions).map(([name]) => ({
      id: uuidv4(),
      name,
      created_at: new Date(),
      updated_at: new Date()
    }));

    await queryInterface.bulkInsert('roles', rolesToInsert);

    // Get all permissions
    const [permissions] = await queryInterface.sequelize.query(
      `SELECT id, name FROM permissions;`
    );

    // Create a map of permission names to IDs
    const permissionMap = permissions.reduce((acc, perm) => {
      acc[perm.name] = perm.id;
      return acc;
    }, {});

    // Get all created roles
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id, name FROM roles WHERE name IN (${Object.keys(rolePermissions).map(name => `'${name}'`).join(',')});`
    );

    // Create permission-role assignments
    const permissionRoleEntries = [];

    for (const role of roles) {
      const rolePerms = rolePermissions[role.name];

      if (rolePerms === '*') {
        // Assign all permissions for super_admin
        permissions.forEach(permission => {
          permissionRoleEntries.push({
            role_id: role.id,
            permission_id: permission.id,
            created_at: new Date(),
            updated_at: new Date()
          });
        });
      } else {
        // Assign specific permissions for other roles
        rolePerms.forEach(permName => {
          if (permissionMap[permName]) {
            permissionRoleEntries.push({
              role_id: role.id,
              permission_id: permissionMap[permName],
              created_at: new Date(),
              updated_at: new Date()
            });
          }
        });
      }
    }

    await queryInterface.bulkInsert('permission_role', permissionRoleEntries);
  },

  async down(queryInterface) {
    // First remove all permission_role entries for these roles
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name IN (${Object.keys(rolePermissions).map(name => `'${name}'`).join(',')});`
    );

    if (roles.length > 0) {
      await queryInterface.bulkDelete('permission_role', {
        role_id: roles.map(role => role.id)
      });
    }

    // Then remove the roles
    await queryInterface.bulkDelete('roles', {
      name: Object.keys(rolePermissions)
    });
  }
};
