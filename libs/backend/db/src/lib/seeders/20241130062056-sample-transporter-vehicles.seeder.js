'use strict';
const { v4: uuid } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Get transporters
    const [transporters] = await queryInterface.sequelize.query(
      `SELECT id FROM transporters;`
    );

    const vehicles = [];
    const vehicleTypes = ['VAN', 'PICKUP', 'BOX_TRUCK', 'REEFER', 'SEMI_TRAILER', 'FLATBED', 'TANKER'];

    for (const transporter of transporters) {
      // Add 2-4 vehicles for each transporter
      const numVehicles = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < numVehicles; i++) {
        const type = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
        const capacity = Math.floor(Math.random() * 30) + 10; // Random capacity between 10-40

        vehicles.push({
          id: uuid(),
          transporter_id: transporter.id,
          registration_number: `KXX ${Math.floor(Math.random() * 999)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
          capacity: capacity,
          type: type,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }

    await queryInterface.bulkInsert('vehicles', vehicles);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('vehicles', null, {});
  }
}; 