# Documentação Técnica - Next Movisat

## Visão Geral
O Next Movisat é um sistema abrangente de gestão de frotas construído com Next.js que foca em checklists de inspeção veicular, lembretes de manutenção e supervisão de frotas. O sistema suporta gestão multi-empresarial com controle de acesso baseado em funções.

## Arquitetura

### Stack Tecnológico

#### Frontend
- **Framework**: Next.js 15.1.2 com App Router
- **Framework de UI**: Material-UI (MUI) 6.2.1
- **Estilização**: Tailwind CSS 3.4.17 com configuração customizada
- **Gerenciamento de Estado**: Redux Toolkit 2.5.0
- **Manipulação de Formulários**: React Hook Form 7.54.1 com validação Valibot/Yup
- **Gráficos/Visualização**: Recharts 2.15.0, ApexCharts 3.49.0
- **Ícones**: Iconify React 5.2.1
- **Manipulação de Datas**: Luxon 3.6.1

#### Backend
- **Runtime**: Node.js com API Routes do Next.js
- **Banco de Dados**: MySQL 8.0+ com TypeORM 0.3.25
- **Autenticação**: NextAuth.js 4.24.11 com estratégia JWT
- **Autorização**: CASL 6.7.3 para permissões baseadas em funções
- **Manipulação de Arquivos**: Multer 2.0.1, Sharp 0.33.5 para processamento de imagens
- **Hash de Senhas**: bcrypt 6.0.0

#### Ferramentas de Desenvolvimento
- **Linguagem**: TypeScript 5.5.4
- **Qualidade de Código**: ESLint, Prettier, Stylelint
- **Ferramenta de Build**: Turbopack (Next.js 15)
- **Gerenciador de Pacotes**: npm

### Schema do Banco de Dados

#### Entidades Principais

1. **Usuários (`usuarios`)**
   - `id`: Chave primária
   - `id_empresa`: Associação com empresa
   - `nome`: Nome completo
   - `email`: Email único (autenticação)
   - `password`: Senha com hash
   - `tipo_acesso`: Função (0=Admin, 1=Supervisor, 2=Motorista)
   - `cpf`: CPF brasileiro
   - `telefone`: Número de telefone
   - `status`: Status da conta
   - `alertas`: Configuração de alertas do usuário

2. **Empresas (`empresas`)**
   - `id`: Chave primária
   - `cnpj`: CNPJ da empresa
   - `nome_fantasia`: Nome da empresa
   - `email`: Email de contato da empresa
   - `contato_responsavel`: Contato responsável

3. **Veículos (`veiculos`)**
   - `id`: Chave primária
   - `id_usuario`: Motorista designado
   - `id_empresa`: Empresa proprietária
   - `modelo`, `cor`, `placa`: Detalhes do veículo
   - `apelido`: Apelido do veículo
   - `status`: Status do veículo
   - `ultimo_checklist`: Data da última inspeção
   - `tipo_checklist`: Tipo do último checklist

4. **Checklists** (Três tipos: Diário, Semanal, Mensal)
   - **Diário (`checklist_diario`)**: Verificações básicas de segurança (luzes, lataria, vidros, combustível, água)
   - **Semanal (`checklist_semanal`)**: Itens de manutenção (óleo, fluido de freio, pneus, escapamento)
   - **Mensal (`checklist_mensal`)**: Inspeção interior/detalhada (estofados, documentação, bateria)
   
   Cada checklist inclui:
   - Itens de inspeção com status (OK/Não Conforme)
   - Campos de observação
   - Anexos de imagens (array JSON)
   - Selfie do motorista
   - Confirmação de conformidade

5. **Lembretes (`lembretes`)**
   - `id`: Chave primária
   - `usuario_id`: Usuário designado
   - `titulo`: Título do lembrete
   - `descricao`: Descrição
   - `data`: Data de vencimento
   - `hora`: Hora de vencimento

6. **Notificações (`notificacoes`)**
   - Notificações geradas pelo sistema
   - Rastreamento de status de leitura (`notificacao_lida`)

### Autenticação e Autorização

#### Fluxo de Autenticação
1. **Provedor de Credenciais**: Autenticação por email/senha
2. **Segurança de Senha**: Hash bcrypt com salt
3. **Gerenciamento de Sessão**: Tokens JWT com expiração de 3 dias
4. **Persistência de Token**: Tokens de acesso armazenados no banco (`remember_token`)
5. **Validação de Sessão**: Validação em tempo real no banco a cada requisição

