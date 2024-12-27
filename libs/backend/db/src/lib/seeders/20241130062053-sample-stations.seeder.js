'use strict';
const { v4: uuid } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Get existing brands
    const brands = await queryInterface.sequelize.query(
      `SELECT id FROM brands;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const depots = [
      {
        id: uuid(),
        name: 'Industrial Area Depot',
        type: 'DEPOT',
        location: JSON.stringify({
          lat: -1.3089, 
          lng: 36.8458
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: 'Embakasi Depot',
        type: 'DEPOT',
        location: JSON.stringify({
          lat: -1.3228, 
          lng: 36.8944
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: 'Westlands Depot',
        type: 'DEPOT',
        location: JSON.stringify({
          lat: -1.2673, 
          lng: 36.8087
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: 'Karen Depot',
        type: 'DEPOT',
        location: JSON.stringify({
          lat: -1.3196, 
          lng: 36.7062
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: 'Ruaraka Depot',
        type: 'DEPOT',
        location: JSON.stringify({
          lat: -1.2479, 
          lng: 36.8867
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: 'Kasarani Depot',
        type: 'DEPOT',
        location: JSON.stringify({
          lat: -1.2211, 
          lng: 36.8963
        }),
        created_at: new Date(),
        updated_at: new Date(),
      }
    ];

    // Nairobi areas with their approximate coordinates
    const nairobiAreas = [
      { name: 'Kilimani', lat: -1.2887, lng: 36.7816 },
      { name: 'Lavington', lat: -1.2754, lng: 36.7652 },
      { name: 'Kileleshwa', lat: -1.2841, lng: 36.7727 },
      { name: 'Parklands', lat: -1.2635, lng: 36.8241 },
      { name: 'Ngara', lat: -1.2841, lng: 36.8344 },
      { name: 'South B', lat: -1.3107, lng: 36.8419 },
      { name: 'South C', lat: -1.3182, lng: 36.8284 },
      { name: 'Nairobi West', lat: -1.3066, lng: 36.8246 },
      { name: 'Langata', lat: -1.3378, lng: 36.7855 },
      { name: 'Kibera', lat: -1.3127, lng: 36.7816 },
      { name: 'Kawangware', lat: -1.2841, lng: 36.7472 },
      { name: 'Dagoretti', lat: -1.2841, lng: 36.7472 },
      { name: 'Kangemi', lat: -1.2667, lng: 36.7500 },
      { name: 'Eastleigh', lat: -1.2774, lng: 36.8502 },
      { name: 'Umoja', lat: -1.2833, lng: 36.8833 },
      { name: 'Buruburu', lat: -1.2833, lng: 36.8833 },
      { name: 'Kayole', lat: -1.2833, lng: 36.9167 },
      { name: 'Dandora', lat: -1.2567, lng: 36.8935 },
      { name: 'Kariobangi', lat: -1.2567, lng: 36.8833 },
      { name: 'Mathare', lat: -1.2567, lng: 36.8502 },
      { name: 'Githurai', lat: -1.2167, lng: 36.9167 },
      { name: 'Zimmerman', lat: -1.2167, lng: 36.8833 },
      { name: 'Kahawa West', lat: -1.1833, lng: 36.9333 },
      { name: 'Roysambu', lat: -1.2167, lng: 36.8833 },
      { name: 'Kasarani', lat: -1.2211, lng: 36.8963 },
      { name: 'Pipeline', lat: -1.3167, lng: 36.9000 },
      { name: 'Donholm', lat: -1.3000, lng: 36.8833 },
      { name: 'Komarock', lat: -1.2833, lng: 36.9167 },
      { name: 'Utawala', lat: -1.2833, lng: 36.9500 },
      { name: 'Mihango', lat: -1.2667, lng: 36.9167 }
    ];

    const dealers = nairobiAreas.map(area => ({
      id: uuid(),
      name: `${area.name} Gas Dealer`,
      type: 'DEALER',
      location: JSON.stringify({
        lat: area.lat,
        lng: area.lng
      }),
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Create depot-brand associations
    const depotBrands = [];
    for (const depot of depots) {
      // Randomly assign 2-4 brands to each depot
      const randomBrands = brands
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 2);
      
      for (const brand of randomBrands) {
        depotBrands.push({
          id: uuid(),
          depot_id: depot.id,
          brand_id: brand.id,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }

    await queryInterface.bulkInsert('stations', [...depots, ...dealers]);
    await queryInterface.bulkInsert('depot_brands', depotBrands);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('depot_brands', null, {});
    await queryInterface.bulkDelete('stations', null, {});
  }
}; 