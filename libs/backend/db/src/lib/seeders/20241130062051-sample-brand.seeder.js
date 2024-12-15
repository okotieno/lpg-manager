'use strict';
const { v4: uuid } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {

    await queryInterface.bulkInsert('brands', [
      {
        id: uuid(),
        name: 'Total',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: 'Afri Gas',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: 'Shell Gas',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('brands', null, {});
  },
};
