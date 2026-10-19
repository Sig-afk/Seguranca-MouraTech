# 🎯 ClimateNow — Apresentação do Projeto Final de Segurança

> **Disciplina:** Segurança da Informação  
> **Tema:** Segurança Aplicada no Sistema Web *ClimateNow*  
> **Duração:** 10 minutos (12 slides — ~50 segundos por slide)  
> **Arquivo Interativo dos Slides:** [slides.html](./slides.html) (abra no navegador para apresentar!)

---

## 📑 Índice dos 12 Slides

| Slide | Título | Tópico do PDF | Foco / Duração |
|---|---|---|---|
| **01** | Capa & Apresentação | Identificação | Título, tema e contexto (40s) |
| **02** | O Sistema ClimateNow & Atores | Item 1: Sistema | Propósito e perfis de usuários (50s) |
| **03** | Arquitetura & Tecnologias | Item 1: Componentes | Frontend, Backend, Banco e API (50s) |
| **04** | Dados Pessoais & Armazenamento | Item 1: Dados Tratados | Minimização, LGPD e logs (50s) |
| **05** | Vulnerabilidade #1: SQL Injection no Login | Item 2: Riscos | Exploração, impacto e patch (60s) |
| **06** | Vulnerabilidade #2: SQLi na Busca de Notícias | Item 2: Riscos | UNION injection, exfiltração e patch (60s) |
| **07** | Vulnerabilidade #3: SQLi na Busca de Usuários | Item 2: Riscos | Ataque no painel admin e patch (50s) |
| **08** | Mecanismos de Proteção Propostos | Item 3: Proteção | Hashing, validações e sessões (60s) |
| **09** | Autenticação & Ciclo de Vida | Item 4: Autenticação | Registro, login, reset e logout (50s) |
| **10** | Autorização & Controle de Acesso (RBAC) | Item 4: Autorização | Middlewares, permissões e exemplos (50s) |
| **11** | Demonstração Prática do Sistema | Item 5: Prática | Execução ao vivo, ataque e defesa (60s) |
| **12** | Conclusão & Lições Aprendidas | Fechamento | Defesa em profundidade e dúvidas (40s) |

---

## 🖥️ Detalhamento dos Slides & Roteiro de Fala (Speaker Notes)

### 🔹 Slide 01 — Capa & Apresentação
- **Título:** ClimateNow — Segurança Aplicada em Sistemas Web
- **Subtítulo:** Arquitetura Defensiva, Análise de Vulnerabilidades e Demonstração Prática
- **Elementos Visuais:** Logo climático (Sol e Nuvem em gradiente azul/âmbar), badges `Node.js`, `Express`, `PostgreSQL`, `Segurança da Informação`.
- **Roteiro de Fala (0:00 - 0:40):**
  > *"Olá a todos, professor e colegas. Hoje apresento o projeto final de Segurança da Informação aplicado ao sistema **ClimateNow**. O ClimateNow é uma aplicação web desenvolvida para fornecer informações climáticas em tempo real e avisos meteorológicos, com perfis bem definidos de usuários e administradores. Vamos analisar a arquitetura do sistema, os dados que ele manipula, três vulnerabilidades reais de SQL Injection criadas para fins de estudo, os mecanismos defensivos aplicados e uma demonstração prática do funcionamento e da correção."*

---

### 🔹 Slide 02 — O Sistema ClimateNow & Seus Usuários (Item 1)
- **Título:** Sistema e Atores da Aplicação
- **Objetivo do Sistema:** Centralizar alertas meteorológicos, notícias ambientais e previsão climática instantânea para comunidades e cidades.
- **Perfis de Usuários:**
  - **Visitante (Não autenticado):** Acesso restrito à página de login institucional.
  - **Usuário Comum (`role: user`):** Visualiza clima local, pesquisa e consome notícias e avisos meteorológicos.
  - **Administrador (`role: admin`):** Publica avisos de emergência, cria/edita/remove notícias e gerencia usuários cadastrados.
- **Roteiro de Fala (0:40 - 1:30):**
  > *"O objetivo central do ClimateNow é ser um canal confiável de informações climáticas e alertas urgentes. Definimos dois tipos de atores fundamentais: o usuário final, que precisa de acesso rápido às condições do tempo e notícias sem complexidade, e o administrador, responsável por emitir alertas de emergência e gerenciar a plataforma. Separar rigidamente essas duas personas é o ponto de partida de toda a nossa modelagem de segurança."*

