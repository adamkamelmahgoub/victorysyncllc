# VictorySync - Contact Center & AI Automation Platform

A comprehensive contact center and AI automation platform built with React and Express, helping US businesses reduce customer service costs by up to 60%.

## Features

- 🏢 **Professional Contact Center Services** - 24/7 inbound/outbound support
- 🤖 **AI Automation Suite** - Intelligent chatbots and workflow automation  
- 📊 **Customer Dashboard** - Order tracking and service management
- 🛒 **E-commerce Integration** - Service packages with shopping cart
- 🔐 **Secure Authentication** - Email/password authentication with JWT tokens
- 💳 **Payment Processing** - Stripe integration for secure transactions

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Environment variables (see Configuration)

### Development

```bash
# Install dependencies (done automatically on Replit)
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Push database schema
npm run db:push

# Start development server
npm run dev
```

Visit http://localhost:5000 to access the application.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Run authentication tests
node scripts/testAuth.mjs
```

## Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT Authentication
JWT_SECRET="your-secret-key-min-32-chars"

# Server
PORT=5000
NODE_ENV=production
```



### Stripe Configuration (Optional)

For payment processing:

```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## Authentication System

VictorySync includes a complete authentication system with:

### Email/Password Authentication
- User registration with name, email, password
- Secure login with JWT tokens (30-day expiry)
- Password hashing with bcrypt
- Protected routes with middleware

### OAuth Social Login
- Google, Facebook, and Apple integration
- Automatic account linking
- Graceful fallbacks when not configured

### Security Features
- JWT token-based authentication
- Secure password hashing
- Protected API routes
- CORS and security headers
- Environment variable validation

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - User logout

### Business
- `GET /api/packages` - Service packages
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - User orders (protected)
- `POST /api/contact` - Contact form submission

### System
- `GET /health` - Health check endpoint

## Testing

Run the comprehensive authentication test suite:

```bash
node scripts/testAuth.mjs
```

This tests:
- Health check endpoint
- Frontend route accessibility
- Email/password registration and login
- JWT token validation
- Verification that OAuth routes are removed
- API functionality

## Deployment

### Replit Deployment
1. Ensure all environment variables are set
2. Run authentication tests: `node scripts/testAuth.mjs`
3. Deploy using Replit's deployment feature

### Manual Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Start with: `npm start`
4. Configure reverse proxy (nginx/Apache)
5. Set up SSL/TLS certificates

## Technology Stack

### Frontend
- React 18 with TypeScript
- Wouter for routing
- TanStack Query for server state
- Shadcn/ui component library
- Tailwind CSS for styling
- Stripe.js for payments

### Backend
- Node.js with Express
- TypeScript with ES modules
- Drizzle ORM with PostgreSQL
- Passport.js for OAuth
- JWT for authentication
- bcrypt for password hashing

### Build & Deploy
- Vite for frontend bundling
- esbuild for backend compilation
- Replit for hosting
- GitHub for version control

## Support

For technical support or questions:
- Email: support@victorysync.com
- Documentation: This README
- Issues: Check the test output for debugging

## License

© 2025 VictorySync. All rights reserved.

## Replit Notes

We serve prebuilt assets via Express (`npm run dev` runs build then serves). Vite HMR is intentionally not used in Replit to avoid WebSocket disconnects. This ensures a stable preview with no blank flashes or connection lost errors.