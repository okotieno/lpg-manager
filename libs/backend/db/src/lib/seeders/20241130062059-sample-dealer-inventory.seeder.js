'use strict';
const { v4: uuid } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Get all depotss
    const [depots] = await queryInterface.sequelize.query(
      `SELECT id FROM stations WHERE type = 'DEPOT';`
    );

    // Get all catalogues
    const [catalogues] = await queryInterface.sequelize.query(
      `SELECT id FROM catalogues;`
    );

    const inventory = [];

    for (const depot of depots) {
      // Create 1-10 inventory items for each depot
      const numItems = Math.floor(Math.random() * 10) + 1;

      // Randomly select catalogues
      const selectedCatalogues = catalogues
        .sort(() => 0.5 - Math.random())
        .slice(0, numItems);

      for (const catalogue of selectedCatalogues) {
        inventory.push({
          id: uuid(),
          station_id: depot.id,
          catalogue_id: catalogue.id,
          quantity: Math.floor(Math.random() * 50) + 10, // Random quantity between 10-60
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }

    await queryInterface.bulkInsert('inventory', inventory);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('inventory', null, {});
  }
};
