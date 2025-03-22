import { auth0 } from '../../../lib/auth0';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    return await auth0.handleLogin(req);
  } catch (error) {
    console.error('Login error:', error);
    return new Response('Error during login', { status: 500 });
  }
} 