import { withAuth } from "next-auth/middleware";

// Require an authenticated session for the app's private areas. Unauthenticated
// requests are redirected to the landing page. The username/onboarding gate is
// enforced in the protected layout against the live database, so a stale token
// can't bypass it.
export default withAuth({
  pages: { signIn: "/" },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tasks/:path*",
    "/profile/:path*",
    "/select-username",
  ],
};