#### Controle de Acesso Baseado em Funções (RBAC)

**Administrador (tipo_acesso: 0)**
- Acesso completo ao sistema
- Gerenciamento de usuários (`usuarios`)
- Gerenciamento de empresas (`empresas`)
- Gerenciamento de veículos (`veiculos`)
- Acesso a relatórios (`relatorios`)
- Supervisão de checklists (`checklists`)
- Operações de limpeza de dados (`limpezas`)

**Supervisor (tipo_acesso: 1)**
- Acesso com escopo da empresa
- Gerenciamento de lembretes (`lembretes`)
- Gerenciamento de notificações (`notificacoes`)
- Rastreamento de incidentes (`ocorrencias`)
- Relatórios de não conformidade (`inconformidades`)

**Motorista (tipo_acesso: 2)**
- Acesso apenas a veículos pessoais
- Execução de checklists
- Gerenciamento básico de perfil

## Configuração do Ambiente

### Variáveis de Ambiente Obrigatórias

```env
# Configuração do Banco de Dados
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=next_movisat

# Autenticação
NEXTAUTH_SECRET=sua-chave-super-secreta-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Configuração do Next.js
BASEPATH=/caminho-base-opcional
NODE_ENV=development|production
```

### Configuração Opcional

```env
# Desenvolvimento
NEXT_PUBLIC_DEV_MODE=true
DISABLE_DEV_OVERLAY=true
DISABLE_REACT_STRICT_MODE=true
```

## Configuração para Desenvolvimento Local

### Pré-requisitos
- Node.js 18.0.0 ou superior
- MySQL 8.0 ou superior
- Gerenciador de pacotes npm ou yarn

### Passos de Instalação

1. **Clonar Repositório**
   ```bash
   git clone <url-do-repositorio>
   cd next-movisat
   ```

2. **Instalar Dependências**
   ```bash
   npm install
   ```

3. **Configurar Banco de Dados**
   ```bash
   # Criar banco MySQL
   mysql -u root -p
   CREATE DATABASE next_movisat;
   ```

4. **Configurar Ambiente**
   ```bash
   # Copiar template de ambiente
   cp .env.example .env.local
   
   # Editar .env.local com sua configuração
   ```

5. **Construir Ícones (Obrigatório)**
   ```bash
   npm run build:icons
   ```

6. **Iniciar Servidor de Desenvolvimento**
   ```bash
   npm run dev
   # ou com Turbopack (mais rápido)
   npm run dev
   ```

7. **Acessar Aplicação**
   - Local: http://localhost:3000
   - O schema do banco será criado automaticamente na primeira execução (synchronize: true)

### Scripts de Desenvolvimento

```bash
# Desenvolvimento com Turbopack
npm run dev

# Modo produção em desenvolvimento
npm run dev:prod

# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Linting
npm run lint
npm run lint:fix

# Formatação de código
npm run format

# Geração de ícones
npm run build:icons
```

## Deploy em Produção

### Processo de Build

1. **Preparar Ambiente**
   ```bash
   # Definir variáveis de ambiente de produção
   export NODE_ENV=production
   export NEXTAUTH_SECRET="seu-secret-de-producao"
   export NEXTAUTH_URL="https://seu-dominio.com"
   ```

2. **Construir Aplicação**
   ```bash
   npm run build
   ```

3. **Iniciar Servidor de Produção**
   ```bash
   npm start
   ```

### Considerações de Produção

#### Configuração do Banco de Dados
- **Pool de Conexões**: Configurar limites de conexão MySQL
- **Backups**: Implementar backups regulares do banco
- **Migrações**: Atualizações manuais de schema (synchronize: false em produção)

#### Armazenamento de Arquivos
- **Upload de Imagens**: Manipulado via rota `/api/uploads/[...path]`
- **Diretório**: `public/uploads/checklists/`
- **Permissões**: Garantir acesso de escrita ao diretório de upload
- **Persistência**: Usar volumes em deployments containerizados

#### Otimização de Performance
- **Assets Estáticos**: Servidos pelo build do Next.js
- **Otimização de Imagens**: Sharp.js para processamento de imagens
- **Cache**: Rotas da API incluem headers de cache apropriados
- **Otimização de Bundle**: Webpack externals para pacotes server-only

