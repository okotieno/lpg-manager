'use strict';
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Get role IDs for our test users
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id, name FROM roles WHERE name IN ('admin depot', 'admin dealer', 'driver');`
    );

    if (roles.length < 3) {
      throw new Error('Required roles not found. Please ensure roles are seeded first.');
    }

    const roleMap = roles.reduce((acc, role) => {
      acc[role.name] = role.id;
      return acc;
    }, {});

    // Get a sample transporter
    const [transporters] = await queryInterface.sequelize.query(
      `SELECT id FROM transporters LIMIT 1;`
    );
    const transporterId = transporters[0]?.id;

    // Get a sample vehicle from the transporter
    const [vehicles] = await queryInterface.sequelize.query(
      `SELECT id FROM vehicles WHERE transporter_id = '${transporterId}' LIMIT 1;`
    );
    const vehicleId = vehicles[0]?.id;

    // Get a sample dealer station
    const [dealers] = await queryInterface.sequelize.query(
      `SELECT id FROM stations WHERE type = 'DEALER' LIMIT 1;`
    );
    const dealerId = dealers[0]?.id;

    // Get a sample depot station
    const [depots] = await queryInterface.sequelize.query(
      `SELECT id FROM stations WHERE type = 'DEPOT' LIMIT 1;`
    );
    const depotId = depots[0]?.id;

    // Create users
    const driverUserId = uuid();
    const dealerUserId = uuid();
    const depotUserId = uuid();

    await queryInterface.bulkInsert('users', [
      {
        id: driverUserId,
        first_name: 'John',
        last_name: 'Driver',
        email: 'driver@example.com',
        phone: '+254722000001',
        password: hashedPassword,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: dealerUserId,
        first_name: 'Jane',
        last_name: 'Dealer',
        email: 'dealer@example.com',
        phone: '+254722000002',
        password: hashedPassword,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: depotUserId,
        first_name: 'James',
        last_name: 'Depot',
        email: 'depot@example.com',
        phone: '+254722000003',
        password: hashedPassword,
        email_verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Assign roles to users with their respective stations
    await queryInterface.bulkInsert('role_user', [
      {
        id: uuid(),
        user_id: driverUserId,
        role_id: roleMap['driver'],
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuid(),
        user_id: dealerUserId,
        role_id: roleMap['admin dealer'],
        station_id: dealerId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuid(),
        user_id: depotUserId,
        role_id: roleMap['admin depot'],
        station_id: depotId,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Create driver record and assign to transporter
    const driverId = uuid();
    await queryInterface.bulkInsert('drivers', [{
      id: driverId,
      user_id: driverUserId,
      transporter_id: transporterId,
      license_number: 'DL123456',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    // Assign vehicle to driver
    await queryInterface.bulkInsert('driver_vehicle', [{
      driver_id: driverId,
      vehicle_id: vehicleId,
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  async down(queryInterface) {
    // Delete driver-vehicle assignments
    await queryInterface.bulkDelete('driver_vehicle', null, {});
    
    // Delete drivers
    await queryInterface.bulkDelete('drivers', null, {});
    
    // Delete role assignments
    await queryInterface.bulkDelete('role_user', null, {});
    
    // Delete users
    await queryInterface.bulkDelete('users', {
      email: ['driver@example.com', 'dealer@example.com', 'depot@example.com']
    }, {});
  }
}; 