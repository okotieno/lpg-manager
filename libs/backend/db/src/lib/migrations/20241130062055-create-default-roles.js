'use strict';
const { v4: uuidv4 } = require('uuid');

const rolePermissions = {
  ['super admin']: '*', // Special case - gets all permissions

  ['admin admin-portal']: [
    // Access Apps
    'access admin portal',
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
    'create order', 'update order', 'delete order',
    // Notification
    'mark notification as read',
    // Dispatch Management
    'create dispatch', 'delete dispatch', 'update dispatch', 'view dispatch',
    // Driver Management
    'create driver', 'delete driver', 'update driver', 'view driver',
    // Transporter Management
    'create transporter', 'delete transporter', 'update transporter', 'view transporter'
  ],

  ['admin dealer']: [
    // Access Apps
    'access dealer app',
    // Activity Log
    'create activity log', 'delete activity log', 'update activity log',
    'create inventory', 'delete inventory', 'update inventory',
    // Cart
    'create cart', 'update cart', 'delete cart',
    // Order
    'create order', 'update order', 'delete order',
    // Notification
    'mark notification as read',
  ],

  ['admin depot']: [
    // Access Apps
    'access depot app',
    // Activity Log
    'create inventory', 'delete inventory', 'update inventory',
    // Order
    'create order', 'update order', 'delete order',
    // Notification
    'mark notification as read',
    // Dispatch Management
    'create dispatch', 'delete dispatch', 'update dispatch', 'view dispatch',
  ],

  driver: [
    // Access Apps
    'access driver app',
    // Notification
    'mark notification as read',
  ],
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
