import { NextRequest, NextResponse } from 'next/server';
import { initAuth0 } from '@auth0/nextjs-auth0';

const auth0Config = {
  clientID: process.env.AUTH0_CLIENT_ID || '',
  clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
  baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || '',
  routes: {
    callback: '/api/auth/callback',
    login: '/api/auth/login',
    logout: '/api/auth/logout'
  },
  authorizationParams: {
    scope: 'openid profile email'
  }
};

// Initialize Auth0 with configuration
const auth0Instance = initAuth0(auth0Config);

// Export a singleton instance
export const auth0 = {
  handleLogin: async (req: NextRequest) => {
    try {
      return await auth0Instance.handleLogin(req);
    } catch (error) {
      console.error('Login error:', error);
      return new NextResponse('Login failed', { status: 500 });
    }
  },
  
  handleCallback: async (req: NextRequest) => {
    try {
      return await auth0Instance.handleCallback(req);
    } catch (error) {
      console.error('Callback error:', error);
      return new NextResponse('Callback failed', { status: 500 });
    }
  },
  
  handleLogout: async (req: NextRequest) => {
    try {
      return await auth0Instance.handleLogout(req);
    } catch (error) {
      console.error('Logout error:', error);
      return new NextResponse('Logout failed', { status: 500 });
    }
  },
  
  getSession: async (req: NextRequest) => {
    try {
      return await auth0Instance.getSession(req);
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }
};

export default auth0; 