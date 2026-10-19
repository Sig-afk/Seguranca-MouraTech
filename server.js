require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'climatenow_dev_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2, // 2 horas
    httpOnly: true,
  }
}));

// Rotas
const authRoutes = require('./src/routes/auth');
const adminRoutes = require('./src/routes/admin');
const userRoutes = require('./src/routes/user');

app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('auth/login', {
    error: 'Página não encontrada.',
    title: '404 — ClimateNow'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[SERVER] Erro:', err.stack);
  res.status(500).send('Erro interno do servidor.');
});

app.listen(PORT, () => {
  console.log(`\n🌤️  ClimateNow rodando em http://localhost:${PORT}`);
  console.log(`   Admin: admin / admin123`);
  console.log(`   User:  joao  / user123\n`);
});
