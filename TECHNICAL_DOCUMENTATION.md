# Technical Documentation - Next Movisat

## Overview
Next Movisat is a comprehensive fleet management system built with Next.js that focuses on vehicle inspection checklists, maintenance reminders, and fleet oversight. The system supports multi-tenant company management with role-based access control.

## Architecture

### Technology Stack

#### Frontend
- **Framework**: Next.js 15.1.2 with App Router
- **UI Framework**: Material-UI (MUI) 6.2.1
- **Styling**: Tailwind CSS 3.4.17 with custom configuration
- **State Management**: Redux Toolkit 2.5.0
- **Form Handling**: React Hook Form 7.54.1 with Valibot/Yup validation
- **Charts/Visualization**: Recharts 2.15.0, ApexCharts 3.49.0
- **Icons**: Iconify React 5.2.1
- **Date Handling**: Luxon 3.6.1

#### Backend
- **Runtime**: Node.js with Next.js API Routes
- **Database**: MySQL 8.0+ with TypeORM 0.3.25
- **Authentication**: NextAuth.js 4.24.11 with JWT strategy
- **Authorization**: CASL 6.7.3 for role-based permissions
- **File Handling**: Multer 2.0.1, Sharp 0.33.5 for image processing
- **Password Hashing**: bcrypt 6.0.0

#### Development Tools
- **Language**: TypeScript 5.5.4
- **Code Quality**: ESLint, Prettier, Stylelint
- **Build Tool**: Turbopack (Next.js 15)
- **Package Manager**: npm

### Database Schema

#### Core Entities

1. **Users (`usuarios`)**
   - `id`: Primary key
   - `id_empresa`: Company association
   - `nome`: Full name
   - `email`: Unique email (authentication)
   - `password`: Hashed password
   - `tipo_acesso`: Role (0=Admin, 1=Supervisor, 2=Driver)
   - `cpf`: Brazilian tax ID
   - `telefone`: Phone number
   - `status`: Account status
   - `alertas`: User alerts configuration

2. **Companies (`empresas`)**
   - `id`: Primary key
   - `cnpj`: Brazilian company registration
   - `nome_fantasia`: Company name
   - `email`: Company contact email
   - `contato_responsavel`: Responsible contact

3. **Vehicles (`veiculos`)**
   - `id`: Primary key
   - `id_usuario`: Assigned driver
   - `id_empresa`: Company owner
   - `modelo`, `cor`, `placa`: Vehicle details
   - `apelido`: Vehicle nickname
   - `status`: Vehicle status
   - `ultimo_checklist`: Last inspection date
   - `tipo_checklist`: Last checklist type

4. **Checklists** (Three types: Daily, Weekly, Monthly)
   - **Daily (`checklist_diario`)**: Basic safety checks (lights, body, windows, fuel, water)
   - **Weekly (`checklist_semanal`)**: Maintenance items (oil, brake fluid, tires, exhaust)
   - **Monthly (`checklist_mensal`)**: Interior/detailed inspection (upholstery, documentation, battery)
   
   Each checklist includes:
   - Inspection items with status (OK/Not OK)
   - Observation fields
   - Image attachments (JSON array)
   - Driver selfie
   - Compliance acknowledgment

5. **Reminders (`lembretes`)**
   - `id`: Primary key
   - `usuario_id`: Assigned user
   - `titulo`: Reminder title
   - `descricao`: Description
   - `data`: Due date
   - `hora`: Due time

6. **Notifications (`notificacoes`)**
   - System-generated notifications
   - Read status tracking (`notificacao_lida`)

### Authentication & Authorization

#### Authentication Flow
1. **Credential Provider**: Email/password authentication
2. **Password Security**: bcrypt hashing with salt
3. **Session Management**: JWT tokens with 3-day expiration
4. **Token Persistence**: Access tokens stored in database (`remember_token`)
5. **Session Validation**: Real-time database validation on each request

#### Role-Based Access Control (RBAC)

**Admin (tipo_acesso: 0)**
- Complete system access
- User management (`usuarios`)
- Company management (`empresas`)
- Vehicle management (`veiculos`)
- Report access (`relatorios`)
- Checklist oversight (`checklists`)
- Data cleanup operations (`limpezas`)

**Supervisor (tipo_acesso: 1)**
- Company-scoped access
- Reminder management (`lembretes`)
- Notification management (`notificacoes`)
- Incident tracking (`ocorrencias`)
- Non-compliance reports (`inconformidades`)

**Driver (tipo_acesso: 2)**
- Personal vehicle access only
- Checklist execution
- Basic profile management

## Environment Configuration

### Required Environment Variables

```env
# Database Configuration
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=next_movisat

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Next.js Configuration
BASEPATH=/optional-base-path
NODE_ENV=development|production
```

### Optional Configuration

```env
# Development
NEXT_PUBLIC_DEV_MODE=true
DISABLE_DEV_OVERLAY=true
DISABLE_REACT_STRICT_MODE=true
```

