import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired({
  returnTo: '/dashboard',  // After login, return to dashboard
  loginUrl: '/api/auth/login', // Redirect to Auth0 login
});

// Specify which paths should be protected
export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*', // Protect all routes under /dashboard
  ],
}; 