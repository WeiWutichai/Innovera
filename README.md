# Innovera - Modern Product Team Workflow Platform

A full-stack Next.js application for managing product development workflows with bilingual support (English/Thai).

## 🚀 Features

- **Authentication**: NextAuth v5 with Google OAuth and credentials provider
- **Role-Based Access**: User and Admin roles with protected routes
- **Bilingual Support**: Complete English/Thai translation system
- **Blog System**: Full-featured blog with admin dashboard
- **Demo Requests**: Public demo request form with admin management
- **Modern UI**: Built with React 19, Next.js 16, and Tailwind CSS

## 📋 Prerequisites

- Node.js 20+ 
- PostgreSQL 15+
- Docker & Docker Compose (optional)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Innovera
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/innovera"

# Authentication
AUTH_SECRET="your-super-secret-key-here"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# PostgreSQL (for Docker)
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=innovera

# Ports
APP_PORT=3000
```

⚠️ **IMPORTANT**: Generate a strong `AUTH_SECRET` before deploying to production:
```bash
openssl rand -base64 32
```

### 4. Database Setup

#### Option A: Using Docker Compose (Recommended)

```bash
# Start PostgreSQL database
docker-compose up -d database

# Run migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

#### Option B: Local PostgreSQL

```bash
# Make sure PostgreSQL is running locally
# Update DATABASE_URL in .env to point to your local instance

# Run migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### 5. Create Admin User

The admin password is never hardcoded. Supply it via the `ADMIN_PASSWORD`
environment variable when running the seed script (`ADMIN_EMAIL` is optional and
defaults to `admin@innovera.com`):

```bash
# Run the admin seed script with a strong password
ADMIN_PASSWORD='<choose-a-strong-password>' node prisma/seed-admin.js

# Optionally override the admin email
ADMIN_EMAIL='you@example.com' ADMIN_PASSWORD='<choose-a-strong-password>' node prisma/seed-admin.js
```

The script aborts if `ADMIN_PASSWORD` is not set, and re-running it never resets
an existing admin's password (only the initial `create` sets it).

⚠️ **Change this password after first login, and store it only in a secrets
manager — never commit it.**

🔒 **Security note**: An admin password was previously committed to this file.
That password must be considered compromised and rotated immediately wherever it
was used.

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

### Using Docker Compose

```bash
# Start all services (database + app)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 📁 Project Structure

```
Innovera/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── blogs/        # Blog API
│   │   ├── demo-request/ # Demo request API
│   │   ├── register/     # User registration
│   │   └── users/        # User management
│   ├── admin/            # Admin dashboard pages
│   ├── components/       # React components
│   ├── context/          # React context providers
│   └── locales/          # Translation files
├── lib/                   # Utility libraries
│   ├── prisma.ts         # Prisma client singleton
│   └── validation.ts     # Zod validation schemas
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Migration files
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🔐 API Endpoints

### Public Endpoints

- `POST /api/register` - User registration
- `POST /api/demo-request` - Submit demo request
- `GET /api/blogs` - Get published blog posts

### Protected Endpoints (Admin Only)

- `GET /api/demo-request` - List all demo requests
- `GET /api/users` - List all users
- `POST /api/blogs` - Create blog post
- `PUT /api/blogs/[id]` - Update blog post
- `DELETE /api/blogs/[id]` - Delete blog post

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🔧 Database Management

```bash
# Open Prisma Studio (Database GUI)
npx prisma studio

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (⚠️ Deletes all data)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

## 🌐 Deployment

### Environment Variables

Ensure these environment variables are set in production:

- `DATABASE_URL` - Production database connection string
- `AUTH_SECRET` - Strong random secret (use `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Production URL
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (if using)
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret (if using)

### Build for Production

```bash
npm run build
```

The app is configured with `output: "standalone"` for optimized Docker deployments.

## 📝 Development Guidelines

### Code Quality

- Use TypeScript for type safety
- Follow ESLint rules: `npm run lint`
- Use Zod for input validation
- Use the singleton Prisma instance from `lib/prisma.ts`

### Adding New Features

1. Create database schema changes in `prisma/schema.prisma`
2. Run `npx prisma migrate dev`
3. Add validation schemas in `lib/validation.ts`
4. Create API routes in `app/api/`
5. Add TypeScript types in `types/`
6. Create UI components in `app/components/`

## 🐛 Troubleshooting

### Prisma Client Errors

```bash
# Regenerate Prisma Client
npx prisma generate
```

### Database Connection Issues

- Check that PostgreSQL is running
- Verify `DATABASE_URL` in `.env`
- Ensure database exists: `createdb innovera`

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## 📚 Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript 5
- **Database**: PostgreSQL 15
- **ORM**: Prisma 5
- **Authentication**: NextAuth v5
- **Validation**: Zod
- **Styling**: Tailwind CSS 4
- **UI Components**: Framer Motion, Lucide Icons
- **Testing**: Jest, React Testing Library

## 📄 License

This project is proprietary and confidential.

## 👥 Support

For support, email info@innovera.co.th or contact via Line/WhatsApp.
