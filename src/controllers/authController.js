const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// ============================================================
// VULNERABILIDADE #1 - SQL INJECTION no login
// A query abaixo concatena diretamente o username e password
// vindo do formulário, sem nenhum tipo de sanitização.
//
// Payload de exemplo para bypassar login:
//   username: admin' --
//   password: qualquer_coisa
//
// A query resultante seria:
//   SELECT * FROM users WHERE username = 'admin' --' AND password_hash = '...'
//   O comentário (--) ignora o resto da query!
// ============================================================
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // ⚠️ VULNERÁVEL: Concatenação direta — NÃO USE EM PRODUÇÃO!
    const query = `SELECT * FROM users WHERE username = '${username}'`;
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      // Log de tentativa falha
      await pool.query(
        `INSERT INTO access_logs (username_attempted, success) VALUES ('${username}', false)`
      );
      return res.render('auth/login', {
        error: 'Usuário ou senha inválidos.',
        title: 'Login — ClimateNow'
      });
    }

    const user = result.rows[0];

    // Verificação de senha com bcrypt (a única parte segura)
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      await pool.query(
        `INSERT INTO access_logs (username_attempted, success) VALUES ('${username}', false)`
      );
      return res.render('auth/login', {
        error: 'Usuário ou senha inválidos.',
        title: 'Login — ClimateNow'
      });
    }

    // Atualiza último login
    await pool.query(
      `UPDATE users SET last_login = NOW() WHERE id = '${user.id}'`
    );

    // Log de sucesso
    await pool.query(
      `INSERT INTO access_logs (username_attempted, success) VALUES ('${username}', true)`
    );

    // Cria sessão
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    if (user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    }
    return res.redirect('/user/dashboard');

  } catch (err) {
    console.error('[AUTH] Erro no login:', err.message);
    return res.render('auth/login', {
      error: 'Erro interno. Tente novamente.',
      title: 'Login — ClimateNow'
    });
  }
};

const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

const showLogin = (req, res) => {
  if (req.session.user) {
    return req.session.user.role === 'admin'
      ? res.redirect('/admin/dashboard')
      : res.redirect('/user/dashboard');
  }
  res.render('auth/login', { error: null, title: 'Login — ClimateNow' });
};

module.exports = { loginUser, logoutUser, showLogin };
