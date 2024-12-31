'use strict';

const { v4: uuidv4 } = require('uuid');

const rolePermissions = {
  'admin': [
    'create user',
    'update user',
    'delete user',
    'view user',
    'create role',
    'update role',
    'delete role',
    'view role',
    'create permission',
    'update permission',
    'delete permission',
    'view permission',
    'create brand',
    'update brand',
    'delete brand',
    'view brand',
    'create catalogue',
    'update catalogue',
    'delete catalogue',
    'view catalogue',
    'create cart',
    'update cart',
    'delete cart',
    'view cart',
    'create order',
    'update order',
    'delete order',
    'view order',
    'create dispatch',
    'update dispatch',
    'delete dispatch',
    'view dispatch',
    'create driver',
    'update driver',
    'delete driver',
    'view driver',
    'create transporter',
    'update transporter',
    'delete transporter',
    'view transporter',
  ],
  'dealer': [
    'view brand',
    'view catalogue',
    'create cart',
    'update cart',
    'delete cart',
    'view cart',
    'create order',
    'update order',
    'delete order',
    'view order',
  ],
  'depot': [
    'view brand',
    'view catalogue',
    'view cart',
    'view order',
    'update order',
    'create dispatch',
    'update dispatch',
    'delete dispatch',
    'view dispatch',
    'create driver',
    'update driver',
    'delete driver',
    'view driver',
    'create transporter',
    'update transporter',
    'delete transporter',
    'view transporter',
  ],
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const rolesToInsert = Object.keys(rolePermissions).map(name => ({
      id: uuidv4(),
      name,
      created_at: new Date(),
      updated_at: new Date()
    }));

    await queryInterface.bulkInsert('roles', rolesToInsert);

    // Get all roles with their IDs
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id, name FROM roles WHERE name IN (${Object.keys(rolePermissions).map(name => `'${name}'`).join(',')});`
    );

    // Get all permissions with their IDs
    const [permissions] = await queryInterface.sequelize.query(
      `SELECT id, name FROM permissions;`
    );

    // Create permission_role entries
    const permissionRoleEntries = [];
    
    roles.forEach(role => {
      const rolePerms = rolePermissions[role.name];
      if (rolePerms) {
        rolePerms.forEach(permName => {
          const permission = permissions.find(p => p.name === permName);
          if (permission) {
            permissionRoleEntries.push({
              role_id: role.id,
              permission_id: permission.id,
              created_at: new Date(),
              updated_at: new Date()
            });
          }
        });
      }
    });

    // Insert permission_role entries if any exist
    if (permissionRoleEntries.length > 0) {
      // First, clear any existing entries for these roles to avoid duplicates
      await queryInterface.sequelize.query(
        `DELETE FROM permission_role WHERE role_id IN (${roles.map(r => `'${r.id}'`).join(',')});`
      );

      // Then insert the new entries
      await queryInterface.bulkInsert('permission_role', permissionRoleEntries);
    }
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
