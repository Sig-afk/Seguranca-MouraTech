const pool = require('../config/db');

// ============================================================
// VULNERABILIDADE #3 - SQL INJECTION na busca de usuário pelo admin
// O parâmetro de busca de usuário é inserido diretamente na query
// sem uso de prepared statements.
//
// Payload de exemplo para manipular a query (Boolean-based blind):
//   searchUser: ' OR '1'='1
//
// Isso retornaria TODOS os usuários, independente do filtro.
// Payload mais avançado (para DROP TABLE por exemplo):
//   searchUser: '; DROP TABLE posts; --
// ============================================================

const getDashboard = async (req, res) => {
  try {
    const postsResult = await pool.query(`
      SELECT p.*, u.username as author_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      ORDER BY p.created_at DESC
    `);

    const usersCount = await pool.query(`SELECT COUNT(*) FROM users`);
    const postsCount = await pool.query(`SELECT COUNT(*) FROM posts`);

    res.render('admin/dashboard', {
      title: 'Painel Admin — ClimateNow',
      user: req.session.user,
      posts: postsResult.rows,
      stats: {
        users: usersCount.rows[0].count,
        posts: postsCount.rows[0].count,
      },
      searchResult: null,
      searchTerm: '',
      error: req.query.error || null,
      success: req.query.success || null,
    });

  } catch (err) {
    console.error('[ADMIN] Erro no dashboard:', err.message);
    res.status(500).send('Erro interno do servidor.');
  }
};

// ⚠️ VULNERABILIDADE #3: Busca de usuário por nome sem parametrização
const searchUser = async (req, res) => {
  const { searchUser: searchTerm } = req.query;

  try {
    const postsResult = await pool.query(`
      SELECT p.*, u.username as author_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      ORDER BY p.created_at DESC
    `);

    const usersCount = await pool.query(`SELECT COUNT(*) FROM users`);
    const postsCount = await pool.query(`SELECT COUNT(*) FROM posts`);

    // ⚠️ VULNERÁVEL: Concatenação direta do searchTerm na query SQL
    const userQuery = `SELECT id, username, email, role, created_at, last_login FROM users WHERE username = '${searchTerm}'`;
    const userResult = await pool.query(userQuery);

    res.render('admin/dashboard', {
      title: 'Painel Admin — ClimateNow',
      user: req.session.user,
      posts: postsResult.rows,
      stats: {
        users: usersCount.rows[0].count,
        posts: postsCount.rows[0].count,
      },
      searchResult: userResult.rows,
      searchTerm,
      error: null,
      success: null,
    });

  } catch (err) {
    console.error('[ADMIN] Erro na busca de usuário:', err.message);

    const postsResult = await pool.query(`
      SELECT p.*, u.username as author_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      ORDER BY p.created_at DESC
    `);

    res.render('admin/dashboard', {
      title: 'Painel Admin — ClimateNow',
      user: req.session.user,
      posts: postsResult.rows,
      stats: { users: 0, posts: 0 },
      searchResult: [],
      searchTerm,
      error: `Erro na query: ${err.message}`, // ⚠️ Expõe detalhes do erro!
      success: null,
    });
  }
};

const createPost = async (req, res) => {
  const { title, content, category } = req.body;
  const authorId = req.session.user.id;

  try {
    await pool.query(
      `INSERT INTO posts (title, content, category, author_id) VALUES ($1, $2, $3, $4)`,
      [title, content, category, authorId]
    );

    res.redirect('/admin/dashboard?success=Post criado com sucesso!');
  } catch (err) {
    console.error('[ADMIN] Erro ao criar post:', err.message);
    res.redirect('/admin/dashboard?error=Erro ao criar post.');
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(`DELETE FROM posts WHERE id = $1`, [id]);
    res.redirect('/admin/dashboard?success=Post excluído com sucesso!');
  } catch (err) {
    console.error('[ADMIN] Erro ao excluir post:', err.message);
    res.redirect('/admin/dashboard?error=Erro ao excluir post.');
  }
};

const showCreatePost = (req, res) => {
  res.render('admin/create-post', {
    title: 'Novo Post — ClimateNow',
    user: req.session.user,
    error: null,
    success: null,
  });
};

module.exports = { getDashboard, searchUser, createPost, deletePost, showCreatePost };
