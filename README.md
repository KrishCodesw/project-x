# Base Starter Kit

A production-ready Next.js 16 boilerplate designed for rapid development, hackathons, and SaaS foundations. 

## Features

* Next.js 16 App Router with Turbopack
* Type-safe database management with Prisma v6 and Neon PostgreSQL
* End-to-end authentication with Auth.js v5 (Google OAuth & Credentials)
* Complete password reset flow with Resend email integration
* UI components powered by Shadcn, Tailwind CSS, and Radix
* Dark mode support via next-themes
* Client state management with Zustand
* URL query state syncing with Nuqs
* Build-time environment variable validation via t3-env
* Pre-configured GitHub Actions for CI/CD
* Standalone Dockerfile for platform-agnostic deployment

## Environment Variables

Copy the `.env.example` file to `.env` and fill in your values.

DATABASE_URL="postgresql://user:password@host/db"
AUTH_SECRET="generate_a_random_32_character_string"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional (Required for specific features)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
RESEND_API_KEY=""

## Manual Setup

1. Install dependencies
npm install

2. Push the database schema
npx prisma db push

3. Start the development server
npm run dev

The application will be available at http://localhost:3000.

## Docker Setup

This project includes a multi-stage Dockerfile optimized for Next.js standalone output.

1. Build the Docker image
During the build phase, t3-env will check for environment variables. You can pass dummy variables for the build process.

docker build -t base-starter-kit \
  --build-arg DATABASE_URL="postgresql://dummy" \
  --build-arg AUTH_SECRET="dummy" \
  .

2. Run the container
Pass your actual environment variables when running the container.

docker run -p 3000:3000 \
  -e DATABASE_URL="your_actual_db_url" \
  -e AUTH_SECRET="your_actual_secret" \
  base-starter-kit

## Scripts

* `npm run dev`: Starts the Turbopack development server.
* `npm run build`: Builds the application for production.
* `npm run start`: Runs the built production application.
* `npm run lint`: Runs ESLint.