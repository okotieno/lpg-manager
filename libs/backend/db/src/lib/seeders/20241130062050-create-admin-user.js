'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUserId = uuidv4();

    // Get admin role ID
    const [adminRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'admin' LIMIT 1;`
    );

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

    // Assign admin role to user if role exists
    if (adminRole[0]) {
      await queryInterface.bulkInsert('role_user', [{
        user_id: adminUserId,
        role_id: adminRole[0].id,
        created_at: new Date(),
        updated_at: new Date()
      }]);
    }
  },

  async down(queryInterface) {
    // First remove role assignment
    await queryInterface.bulkDelete('role_user', null, {});
    
    // Then remove admin user
    await queryInterface.bulkDelete('users', { 
      email: 'admin@example.com' 
    }, {});
  }
}; 