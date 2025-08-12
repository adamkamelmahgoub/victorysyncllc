
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { auth } from '../routes/auth';

const app = express(); 
app.use(express.json()); 
app.use(cookieParser()); 
app.use('/api', auth);

// NOTE: This is a logic test; real email/SMS calls should be mocked in CI.
// For brevity, assert route shape exists.
describe('Auth routes exist', () => {
  it('exposes /auth/register/start', async () => {
    const res = await request(app).post('/api/auth/register/start').send({});
    expect([400,503]).toContain(res.status); // bad request or not configured
  });

  it('exposes /auth/login', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect([400,503]).toContain(res.status); // bad request or not configured
  });
});
