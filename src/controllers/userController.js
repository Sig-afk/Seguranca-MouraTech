const pool = require('../config/db');
const axios = require('axios');

// ============================================================
// VULNERABILIDADE #2 - SQL INJECTION na busca de notícias
// O campo de busca (searchTerm) é inserido diretamente na query
// sem parametrização ou escape.
//
// Payload de exemplo para extrair dados sensíveis (UNION-based):
//   searchTerm: ' UNION SELECT id, username, password_hash, 'x', NOW(), NOW() FROM users --
//
// Isso retornaria os hashes de senhas na listagem de notícias!
// ============================================================
const getDashboard = async (req, res) => {
  const searchTerm = req.query.search || '';
  const city = req.query.city || 'São Paulo';

  try {
    // ⚠️ VULNERÁVEL: searchTerm inserido diretamente na query
    let postsQuery;
    if (searchTerm) {
      postsQuery = `
        SELECT p.*, u.username as author_name
        FROM posts p
        LEFT JOIN users u ON p.author_id = u.id
        WHERE p.title ILIKE '%${searchTerm}%'
           OR p.content ILIKE '%${searchTerm}%'
        ORDER BY p.created_at DESC
      `;
    } else {
      postsQuery = `
        SELECT p.*, u.username as author_name
        FROM posts p
        LEFT JOIN users u ON p.author_id = u.id
        ORDER BY p.created_at DESC
        LIMIT 10
      `;
    }

    const postsResult = await pool.query(postsQuery);

    // Busca dados do clima
    let weatherData = null;
    try {
      const apiKey = process.env.WEATHER_API_KEY;
      if (apiKey && apiKey !== 'sua_api_key_aqui') {
        const weatherRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=pt_br`
        );
        weatherData = {
          temp: Math.round(weatherRes.data.main.temp),
          feels_like: Math.round(weatherRes.data.main.feels_like),
          humidity: weatherRes.data.main.humidity,
          description: weatherRes.data.weather[0].description,
          icon: weatherRes.data.weather[0].icon,
          city: weatherRes.data.name,
          wind: weatherRes.data.wind.speed,
        };
      } else {
        // Dados fictícios para demonstração
        weatherData = {
          temp: 24,
          feels_like: 26,
          humidity: 68,
          description: 'céu limpo',
          icon: '01d',
          city: city,
          wind: 3.5,
        };
      }
    } catch (weatherErr) {
      console.error('[WEATHER] Erro ao buscar clima:', weatherErr.message);
      weatherData = {
        temp: '--',
        feels_like: '--',
        humidity: '--',
        description: 'Indisponível',
        icon: '01d',
        city: city,
        wind: '--',
      };
    }

    res.render('user/dashboard', {
      title: 'Dashboard — ClimateNow',
      user: req.session.user,
      posts: postsResult.rows,
      weather: weatherData,
      searchTerm,
      city,
    });

  } catch (err) {
    console.error('[USER] Erro no dashboard:', err.message);
    res.render('user/dashboard', {
      title: 'Dashboard — ClimateNow',
      user: req.session.user,
      posts: [],
      weather: null,
      searchTerm,
      city,
      dbError: err.message, // Expõe mensagem de erro — outra má prática!
    });
  }
};

module.exports = { getDashboard };
