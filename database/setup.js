/**
 * ClimateNow — Script de Setup do Banco de Dados
 * Executa o schema.sql e verifica as credenciais de teste.
 * 
 * Uso: node database/setup.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'climatenow',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function setup() {
  console.log('\n🔧 ClimateNow — Setup do Banco de Dados\n');

  try {
    // Testa conexão
    await pool.query('SELECT 1');
    console.log('✅ Conexão com PostgreSQL bem-sucedida!');

    // Executa o schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('✅ Schema executado com sucesso!');

    // Verifica usuários criados
    const users = await pool.query('SELECT username, role FROM users');
    console.log(`✅ Usuários no banco (${users.rows.length}):`);
    users.rows.forEach(u => console.log(`   - ${u.username} (${u.role})`));

    const posts = await pool.query('SELECT COUNT(*) FROM posts');
    console.log(`✅ Posts de exemplo: ${posts.rows[0].count}`);

    console.log('\n🎉 Setup concluído! Inicie o servidor com: npm run dev\n');

  } catch (err) {
    console.error('\n❌ Erro durante o setup:', err.message);
    console.error('\nVerifique:');
    console.error('  1. O PostgreSQL está rodando?');
    console.error('  2. O banco "climatenow" existe? (CREATE DATABASE climatenow;)');
    console.error('  3. As credenciais no .env estão corretas?');
  } finally {
    await pool.end();
  }
}

setup();
