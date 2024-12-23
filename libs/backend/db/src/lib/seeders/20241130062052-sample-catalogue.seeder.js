'use strict';
const { v4: uuid } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // First get all brands
    const brands = await queryInterface.sequelize.query(
      `SELECT id, name FROM brands;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const kgSizes = [3, 6, 7, 13, 45];
    const catalogues = [];

    for (const brand of brands) {
      // Generate random number of catalogues (0-5) for each brand
      const numCatalogues = Math.floor(Math.random() * 6);
      
      // Randomly select sizes for this brand
      const selectedSizes = kgSizes
        .sort(() => 0.5 - Math.random())
        .slice(0, numCatalogues);

      for (const size of selectedSizes) {
        catalogues.push({
          id: uuid(),
          brand_id: brand.id,
          name: `${brand.name} ${size}KG`,
          description: `${size}KG Gas Cylinder from ${brand.name}`,
          price_per_unit: Math.floor(Math.random() * (5000 - 2000) + 2000), // Random price between 2000-5000
          unit: 'KG',
          quantity_per_unit: size,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert('catalogues', catalogues);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('catalogues', null, {});
  }
}; 