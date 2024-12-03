'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUserId = uuidv4();
    const adminRoleId = uuidv4();

    // Create admin role
    await queryInterface.bulkInsert('roles', [{
      id: adminRoleId,
      name: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    // Create admin user
    await queryInterface.bulkInsert('users', [{
      id: adminUserId,
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      password: hashedPassword,
      email_verified_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }]);

    // Assign admin role to user
    await queryInterface.bulkInsert('role_user', [{
      user_id: adminUserId,
      role_id: adminRoleId,
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('role_user', null, {});
    await queryInterface.bulkDelete('users', { email: 'admin@example.com' }, {});
    await queryInterface.bulkDelete('roles', { name: 'admin' }, {});
  }
}; 