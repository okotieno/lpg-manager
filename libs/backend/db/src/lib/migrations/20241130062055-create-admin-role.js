'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Create admin role
    const adminRoleId = uuidv4();
    await queryInterface.bulkInsert('roles', [{
      id: adminRoleId,
      name: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    // Get all permissions
    const [permissions] = await queryInterface.sequelize.query(
      `SELECT id FROM permissions;`
    );

    // Create permission_role entries for admin role
    const permissionRoleEntries = permissions.map(permission => ({
      role_id: adminRoleId,
      permission_id: permission.id,
      created_at: new Date(),
      updated_at: new Date()
    }));

    await queryInterface.bulkInsert('permission_role', permissionRoleEntries);
  },

  async down(queryInterface) {
    // First remove all permission_role entries for admin role
    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'admin' LIMIT 1;`
    );

    if (adminRole[0]) {
      await queryInterface.bulkDelete('permission_role', {
        role_id: adminRole[0].id
      });
    }

    // Then remove the admin role
    await queryInterface.bulkDelete('roles', {
      name: 'admin'
    });
  }
};
