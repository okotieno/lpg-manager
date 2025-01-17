'use strict';
const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Get all transporters
    const [transporters] = await queryInterface.sequelize.query(
      `SELECT id FROM transporters;`
    );

    // Get driver role
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'driver';`
    );
    const driverRoleId = roles[0]?.id;

    for (const transporter of transporters) {
      // Create 3-5 drivers for each transporter
      const numDrivers = Math.floor(Math.random() * 3) + 3;

      for (let i = 0; i < numDrivers; i++) {
        // Create user for driver
        const userId = uuid();
        await queryInterface.bulkInsert('users', [{
          id: userId,
          first_name: `Driver${i + 1}`,
          last_name: `${transporter.id.substring(0, 4)}`,
          email: `driver${i + 1}_${transporter.id.substring(0, 4)}@example.com`,
          phone: `+2547${Math.floor(10000000 + Math.random() * 90000000)}`,
          password: hashedPassword,
          email_verified_at: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        }]);

        // Assign driver role
        await queryInterface.bulkInsert('role_user', [{
          id: uuid(),
          user_id: userId,
          role_id: driverRoleId,
          created_at: new Date(),
          updated_at: new Date()
        }]);

        // Create driver record
        const driverId = uuid();
        await queryInterface.bulkInsert('drivers', [{
          id: driverId,
          user_id: userId,
          transporter_id: transporter.id,
          license_number: `DL${Math.floor(100000 + Math.random() * 900000)}`,
          created_at: new Date(),
          updated_at: new Date()
        }]);

        // Get vehicles for this transporter
        const [vehicles] = await queryInterface.sequelize.query(
          `SELECT id FROM vehicles WHERE transporter_id = '${transporter.id}';`
        );

        // Assign 1-2 random vehicles to driver
        const numVehicles = Math.floor(Math.random() * 2) + 1;
        const selectedVehicles = vehicles
          .sort(() => 0.5 - Math.random())
          .slice(0, numVehicles);

        for (const vehicle of selectedVehicles) {
          await queryInterface.bulkInsert('driver_vehicle', [{
            driver_id: driverId,
            vehicle_id: vehicle.id,
            created_at: new Date(),
            updated_at: new Date()
          }]);
        }
      }
    }
  },

  async down(queryInterface) {
    // Delete in reverse order
    await queryInterface.bulkDelete('driver_vehicle', null, {});
    await queryInterface.bulkDelete('drivers', null, {});
    await queryInterface.bulkDelete('role_user', null, {});
    await queryInterface.bulkDelete('users', {
      email: { [queryInterface.sequelize.Op.like]: '%@example.com' }
    }, {});
  }
}; 