---

### 🔹 Slide 03 — Arquitetura de Componentes (Item 1)
- **Título:** Arquitetura Tecnológica do Sistema
- **Frontend:** Server-Side Rendering (EJS) com Vanilla CSS moderno (Dark Theme & Glassmorphism). Sem frameworks pesados de cliente, reduzindo a superfície de ataque a scripts de terceiros.
- **Backend:** Node.js com Express. Roteamento modular, middlewares de segurança e controle de sessão via cookies assinados.
- **Banco de Dados:** PostgreSQL 17 relacional. Armazenamento com constraints de integridade, índices e tipagem estrita.
- **Integração Externa:** OpenWeatherMap API para dados de satélite e temperatura em tempo real.
- **Roteiro de Fala (1:30 - 2:20):**
  > *"Na arquitetura, optamos por uma stack moderna e robusta: backend em Node.js com Express e banco PostgreSQL em container Docker. A renderização é feita no servidor via EJS. Isso traz uma grande vantagem de segurança: o cliente não recebe dados desnecessários ou regras de negócio em JavaScript puro, e o controle de autorização é validado antes de qualquer HTML ser entregue ao navegador."*

---

### 🔹 Slide 04 — Dados Pessoais & Governança / LGPD (Item 1)
- **Título:** Dados Pessoais Coletados e Armazenamento
- **Quadro de Dados:**
  - `username` / `email`: Identificação unívoca do usuário no sistema.
  - `password_hash`: Credencial cifrada unidirecionalmente com salt (`bcrypt`).
  - `role`: Perfil de acesso (`admin` ou `user`) para o controle RBAC.
  - `last_login`: Auditoria temporal do último acesso.
  - `access_logs`: Registro forense de tentativas de login (IP, usuário tentado, status de sucesso/falha).
- **Princípio da Minimização:** Não coletamos CPF, telefone ou geolocalização física precisa. Apenas o estritamente indispensável ao funcionamento.
- **Roteiro de Fala (2:20 - 3:10):**
  > *"Em conformidade com as boas práticas e a LGPD, seguimos o princípio da minimização: coletamos apenas o estritamente necessário. Nenhuma senha trafega ou é salva em texto claro. Além disso, criamos uma tabela dedicada de auditoria de acessos (`access_logs`) para registrar tentativas de login, facilitando a detecção precoce de ataques de força bruta ou credenciais comprometidas."*

---

### 🔹 Slide 05 — Vulnerabilidade #1: SQL Injection no Login (Item 2)
- **Título:** Vulnerabilidade 1 — Bypass de Autenticação no Login
- **Localização:** `src/controllers/authController.js` (Rota `POST /login`)
- **Código Vulnerável:**
  ```javascript
  const query = `SELECT * FROM users WHERE username = '${username}'`;
  ```
- **Vetor de Ataque:** Payload `admin' --`
  - A query se torna: `SELECT * FROM users WHERE username = 'admin' --' ...`
  - O operador `--` anula a checagem posterior de senha no SQL.
- **Impacto:** Elevação de privilégio não autorizada para administrador sem saber a senha.
- **Solução Defensiva:**
  ```javascript
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  ```
- **Roteiro de Fala (3:10 - 4:10):**
  > *"Entrando nas vulnerabilidades: a primeira está no fluxo de autenticação. Por concatenar a string do usuário diretamente na query SQL, um invasor que envie `admin' --` altera a semântica da consulta. O `--` comenta o resto da instrução, retornando o registro de admin. Como o sistema recupera esse usuário, o controle de sessão pode ser burlado. A correção mandatória é o uso de Prepared Statements com o placeholder `$1` do driver pg, onde o dado nunca se mistura com o código SQL."*

---

### 🔹 Slide 06 — Vulnerabilidade #2: SQL Injection na Busca de Notícias (Item 2)
- **Título:** Vulnerabilidade 2 — Exfiltração de Dados via UNION Attack
- **Localização:** `src/controllers/userController.js` (Rota `GET /user/dashboard?q=...`)
- **Código Vulnerável:**
  ```javascript
  query = `SELECT * FROM posts WHERE title ILIKE '%${q}%' ...`;
  ```