## Local Development Setup

### Prerequisites
- Node.js 18.0.0 or higher
- MySQL 8.0 or higher
- npm or yarn package manager

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd next-movisat
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE next_movisat;
   ```

4. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Edit .env.local with your configuration
   ```

5. **Build Icons (Required)**
   ```bash
   npm run build:icons
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   # or with Turbopack (faster)
   npm run dev
   ```

7. **Access Application**
   - Local: http://localhost:3000
   - The database schema will auto-create on first run (synchronize: true)

### Development Scripts

```bash
# Development with Turbopack
npm run dev

# Production mode in development
npm run dev:prod

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format

# Icon generation
npm run build:icons
```

## Production Deployment

### Build Process

1. **Prepare Environment**
   ```bash
   # Set production environment variables
   export NODE_ENV=production
   export NEXTAUTH_SECRET="your-production-secret"
   export NEXTAUTH_URL="https://your-domain.com"
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

### Production Considerations

#### Database Configuration
- **Connection Pooling**: Configure MySQL connection limits
- **Backups**: Implement regular database backups
- **Migrations**: Manual schema updates (synchronize: false in production)

#### File Storage
- **Image Uploads**: Handled via `/api/uploads/[...path]` route
- **Directory**: `public/uploads/checklists/`
- **Permissions**: Ensure write access to upload directory
- **Persistence**: Use volumes in containerized deployments

#### Performance Optimization
- **Static Assets**: Served from Next.js build
- **Image Optimization**: Sharp.js for image processing
- **Caching**: API routes include proper cache headers
- **Bundle Optimization**: Webpack externals for server-only packages

#### Security
- **Production Secrets**: Use secure, random NEXTAUTH_SECRET
- **HTTPS**: Required for production authentication
- **CORS**: Configured for same-origin requests
- **File Upload**: Validation and size limits implemented

### Docker Deployment (Recommended)

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create uploads directory
RUN mkdir -p public/uploads/checklists

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### Docker Compose Setup

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
      - DB_PASSWORD=secure_password
      - NEXTAUTH_SECRET=your-production-secret
      - NEXTAUTH_URL=https://your-domain.com
    volumes:
      - uploads:/app/public/uploads
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=root_password
      - MYSQL_DATABASE=next_movisat
      - MYSQL_USER=movisat
      - MYSQL_PASSWORD=secure_password
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
  uploads:
```

### VPS Deployment

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MySQL
   sudo apt install mysql-server -y
   
   # Install PM2 for process management
   npm install -g pm2
   ```

2. **Application Deployment**
   ```bash
   # Clone and build
   git clone <repository-url>
   cd next-movisat
   npm ci
   npm run build
   
   # Start with PM2
   pm2 start npm --name "next-movisat" -- start
   pm2 save
   pm2 startup
   ```

3. **Reverse Proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
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

## API Architecture

### Route Structure
```
/api
├── data/
│   ├── checklists/
│   │   ├── admin/
│   │   │   ├── list/          # Paginated checklist data
│   │   │   ├── export/        # CSV export
│   │   │   ├── delete/        # Bulk delete
│   │   │   └── options/       # Filter options
│   ├── inconformidades/       # Non-compliance reports
│   ├── lembretes/             # Reminders CRUD
│   ├── motorista/
│   │   ├── veiculos/          # Driver vehicles
│   │   └── checklist/         # Checklist submission
│   ├── notificacoes/          # Notifications
│   ├── ocorrencias/           # Incidents
│   └── usuarios/              # User management
├── uploads/
│   └── [...path]/             # Dynamic file serving
└── test/
    └── db/                    # Database connectivity test
```

### Error Handling
- **Validation**: Comprehensive input validation
- **Authentication**: Middleware-based auth checks
- **Database**: Transaction rollback on errors
- **Logging**: Centralized error logging
- **Response**: Consistent error response format

### Performance Features
- **Query Optimization**: TypeORM query builder for complex queries
- **Pagination**: Efficient data pagination
- **Image Processing**: Sharp.js for optimal image handling
- **Caching**: Response caching where appropriate

## Monitoring & Maintenance

### Health Checks
- **Database**: `/api/test/db` - Database connectivity test
- **Authentication**: Session validation endpoints
- **File System**: Upload directory accessibility

### Logging
- **Application Logs**: Console and file-based logging
- **Database Queries**: TypeORM query logging
- **Authentication Events**: Login/logout tracking
- **Error Tracking**: Comprehensive error logging with stack traces

### Backup Strategy
- **Database**: Regular MySQL dumps
- **File Uploads**: Backup uploads directory
- **Configuration**: Version control for environment configs

### Updates & Maintenance
- **Dependencies**: Regular security updates
- **Database**: Schema migration planning
- **Performance**: Regular performance monitoring
- **Security**: Periodic security audits