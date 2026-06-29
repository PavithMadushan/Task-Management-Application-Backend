import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  dbUrl: process.env.NEON_DB_URL || '',
};

console.log('DB URL set?', Boolean(env.dbUrl));