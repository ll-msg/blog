import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});


pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
})


export const query = (text, params) => pool.query(text, params);


export const getClient = async () => {
  const client = await pool.connect();
  return client;
}

// exit
export async function closePool() {
  await pool.end();
}
