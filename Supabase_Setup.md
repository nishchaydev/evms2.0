# Supabase Setup Guide

The project has been migrated to use **PostgreSQL (Supabase)** as the database provider.

## 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Get your **Database Credentials** from Project Settings > Database.

## 2. Configure Environment Variables
Create or update your `.env` file in the root directory:

```env
# Transaction Pooler (Used for Serverless/Edge) - Port 6543
DATABASE_URL="postgres://postgres.[project-ref]:[password]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Session Pooler (Used for Migrations/Direct) - Port 5432
DIRECT_URL="postgres://postgres.[project-ref]:[password]@aws-0-region.pooler.supabase.com:5432/postgres"

# NextAuth Secret (Generate one: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 3. Apply Schema
Run the following command to push the schema to your new database:

```bash
npx prisma db push
```

## 4. Verify
Restart the server:
```bash
npm run dev
```