#### Segurança
- **Secrets de Produção**: Usar NEXTAUTH_SECRET seguro e aleatório
- **HTTPS**: Obrigatório para autenticação em produção
- **CORS**: Configurado para requisições same-origin
- **Upload de Arquivos**: Validação e limites de tamanho implementados

### Deploy com Docker (Recomendado)

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de pacote
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Construir aplicação
RUN npm run build

# Criar diretório de uploads
RUN mkdir -p public/uploads/checklists

# Expor porta
EXPOSE 3000

# Iniciar aplicação
CMD ["npm", "start"]
```

### Configuração Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_DATABASE=next_movisat
      - DB_USERNAME=movisat
      - DB_PASSWORD=senha_segura
      - NEXTAUTH_SECRET=seu-secret-de-producao
      - NEXTAUTH_URL=https://seu-dominio.com
    volumes:
      - uploads:/app/public/uploads
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=senha_root
      - MYSQL_DATABASE=next_movisat
      - MYSQL_USER=movisat
      - MYSQL_PASSWORD=senha_segura
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
  uploads:
```

### Deploy em VPS

1. **Configuração do Servidor**
   ```bash
   # Atualizar sistema
   sudo apt update && sudo apt upgrade -y
   
   # Instalar Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Instalar MySQL
   sudo apt install mysql-server -y
   
   # Instalar PM2 para gerenciamento de processos
   npm install -g pm2
   ```

2. **Deploy da Aplicação**
   ```bash
   # Clonar e construir
   git clone <url-do-repositorio>
   cd next-movisat
   npm ci
   npm run build
   
   # Iniciar com PM2
   pm2 start npm --name "next-movisat" -- start
   pm2 save
   pm2 startup
   ```

3. **Proxy Reverso (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name seu-dominio.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Arquitetura da API

### Estrutura de Rotas
```
/api
├── data/
│   ├── checklists/
│   │   ├── admin/
│   │   │   ├── list/          # Dados paginados de checklist
│   │   │   ├── export/        # Exportação CSV
│   │   │   ├── delete/        # Exclusão em lote
│   │   │   └── options/       # Opções de filtro
│   ├── inconformidades/       # Relatórios de não conformidade
│   ├── lembretes/             # CRUD de lembretes
│   ├── motorista/
│   │   ├── veiculos/          # Veículos do motorista
│   │   └── checklist/         # Submissão de checklist
│   ├── notificacoes/          # Notificações
│   ├── ocorrencias/           # Incidentes
│   └── usuarios/              # Gerenciamento de usuários
├── uploads/
│   └── [...path]/             # Servir arquivos dinamicamente
└── test/
    └── db/                    # Teste de conectividade do banco
```

### Tratamento de Erros
- **Validação**: Validação abrangente de entrada
- **Autenticação**: Verificações de auth baseadas em middleware
- **Banco de Dados**: Rollback de transação em erros
- **Logging**: Log centralizado de erros
- **Resposta**: Formato consistente de resposta de erro

### Recursos de Performance
- **Otimização de Consultas**: Query builder do TypeORM para consultas complexas
- **Paginação**: Paginação eficiente de dados
- **Processamento de Imagens**: Sharp.js para manipulação otimizada de imagens
- **Cache**: Cache de resposta onde apropriado

## Monitoramento e Manutenção

### Verificações de Saúde
- **Banco de Dados**: `/api/test/db` - Teste de conectividade do banco
- **Autenticação**: Endpoints de validação de sessão
- **Sistema de Arquivos**: Acessibilidade do diretório de upload

### Logging
- **Logs da Aplicação**: Logging baseado em console e arquivo
- **Consultas do Banco**: Logging de consultas do TypeORM
- **Eventos de Autenticação**: Rastreamento de login/logout
- **Rastreamento de Erros**: Logging abrangente de erros com stack traces

### Estratégia de Backup
- **Banco de Dados**: Dumps regulares do MySQL
- **Uploads de Arquivos**: Backup do diretório de uploads
- **Configuração**: Controle de versão para configs de ambiente

### Atualizações e Manutenção
- **Dependências**: Atualizações regulares de segurança
- **Banco de Dados**: Planejamento de migração de schema
- **Performance**: Monitoramento regular de performance
- **Segurança**: Auditorias periódicas de segurança