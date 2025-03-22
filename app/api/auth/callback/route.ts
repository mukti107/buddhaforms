import { auth0 } from '../../../lib/auth0';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    return await auth0.handleCallback(req);
  } catch (error) {
    console.error('Callback error:', error);
    return new Response('Error during callback', { status: 500 });
  }
} 