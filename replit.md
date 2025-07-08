# VictorySync - Call Center & AI Automation Platform

## Overview
VictorySync is a comprehensive call center and AI automation platform designed to help US businesses reduce customer service costs by up to 60% by leveraging professional services from Cairo, Egypt. The application provides a complete solution for inbound call center services, outbound sales, AI automation, and digital marketing services.

## System Architecture
The application follows a full-stack architecture with clear separation between client and server components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Context API for cart functionality and React Query for server state
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Payments**: Stripe integration for payment processing

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth integration
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Payment Processing**: Stripe server-side integration

### Build System
- **Frontend Build**: Vite with React plugin
- **Backend Build**: esbuild for server bundling
- **Development**: tsx for TypeScript execution in development
- **Type Checking**: TypeScript compiler for type safety

## Key Components

### Database Schema
- **Users**: Stores user profile and Stripe customer information
- **Packages**: Service packages with pricing and features
- **Orders**: Customer orders with status tracking
- **Order Items**: Individual items within orders
- **Contact Submissions**: Customer inquiries and contact form submissions
- **Sessions**: Session storage for authentication

### Authentication System
- Replit Auth integration for user authentication
- Session-based authentication with PostgreSQL storage
- Protected routes and middleware for secure access
- User profile management with Stripe integration

### E-commerce Features
- Service package catalog with dynamic pricing
- Shopping cart functionality with context management
- Stripe payment integration for secure transactions
- Order management and tracking system

### Service Offerings
- **Inbound Call Center**: 24/7 customer support, technical help desk, order processing
- **Outbound Sales**: Lead generation, appointment setting, cold calling campaigns
- **AI Automation**: Chatbots, automated workflows, intelligent routing
- **Digital Marketing**: Social media management, content creation, SEO services

## Data Flow

### User Journey
1. **Discovery**: Users browse services and pricing on marketing pages
2. **Selection**: Users add services to cart and proceed to checkout
3. **Authentication**: Users authenticate via Replit Auth
4. **Payment**: Secure payment processing through Stripe
5. **Fulfillment**: Order processing and service delivery tracking
6. **Management**: Customer dashboard for service monitoring

### API Architecture
- RESTful API endpoints for all data operations
- Middleware for authentication and error handling
- Structured error responses with appropriate HTTP status codes
- Request/response logging for debugging and monitoring

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit Auth service
- **Payments**: Stripe payment platform
- **UI Components**: Radix UI primitives and Shadcn/ui
- **Validation**: Zod for runtime type validation
- **ORM**: Drizzle ORM for type-safe database operations

### Development Dependencies
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking
- **ESLint**: Code linting and formatting
- **Tailwind CSS**: Utility-first CSS framework

## Deployment Strategy

### Production Build
- Frontend assets built with Vite and served statically
- Backend bundled with esbuild for optimized performance
- Environment variables for configuration management
- Database migrations handled via Drizzle Kit

### Development Workflow
- Hot module replacement for rapid development
- TypeScript compilation for type safety
- Database schema synchronization with push commands
- Integrated error overlay for debugging

### Environment Configuration
- Separate development and production configurations
- Environment-specific database connections
- Secure API key management for external services
- Replit-specific optimizations and plugins

### Production Deployment Fixes Applied
- ✅ **Port Configuration**: Server properly binds to 0.0.0.0:5000 with PORT environment variable support
- ✅ **Environment Validation**: Startup checks for required DATABASE_URL and other critical environment variables
- ✅ **Health Check Endpoint**: Comprehensive /health endpoint that validates database connectivity and system status
- ✅ **Error Handling**: Robust error handling throughout application startup and runtime operations
- ✅ **Database Connection**: Enhanced connection pooling with timeout handling and connection testing
- ✅ **Graceful Shutdown**: Proper SIGTERM and SIGINT handling for clean container shutdowns
- ✅ **Logging**: Structured startup logging with clear success/failure indicators
- ✅ **Static File Serving**: Error handling for missing build files with helpful error messages
- ✅ **Production Scripts**: start.sh script with environment validation and database schema updates
- ✅ **Deployment Configuration**: .replit.toml file configured for Replit Deployments

