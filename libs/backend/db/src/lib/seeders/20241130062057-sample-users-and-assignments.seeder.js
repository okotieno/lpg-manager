'use strict';

const { v4: uuid } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, get the role IDs
    const roles = await queryInterface.sequelize.query(
      `SELECT id, name FROM roles WHERE name IN ('SUPER_ADMIN', 'ADMIN_PORTAL_ADMIN', 'ADMIN_DEALER', 'ADMIN_DEPOT', 'DRIVER') AND deleted_at IS NULL`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Create a map of role names to IDs
    const roleMap = roles.reduce((acc, role) => {
      acc[role.name] = role.id;
      return acc;
    }, {});

    // Get users
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE deleted_at IS NULL`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (users.length > 0 && Object.keys(roleMap).length > 0) {
      // Assign super admin role to the first user
      await queryInterface.bulkInsert('role_user', [{
        id: uuid(),
        user_id: users[0].id,
        role_id: roleMap['SUPER_ADMIN'],
        created_at: new Date(),
        updated_at: new Date()
      }]);

      // Assign admin portal role to the second user if exists
      if (users[1]) {
        await queryInterface.bulkInsert('role_user', [{
          id: uuid(),
          user_id: users[1].id,
          role_id: roleMap['ADMIN_PORTAL_ADMIN'],
          created_at: new Date(),
          updated_at: new Date()
        }]);
      }

      // Continue with other role assignments as needed...
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_user', null, {});
  }
};
