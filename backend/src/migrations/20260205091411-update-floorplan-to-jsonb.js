'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop standard default if exists
    await queryInterface.sequelize.query('ALTER TABLE listings ALTER COLUMN floorplan DROP DEFAULT');

    // Convert to JSONB array. 
    // If there's an existing string, we wrap it in an object as the 'Ground' floorplan by default.
    // If it's empty, we set it to an empty array.
    await queryInterface.sequelize.query(`
            ALTER TABLE listings 
            ALTER COLUMN floorplan TYPE JSONB 
            USING CASE 
                WHEN floorplan IS NULL OR floorplan = '' THEN '[]'::jsonb 
                ELSE jsonb_build_array(jsonb_build_object('url', floorplan, 'type', 'Ground'))
            END
        `);

    await queryInterface.sequelize.query("ALTER TABLE listings ALTER COLUMN floorplan SET DEFAULT '[]'::jsonb");

    await queryInterface.changeColumn('listings', 'floorplan', {
      type: Sequelize.JSONB,
      defaultValue: [],
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert back to STRING. Take the first URL if available.
    await queryInterface.sequelize.query(`
            ALTER TABLE listings 
            ALTER COLUMN floorplan TYPE VARCHAR(255) 
            USING CASE 
                WHEN jsonb_array_length(floorplan) > 0 THEN (floorplan->0->>'url')
                ELSE NULL
            END
        `);
  }
};
