
import { Router } from 'express';
import argon2 from 'argon2';
import { z } from 'zod';
import { storage } from './storage';
import { generateTokenPair } from './lib/jwt';
import { loginSchema, registerUserSchema } from '../shared/schema';

const router = Router();

// Register endpoint for public users
router.post('/register', async (req, res) => {
  try {
    const validatedData = registerUserSchema.parse(req.body);
    
    const existingUser = await storage.getPublicUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({
        ok: false,
        error: 'EMAIL_EXISTS',
        message: 'Email already registered'
      });
    }

    const passwordHash = await argon2.hash(validatedData.password);
    
    const user = await storage.createPublicUser({
      ...validatedData,
      passwordHash,
      isActive: true,
      socialAccounts: [],
    });

    const tokens = generateTokenPair({
      userId: user.id,
      orgId: undefined,
      isSuperAdmin: false,
    });

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: error.errors
      });
    }
    
    console.error('Registration error:', error);
    res.status(500).json({
      ok: false,
      error: 'SERVER_ERROR',
      message: 'Registration failed'
    });
  }
});

// Login endpoint for public users
router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    
    const user = await storage.getPublicUserByEmail(validatedData.email);
    if (!user || !user.isActive) {
      return res.status(401).json({
        ok: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      });
    }

    const validPassword = await argon2.verify(user.passwordHash, validatedData.password);
    if (!validPassword) {
      return res.status(401).json({
        ok: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      });
    }

    const tokens = generateTokenPair({
      userId: user.id,
      orgId: undefined,
      isSuperAdmin: false,
    });

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        error: 'VALIDATION_ERROR',
        message: 'Invalid input data'
      });
    }
    
    console.error('Login error:', error);
    res.status(500).json({
      ok: false,
      error: 'SERVER_ERROR',
      message: 'Login failed'
    });
  }
});

export default router;
