# VictorySync - Contact Center & AI Automation Platform

## Overview

VictorySync is a comprehensive contact center and AI automation platform built with React and Express/TypeScript. The platform helps US businesses reduce customer service costs by up to 60% by providing professional contact center services, AI automation tools, customer dashboards, and e-commerce functionality for service packages. The system includes both a public-facing marketing website and a full-featured application with authentication, payment processing, and business management capabilities.

## Recent Changes (October 2025)

### Dark Theme Redesign - Verint-Inspired Aesthetic
Completed comprehensive dark theme redesign across the entire marketing website:

**Visual Design:**
- Implemented dark Verint-inspired aesthetic with #0B1221 background, #E5E7EB text, and cyan (#22D3EE) accents
- Created theme toggle with localStorage persistence and prefers-color-scheme support
- Responsive design with smooth transitions and animations

**New Components:**
- ThemeProvider context for global theme management
- ThemeToggle component in navigation
- MotionPage wrapper for Framer Motion page transitions
- Reusable dark-themed components: Section, MetricTile, ResourceCard, LogoRow

**Page Redesigns:**
- Home: Hero with gradient backgrounds, outcomes metrics grid, capabilities tabs, customer stories carousel, resources section
- Pricing: Replaced cart functionality with "Get a Quote" CTAs, added comparison accordion
- Contact: Inline Calendly embed with dark-themed contact form
- Platform: New capabilities page with tabbed content

**Calendly Integration:**
- useCalendly hook for popup scheduling
- Inline Calendly widget on Contact page
- "Get a Quote" CTAs throughout the site
- Custom styling to match dark theme

**Animations & UX:**
- Framer Motion for smooth page transitions
- Stagger animations on component entry
- Prefers-reduced-motion support for accessibility
- Smooth scrolling with accessibility considerations

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with React 18 and TypeScript using a modern toolchain:
- **Build System**: Vite for fast development and optimized production builds
- **UI Framework**: Shadcn/ui component library built on Radix UI primitives for consistent, accessible components
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API for cart functionality and TanStack React Query for server state management
- **Forms**: React Hook Form with Hookform resolvers for validation
- **Payment Integration**: Stripe React components for secure payment processing

### Backend Architecture
The server-side is built with Node.js and Express using TypeScript:
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: JWT-based authentication with session management
- **Session Storage**: Connect-pg-simple for PostgreSQL-backed session storage
- **API Design**: RESTful API endpoints with proper HTTP status codes and JSON responses

### Database Design
The system uses PostgreSQL with Drizzle ORM providing the following core entities:
- **Users**: User profiles with authentication credentials and Stripe customer integration
- **Organizations**: Business entities with plan associations and configuration
- **Packages/Plans**: Service offerings with pricing and feature definitions
- **Orders & Order Items**: E-commerce transaction tracking with status management
- **Contact Submissions**: Customer inquiry and lead management
- **Sessions**: Secure session storage for user authentication
- **Features & Entitlements**: Role-based access control and feature flagging system

### Build and Development System
The project uses a modern development setup optimized for Replit:
- **Development**: TSX for TypeScript execution with hot reloading
- **Production Build**: Vite for frontend bundling and esbuild for server compilation
- **Type Safety**: Comprehensive TypeScript configuration with strict mode enabled
- **Path Aliases**: Configured aliases for clean imports (@/ for client, @shared/ for shared code)
- **Development Server**: Integrated Vite dev server with proxy configuration for API routes

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for Neon database hosting
- **drizzle-orm**: Type-safe ORM for database operations with PostgreSQL dialect
- **@stripe/stripe-js** and **@stripe/react-stripe-js**: Payment processing integration
- **@tanstack/react-query**: Server state management and caching

### UI and Styling Dependencies
- **@radix-ui/\***: Complete set of headless UI primitives for accessible components
- **@fontsource/inter**: Typography with Inter font family
- **tailwindcss**: Utility-first CSS framework with custom configuration and dark mode support
- **framer-motion**: Animation library for page transitions and component animations
- **@studio-freight/lenis**: Smooth scrolling library for enhanced UX

### Authentication and Security
- **jsonwebtoken**: JWT token generation and verification
- **bcrypt/bcryptjs**: Password hashing for secure authentication
- **cookie-parser**: Cookie handling for session management

### Development and Build Tools
- **vite**: Frontend build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for server-side code
- **@replit/vite-plugin-runtime-error-modal**: Replit-specific development enhancements

### Form Handling and Validation
- **react-hook-form**: Performant forms with minimal re-renders
- **@hookform/resolvers**: Validation resolver integrations
- **zod**: Schema validation for type-safe data handling

### Production Integrations
The system includes integration points for:
- **Calendly**: Scheduling and appointment booking for quote requests (popup and inline widgets)
- **Twilio**: IVR and telephony services for contact center operations
- **HubSpot**: CRM integration for customer relationship management
- **n8n**: Workflow automation for AI-powered customer service
- **Puppeteer**: PDF report generation for business analytics