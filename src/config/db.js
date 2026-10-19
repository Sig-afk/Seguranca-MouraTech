const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'climatenow',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

pool.on('connect', () => {
  console.log('[DB] Conectado ao PostgreSQL com sucesso.');
});

pool.on('error', (err) => {
  console.error('[DB] Erro inesperado no pool:', err);
});

module.exports = pool;
