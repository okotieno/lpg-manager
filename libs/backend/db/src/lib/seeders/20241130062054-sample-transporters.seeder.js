'use strict';
const { v4: uuid } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('transporters', [
      {
        id: uuid(),
        name: 'Rongai Transport Company',
        contact_person: 'John Kamau',
        phone: '+254 722 123 456',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: 'Nairobi Express Logistics',
        contact_person: 'Sarah Wanjiku',
        phone: '+254 733 234 567',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: 'Mombasa Maritime Transport',
        contact_person: 'Ali Hassan',
        phone: '+254 722 345 678',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: 'Kisumu Lake Region Transporters',
        contact_person: 'George Odhiambo',
        phone: '+254 733 456 789',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: 'Nakuru Gateway Logistics',
        contact_person: 'Mary Njeri',
        phone: '+254 722 567 890',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: 'Eldoret Highland Transporters',
        contact_person: 'William Kipchoge',
        phone: '+254 733 678 901',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: 'Thika Road Masters',
        contact_person: 'Peter Ndung\'u',
        phone: '+254 722 789 012',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: 'Machakos Express Services',
        contact_person: 'Agnes Muthoni',
        phone: '+254 733 890 123',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: 'Nyeri Central Transport',
        contact_person: 'James Mwangi',
        phone: '+254 722 901 234',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: 'Kitale Farmers Logistics',
        contact_person: 'David Kiprono',
        phone: '+254 733 012 345',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        name: 'Garissa Northern Transport',
        contact_person: 'Abdi Mohamed',
        phone: '+254 722 123 456',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('transporters', null, {});
  }
};