- **Vetor de Ataque:** Payload `' UNION SELECT id, username, password_hash, role, NOW(), NOW() FROM users --`
- **Impacto:** Extração em massa da tabela de usuários, expondo os hashes de senha e e-mails dos usuários diretamente na tela de notícias.
- **Solução Defensiva:**
  ```javascript
  query = `SELECT * FROM posts WHERE (title ILIKE $1 OR content ILIKE $1) AND published = true`;
  values = [`%${q}%`];
  ```
- **Roteiro de Fala (4:10 - 5:10):**
  > *"A segunda vulnerabilidade ocorre na barra de pesquisa de notícias do usuário comum. Ao concatenar o parâmetro `q` da URL, permitimos um ataque do tipo UNION-Based SQL Injection. Um invasor comum consegue forjar uma união com a tabela `users`, fazendo com que os hashes de senha e nomes de usuários do sistema apareçam listados como se fossem títulos de notícias. A solução é parametrizar e tratar os wildcards `%` como dados vinculados ao parâmetro."*

---

### 🔹 Slide 07 — Vulnerabilidade #3: SQL Injection na Gestão de Usuários (Item 2)
- **Título:** Vulnerabilidade 3 — Injeção no Painel Administrativo
- **Localização:** `src/controllers/adminController.js` (Rota `GET /admin/users?search=...`)
- **Código Vulnerável:**
  ```javascript
  query = `SELECT id, username, email, role, created_at FROM users WHERE username ILIKE '%${search}%'`;
  ```
- **Vetor de Ataque:** Blind SQL Injection / Stacked Queries ou extração de metadados do schema (`information_schema.tables`).
- **Impacto:** Mesmo dentro de uma área restrita, permite escalonamento lateral, leitura de segredos internos do banco e potencial corrupção de registros.
- **Solução Defensiva:** Prepared statements com validação de entrada via regex alfanumérico estrito (`/^[a-zA-Z0-9_.-]+$/`).
- **Roteiro de Fala (5:10 - 6:00):**
  > *"A terceira falha está na busca de usuários no painel de administração. É um exemplo clássico de falsa sensação de segurança: desenvolvedores muitas vezes presumem que áreas restritas a admins não precisam de sanitização. Se a conta de um admin for comprometida ou sofrer CSRF, o atacante pode executar queries arbitrárias e enumerar todo o catálogo do PostgreSQL. Corrigimos com prepared statements e validação prévia de tipo."*

---

### 🔹 Slide 08 — Mecanismos de Proteção Propostos (Item 3)
- **Título:** Camadas de Defesa em Profundidade
- **1. Hashing com Bcrypt:** Fator de custo 10 (Salt rounds) para cálculo exponencialmente lento de hashes, neutralizando rainbow tables e ataques de dicionário acelerados por GPU.
- **2. Validação & Whitelisting:** Filtro de entrada no backend antes de qualquer operação de persistência.
- **3. Segurança de Sessões:** Módulo `express-session` com cookie assinado, flags `httpOnly` (evita leitura por JavaScript/XSS) e chave de sessão randômica de alta entropia.
- **4. Isolamento de Credenciais:** Variáveis de ambiente (`.env`) protegidas por permissões de arquivo e fora do versionamento Git.
- **Roteiro de Fala (6:00 - 7:00):**
  > *"Para blindar o sistema, estruturamos uma estratégia de Defesa em Profundidade. Primeiro, armazenamos senhas com Bcrypt em 10 salt rounds — mesmo em caso de vazamento da base, os hashes são computacionalmente inviáveis de quebrar. Segundo, cookies de sessão marcados como httpOnly e assinados criptograficamente. Terceiro, isolamento completo de credenciais por variáveis de ambiente, nunca hardcoded no código-fonte."*

---

### 🔹 Slide 09 — Autenticação & Ciclo de Vida da Conta (Item 4)
- **Título:** Fluxo Completo de Autenticação
- **Ciclo:**
  - **Login:** Recebe credenciais ➔ Localiza usuário via query segura ➔ Compara senha com `bcrypt.compare()` ➔ Cria sessão em memória.
  - **Logout:** Invalidação da sessão no servidor via `req.session.destroy()` e remoção do cookie no navegador.
  - **Recuperação de Acesso Proposta:** Emissão de token criptográfico temporário (expiração em 15 minutos), enviado por e-mail, com link único. Sem perguntas secretas vulneráveis a engenharia social e sem revelar se o e-mail existe no banco (prevenindo enumeração).
