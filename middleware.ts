import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  ""
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

  // publicRoutes: [
  //   '/',
  //   '/api/webhook',
  //   '/question/:id',
  //   '/tags',
  //   '/tags/:id',
  //   '/profile/:id',
  //   '/community',
  //   '/jobs'
  // ],
  // ignoredRoutes: [
  //   '/api/webhook', '/api/chatgpt'
  // ]