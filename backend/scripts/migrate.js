// backend/scripts/migrate.js

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

(async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL is not set in .env");
      process.exit(1);
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Correct path to your actual migration file
    const sqlPath = path.join(__dirname, '..', 'migrations', '001_initial_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('🚀 Running migrations...');
    await pool.query(sql);

    await pool.end();
    console.log('✅ Migrations applied successfully.');
    process.exit(0);

  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
})();
