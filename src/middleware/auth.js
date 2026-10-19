// Middleware de autenticação: verifica se o usuário está logado
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/login');
};

// Middleware de autorização: verifica se o usuário é admin
const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).render('auth/login', {
    error: 'Acesso negado. Apenas administradores.',
    title: 'Acesso Negado — ClimateNow'
  });
};

module.exports = { isAuthenticated, isAdmin };
