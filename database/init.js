/**
 * ClimateNow — Setup Completo
 * Cria o banco de dados (se não existir) e executa o schema.
 *
 * Uso: node database/init.js
 */

require('dotenv').config();
const { Pool, Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DB_NAME = process.env.DB_NAME || 'climatenow';
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

async function createDatabaseIfNotExists() {
  // Conecta no banco 'postgres' para poder criar o 'climatenow'
  const client = new Client({ ...config, database: 'postgres' });
  await client.connect();

  const result = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [DB_NAME]
  );

  if (result.rows.length === 0) {
    await client.query(`CREATE DATABASE "${DB_NAME}"`);
    console.log(`✅ Banco de dados "${DB_NAME}" criado!`);
  } else {
    console.log(`ℹ️  Banco de dados "${DB_NAME}" já existe.`);
  }

  await client.end();
}

async function runSchema() {
  const pool = new Pool({ ...config, database: DB_NAME });
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(schema);
  console.log('✅ Schema executado com sucesso!');

  const users = await pool.query('SELECT username, role FROM users ORDER BY role');
  console.log(`✅ Usuários (${users.rows.length}):`);
  users.rows.forEach(u => console.log(`   - ${u.username} [${u.role}]`));

  const posts = await pool.query('SELECT COUNT(*) FROM posts');
  console.log(`✅ Posts de exemplo: ${posts.rows[0].count}`);

  await pool.end();
}

async function main() {
  console.log('\n🔧 ClimateNow — Inicializando banco de dados...\n');
  try {
    await createDatabaseIfNotExists();
    await runSchema();
    console.log('\n🎉 Tudo pronto! Rode agora: npm run dev\n');
    console.log('   Admin:  admin  / admin123');
    console.log('   Usuário: joao  / user123\n');
  } catch (err) {
    console.error('\n❌ Erro:', err.message);
    if (err.message.includes('password')) {
      console.error('\n💡 Dica: Verifique DB_PASSWORD no arquivo .env');
    } else if (err.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Dica: O PostgreSQL não está rodando. Inicie o serviço e tente novamente.');
    }
    process.exit(1);
  }
}

main();
