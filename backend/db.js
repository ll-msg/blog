import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  database: process.env.PGDATABASE || 'blog',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  max: 10
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
