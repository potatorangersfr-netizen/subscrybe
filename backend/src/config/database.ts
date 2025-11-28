import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing in .env");
  process.exit(1);
}

console.log("🔍 Using DATABASE_URL =", process.env.DATABASE_URL);

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});
