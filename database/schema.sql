-- ========================================
-- ClimateNow - Schema do Banco de Dados
-- ========================================

-- Extensão para UUIDs (opcional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- Tabela de posts (notícias e avisos)
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(20) DEFAULT 'news' CHECK (category IN ('news', 'alert', 'warning')),
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de logs de acesso (para demonstração)
CREATE TABLE IF NOT EXISTS access_logs (
    id SERIAL PRIMARY KEY,
    username_attempted VARCHAR(100),
    ip_address VARCHAR(50),
    success BOOLEAN,
    attempted_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- DADOS INICIAIS (SEED)
-- ========================================

-- Admin padrão (senha: admin123)
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@climatenow.local', '$2a$10$drrDFzBMt5JpPqWvSCELwuJ5MPEQQriEnO6ufnzl2brS6aQnWhffu', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Usuário de teste (senha: user123)
INSERT INTO users (username, email, password_hash, role) VALUES
('joao', 'joao@email.com', '$2a$10$d43A9HJkhGcZgn7s197dE.oGs6YOjjlYatA0LSSNL19r.9yLkrMz6', 'user')
ON CONFLICT (username) DO NOTHING;

-- Notícias de exemplo
INSERT INTO posts (title, content, category, author_id) VALUES
('Bem-vindo ao ClimateNow!', 'Este é o portal oficial de clima e notícias. Aqui você encontrará as informações mais recentes sobre o tempo e os principais acontecimentos do dia.', 'news', 1),
('Alerta de Chuvas Intensas', 'O Instituto Nacional de Meteorologia emitiu alerta para chuvas intensas nas próximas 48 horas. Recomendamos atenção redobrada.', 'alert', 1),
('Manutenção Programada', 'O sistema passará por manutenção no domingo das 02h às 04h. Serviços poderão ficar indisponíveis durante este período.', 'warning', 1),
('Temperatura Record em Outubro', 'Outubro de 2024 registrou as temperaturas mais altas da história em diversas cidades brasileiras, segundo dados do INMET.', 'news', 1),
('Novo Serviço de Alertas', 'A partir desta semana, o ClimateNow passa a oferecer alertas em tempo real sobre condições climáticas extremas.', 'news', 1)
ON CONFLICT DO NOTHING;