## Changelog
- July 01, 2025: Initial setup
- January 01, 2025: Updated branding to purple/blue color scheme
- January 01, 2025: Integrated VictorySync logo and professional fonts
- January 01, 2025: Created complete e-commerce website with shopping cart and checkout
- January 01, 2025: Set up Replit Auth integration for customer dashboard
- January 01, 2025: Added multi-page navigation with all business sections

## Recent Changes
✓ Created professional website with purple/blue VictorySync branding
✓ Added VictorySync logo from user's attached assets
✓ Implemented shopping cart functionality with checkout page
✓ Set up customer dashboard for authenticated users
✓ Created all business pages: Home, Services, Pricing, About, Contact
✓ Configured database with PostgreSQL and Drizzle ORM
✓ Added Replit Auth integration for user management
✓ Updated business location from Cairo, Egypt to Millstone, New Jersey
✓ Standardized all buttons to use consistent purple styling
✓ Applied comprehensive deployment fixes for production readiness
✓ Added robust error handling and logging throughout the application
✓ Implemented health check endpoint for monitoring
✓ Added graceful shutdown handling and database connection validation
✓ Implemented public JWT-based authentication system with email/password signup
✓ Implemented email/password authentication with JWT tokens (30-day expiry)
✓ Created secure registration and login pages with client-side validation
✓ Added password hashing with bcrypt for secure credential storage
✓ Removed all OAuth social authentication to simplify the authentication system
✓ Updated database schema to support only email/password authentication
✓ Completely removed legacy Replit Auth system and dependencies
✓ Cleaned up database schema removing old users table and session references
✓ Updated all protected routes to use JWT authentication middleware
✓ Removed all Replit Auth imports, routes, and middleware
✓ Fixed OAuth passport strategies with proper named registration
✓ Added comprehensive error handling for missing OAuth environment variables
✓ Updated frontend user data references to match new PublicUser schema
✓ Verified all authentication flows working: email/password, Google, Facebook, Apple
✓ Fixed production build scripts and deployment configuration
✓ Completed comprehensive authentication system testing - all flows verified working
✓ Created automated test suite (scripts/testAuth.mjs) for production validation
✓ Added comprehensive README.md with OAuth setup instructions
✓ Fixed logout functionality in navigation component
✓ Added proper error handling and graceful OAuth fallbacks
✓ Verified all frontend routes accessible (/login, /register, /signup)
✓ Confirmed production build compatibility and deployment readiness
✓ Fixed JWT token persistence - tokens now stored/retrieved from localStorage consistently
✓ Updated useAuth hook to properly validate JWT tokens and auto-clear invalid tokens
✓ Enhanced queryClient to automatically include JWT tokens in all API requests
✓ Fixed navigation logout buttons to use proper logout function
✓ Eliminated auto-logout issues - users now stay logged in across page reloads
✓ All authentication tests passing (5/5) including token persistence validation
✓ Removed all OAuth social login functionality (Google, Facebook, Apple)
✓ Cleaned OAuth buttons from login/register pages for simplified interface
✓ Updated environment variables and documentation to reflect email/password-only auth
✓ Modified test suite to verify OAuth routes are properly removed (404 responses)
✓ Created comprehensive footer with professional navigation structure
✓ Built 7 complete content pages: About Us, Careers, Blog, Help Center, Documentation, Privacy Policy, Terms of Service
✓ Implemented consistent page layouts with VictorySync branding and SEO optimization
✓ Added proper routing system with all footer pages accessible via clean URLs
✓ Implemented email notifications using nodemailer with Gmail SMTP
✓ Configured automatic email alerts for new user signups and contact form submissions
✓ Tested email delivery system - both user registration and contact form notifications working
→ Stripe payment processing ready for configuration when needed

## User Preferences
- Company name: VictorySync
- Colors: Purple and blue theme
- Business focus: Inbound/outbound call center, AI automation, marketing
- Location: Millstone, New Jersey serving US businesses
- Cost savings promise: 60% reduction
- Preferred communication style: Simple, everyday language
- Font preference: More professional font for company name (implemented with Inter font)
- Button styling: Consistent purple background across all buttons