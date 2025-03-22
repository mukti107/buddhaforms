import { auth0 } from '../../../lib/auth0';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    return await auth0.handleLogout(req);
  } catch (error) {
    console.error('Logout error:', error);
    return new Response('Error during logout', { status: 500 });
  }
} 