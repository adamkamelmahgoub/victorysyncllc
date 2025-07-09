
# VictorySync Authentication System

## Overview
VictorySync uses a dual authentication system with separate login flows for customers and administrators.

## Architecture

### Customer Authentication
- **Route**: `/dashboard`
- **Login**: Email + Password
- **Endpoint**: `POST /api/auth/login`
- **Database**: `public_users` table
- **Access**: Customer dashboard and services

### Admin Authentication  
- **Route**: `/admin`
- **Login**: Username + Password
- **Endpoint**: `POST /api/admin/auth/login`
- **Database**: `admin_users` table
- **Access**: Admin portal and management tools

## Security Features
- JWT tokens with 30-day expiration
- Separate token validation for admin vs customer
- bcrypt password hashing
- Role-based access control
- Protected route middleware

## Default Admin Credentials
- **Username**: `admin`
- **Password**: `Mshmsh7184365700!`

## API Endpoints

### Customer Auth
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/login` - Customer login
- `GET /api/auth/me` - Get current customer

### Admin Auth
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/me` - Get current admin

## Frontend Routes
- `/login?type=customer` - Customer login page
- `/login?type=admin` - Admin login page
- `/dashboard` - Customer dashboard (protected)
- `/admin` - Admin portal (protected)

## Database Schema
- `public_users` - Customer accounts (email-based)
- `admin_users` - Admin accounts (username-based)

## Testing
Test authentication flows:
```bash
node scripts/testAuth.mjs
```