- **Roteiro de Fala (7:00 - 7:50):**
  > *"O ciclo de autenticação foi desenhado para ser determinístico e à prova de vazamento de informações. No login, as mensagens de erro são genéricas ('Usuário ou senha inválidos'), impedindo que um atacante descubra quais contas existem no sistema. No logout, a sessão é destruída tanto do lado do servidor quanto do cliente. E para recuperação de senha, o modelo padrão de mercado baseado em token efêmero com expiração curta é a abordagem ideal."*

---

### 🔹 Slide 10 — Autorização & Controle de Acesso Baseado em Papéis (RBAC) (Item 4)
- **Título:** Matriz de Acesso & Verificação no Backend
- **Tabela de Permissões (RBAC):**
  | Ação / Rota | Visitante | Usuário Comum | Administrador |
  |---|:---:|:---:|:---:|
  | Ver Clima / Notícias | ❌ Redireciona Login | ✅ Permitido | ✅ Permitido |
  | Criar Notícia / Aviso | ❌ 403 Forbidden | ❌ 403 Forbidden | ✅ Permitido |
  | Deletar Posts | ❌ 403 Forbidden | ❌ 403 Forbidden | ✅ Permitido |
  | Listar Usuários | ❌ 403 Forbidden | ❌ 403 Forbidden | ✅ Permitido |
- **Implementação via Middlewares:**
  - `requireAuth`: Verifica `req.session.user`
  - `requireRole('admin')`: Intercepta e rejeita com HTTP 403 se não for admin.
- **Roteiro de Fala (7:50 - 8:40):**
  > *"Na camada de autorização, aplicamos o modelo RBAC por meio de middlewares encadeados no Express. Um usuário comum autenticado que tente forjar uma requisição para `/admin/posts/new` é barrado pelo middleware `requireRole`, recebendo resposta HTTP 403 Forbidden. A permissão é verificada na origem de cada rota, impedindo qualquer acesso por 'adivinhação' de URLs."*

---

### 🔹 Slide 11 — Demonstração Prática da Aplicação (Item 5)
- **Título:** Demonstração Prática & Ambiente de Testes
- **Aplicação Rodando Localmente:** `http://localhost:3000`
- **Cenários Demonstrados:**
  1. Login legítimo com perfil restrito (`joao`) vs perfil administrativo (`admin`).
  2. Execução controlada do payload de SQL Injection demonstrando a falha.
  3. Aplicação da correção em tempo real (substituição por Prepared Statement).
  4. Nova tentativa de ataque resultando em bloqueio e registro na auditoria.
- **Roteiro de Fala (8:40 - 9:40):**
  > *"Na demonstração prática, o ClimateNow roda localmente conectado ao PostgreSQL. Mostramos a segregação de interfaces entre o João e o Administrador, executamos os testes de SQL Injection mapeados em nosso documento VULNERABILITIES.md e comprovamos como o código corrigido neutraliza os ataques imediatamente, sem impactar a performance."*

---

### 🔹 Slide 12 — Conclusão & Lições Aprendidas
- **Título:** Conclusões e Melhores Práticas
- **Principais Aprendizados:**
  - 1. **Zero Trust em Inputs:** Toda entrada externa é hostil até que se prove o contrário.
  - 2. **Prepared Statements são Mandatórios:** O único remédio definitivo contra SQL Injection.
  - 3. **Segurança não é um anexo:** Deve ser planejada desde a arquitetura do banco e rotas.
  - 4. **Logs e Visibilidade:** Sem auditoria, ataques acontecem de forma invisível.
- **Agradecimento & Perguntas da Banca:** Aberto para arguição.
- **Roteiro de Fala (9:40 - 10:00):**
  > *"Concluímos que a segurança de software não é uma camada adicionada no final, mas sim uma mentalidade presente desde a escolha do driver de banco até os atributos dos cookies de sessão. O ClimateNow demonstra tanto os riscos reais do descuido com queries dinâmicas quanto a simplicidade elegante de corrigi-los com padrões da indústria. Muito obrigado pela atenção de todos, fico aberto a dúvidas!"*

---