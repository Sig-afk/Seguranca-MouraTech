# 🌤️ ClimateNow

> Portal de clima e notícias com painel administrativo — Projeto para disciplina de Segurança da Informação.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-4169E1?style=flat-square&logo=postgresql)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express)

---

## 📋 Sobre o Projeto

O **ClimateNow** é um portal web com dois tipos de acesso:

| Perfil | Funcionalidades |
|--------|----------------|
| **Usuário** | Login, visualização do clima atual e notícias/avisos |
| **Admin** | Login, criação e exclusão de posts, busca de usuários |

> ⚠️ **AVISO**: Este projeto contém **vulnerabilidades de SQL Injection intencionais** para fins educacionais. Consulte o arquivo [VULNERABILITIES.md](./VULNERABILITIES.md) para detalhes.

---

## 🛠️ Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [PostgreSQL](https://www.postgresql.org/) v15 ou superior
- npm (incluído com Node.js)

---

## 🚀 Como Rodar Localmente

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/ClimateNow.git
cd ClimateNow
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o PostgreSQL e configure o banco de dados

**Opção A — Via Docker (Mais fácil):**
```bash
docker run -d --name climatenow-db -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=climatenow postgres:17-alpine
```

**Opção B — PostgreSQL instalado localmente:**
Abra o PostgreSQL e crie o banco:
```sql
CREATE DATABASE climatenow;
```

**Inicializar o banco (criação das tabelas e dados de teste):**
```bash
npm run init
```
*(ou se preferir executar manualmente: `psql -U postgres -d climatenow -f database/schema.sql`)*

Ou, se preferir via pgAdmin, abra o arquivo `database/schema.sql` e execute-o no banco `climatenow`.

### 4. Configure as variáveis de ambiente

Copie o arquivo de exemplo e edite com suas credenciais:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

Edite o arquivo `.env`:

```env
PORT=3000
NODE_ENV=development

# Suas credenciais do PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=climatenow
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

# Segredo da sessão (pode ser qualquer string longa)
SESSION_SECRET=climatenow_secret_super_seguro_2024

# (Opcional) Chave da API do OpenWeatherMap
# Obtenha gratuitamente em: https://openweathermap.org/api
# Sem ela, serão exibidos dados fictícios de demonstração.
WEATHER_API_KEY=sua_api_key_aqui
```

### 5. Inicie o servidor

```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# Modo produção
npm start
```

Acesse em: **http://localhost:3000**

---

## 🔑 Credenciais de Teste

| Tipo | Usuário | Senha |
|------|---------|-------|
| Administrador | `admin` | `admin123` |
| Usuário comum | `joao` | `user123` |

---

## 🌐 API de Clima (Opcional)

O projeto utiliza a [OpenWeatherMap API](https://openweathermap.org/api) (plano gratuito).

Para obter sua chave:
1. Acesse https://openweathermap.org/
2. Crie uma conta gratuita
3. Vá em **API Keys** e copie sua chave
4. Cole no `.env` em `WEATHER_API_KEY`

Sem a chave, o sistema exibe dados climáticos de demonstração.

---

## 📁 Estrutura do Projeto

```
ClimateNow/
├── src/
│   ├── config/db.js          # Conexão com PostgreSQL
│   ├── controllers/          # Lógica de negócio
│   │   ├── authController.js  # Login/Logout (⚠️ Vuln #1)
│   │   ├── adminController.js # Admin (⚠️ Vuln #3)
│   │   └── userController.js  # Usuário (⚠️ Vuln #2)
│   ├── middleware/auth.js    # Autenticação e autorização
│   ├── routes/               # Definição de rotas
│   └── views/                # Templates EJS
├── public/
│   ├── css/style.css         # Estilos
│   └── js/main.js            # JavaScript do cliente
├── database/schema.sql       # Schema + dados iniciais
├── server.js                 # Ponto de entrada
├── .env.example              # Variáveis de ambiente (exemplo)
├── README.md                 # Este arquivo
└── VULNERABILITIES.md        # Guia das vulnerabilidades
```

---

## 🔒 Vulnerabilidades Intencionais

Este projeto foi construído com **3 vulnerabilidades de SQL Injection** para fins educacionais:

1. **Vuln #1** — Login sem parametrização (`authController.js`)
2. **Vuln #2** — Busca de notícias por concatenação (`userController.js`)
3. **Vuln #3** — Busca de usuário pelo admin (`adminController.js`)

Consulte [`VULNERABILITIES.md`](./VULNERABILITIES.md) para:
- Como encontrar cada vulnerabilidade
- Payloads de demonstração
- Como corrigi-las com prepared statements

---

## 📚 Tecnologias

- **Runtime**: Node.js + Express.js
- **Banco de dados**: PostgreSQL (`pg` driver)
- **Template engine**: EJS
- **Autenticação**: express-session + bcryptjs
- **Estilo**: CSS vanilla (Dark theme + Glassmorphism)
- **API externa**: OpenWeatherMap

---

## ⚠️ Aviso Legal

Este projeto é **exclusivamente educacional**. As vulnerabilidades presentes são intencionais e servem para demonstração em contexto acadêmico de Segurança da Informação. **Nunca utilize estas práticas em sistemas reais de produção.**
