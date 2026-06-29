import { Pool } from 'pg';
import { env } from './env';

export const pool = new Pool({
  connectionString: env.dbUrl,
  ssl: { rejectUnauthorized: false },
});

// helper to run queries
export const query = (text: string, params?: unknown[]) => pool.query(text, params);