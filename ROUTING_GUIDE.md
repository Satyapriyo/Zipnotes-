# Routing & Authentication Guide

## Authentication Flow

### The Complete Journey

1. **Home Page** (`/`)
   - User lands on landing page
   - Options: "Get Started" (Sign Up) or "Sign In"
   - Page is public (no authentication required)

2. **Sign Up Flow** (`/sign-up`)
   - User clicks "Get Started"
   - Redirected to `/sign-up`
   - Clerk authentication UI handles registration
   - Upon completion → Redirected to `/notes`

3. **Sign In Flow** (`/sign-in`)
   - User clicks "Sign In"
   - Redirected to `/sign-in`
   - Clerk authentication UI handles login
   - Upon completion → Redirected to `/notes`

4. **Protected Notes Area** (`/notes`)
   - Middleware checks if user is authenticated
   - If not authenticated → Redirected to `/sign-in`
   - If authenticated → Shows notes dashboard
   - Can view, create, edit, delete notes

## How Routing Works

### Protected Routes

The middleware in `middleware.ts` protects the `/notes` route:

```typescript
const isProtectedRoute = createRouteMatcher(["/notes(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();  // Force authentication
  }
});
```

**What this does:**
- Any request to `/notes`, `/notes/new`, `/notes/123` requires authentication
- If user is not logged in → redirected to sign-in
- If user is logged in → proceeds normally

### Public Routes

These routes don't require authentication:
- `/` - Home page
- `/sign-in` - Sign-in page
- `/sign-up` - Sign-up page

### Redirect Configuration

After authentication, Clerk redirects to configured URLs:

```env
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/notes
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/notes
```

These are set in `.env.local` and also configured in your Clerk dashboard.

## Routes Map

```
/                              Home page (public)
├── /sign-in                   Sign-in (public)
├── /sign-up                   Sign-up (public)
└── /notes                      Notes dashboard (protected)
    ├── /notes/new              Create new note (protected)
    ├── /notes/[id]             Edit note (protected)
    └── ...
```

## Troubleshooting Routing Issues

### Problem: "Sign-in loop" - keeps redirecting to sign-in

**Causes & Solutions:**

1. **Incorrect Clerk Keys**
   - ✅ Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env.local`
   - ✅ Verify `CLERK_SECRET_KEY` in `.env.local`
   - ✅ Check keys match your Clerk app dashboard

2. **Wrong Redirect URL**
   - ✅ In Clerk dashboard, check the "After sign in" URL is set to `/notes`
   - ✅ Check `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/notes` in `.env.local`

3. **Middleware Issue**
   - ✅ Restart dev server: `npm run dev`
   - ✅ Check `middleware.ts` exists at project root
   - ✅ Verify middleware exports correct config

4. **Session Not Being Recognized**
   - ✅ Clear browser cookies
   - ✅ Clear browser storage
   - ✅ Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - ✅ Try incognito mode

### Problem: Can access `/notes` without being logged in

**Solution:**
- Middleware not working - ensure it's properly configured
- Check middleware.ts exists at `d:\next js  course\zipnotes-02\middleware.ts`
- Restart dev server
- Check browser console for errors

### Problem: Authentication works but not redirecting to `/notes`

**Solution:**
1. Check `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/notes
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/notes
   ```

2. Check Clerk Dashboard → Application → Sign In/Up → Redirect URLs

3. The redirects are set on both ends:
   - Client-side: `.env.local`
   - Server-side: Clerk Dashboard

Both must match!

## Environment Variables Checklist

For proper routing, ensure these are set:

```env
✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY     (get from Clerk dashboard)
✅ CLERK_SECRET_KEY                       (get from Clerk dashboard)
✅ NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
✅ NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
✅ NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/notes
✅ NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/notes
```

## File Structure for Routing

```
project-root/
├── middleware.ts                    # ← Auth middleware
├── src/app/
│   ├── page.tsx                    # / route
│   ├── layout.tsx                  # Root layout (has ClerkProvider)
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   │       └── page.tsx            # /sign-in route
│   ├── sign-up/
│   │   └── [[...sign-up]]/
│   │       └── page.tsx            # /sign-up route
│   └── notes/
│       ├── layout.tsx              # /notes layout (sidebar)
│       ├── page.tsx                # /notes route (grid view)
│       └── [id]/
│           └── page.tsx            # /notes/[id] route (editor)
└── ...
```

## How Next.js App Router Works

### Route Files

- `page.tsx` = the route itself
- `layout.tsx` = wrapper for all routes in that folder
- `[id]` = dynamic segment (catches variables)
- `[[...slug]]` = catch-all route (for Clerk auth pages)

### Example: `/notes/123`

```
Request: /notes/123
↓
middleware.ts: Check if authenticated
↓
src/app/notes/layout.tsx: Apply layout
↓
src/app/notes/[id]/page.tsx: Render component with id=123
```

## Key Components

### `middleware.ts`
- Runs on every request
- Checks if route is protected
- Forces authentication if needed

### `src/app/layout.tsx`
- Root layout wraps entire app
- Includes `ClerkProvider` for authentication context
- All pages inherit this layout

### `src/app/notes/layout.tsx`
- Layout for `/notes` routes
- Shows sidebar navigation
- Wraps notes pages

## Production Deployment

When deploying (Vercel, Railway, etc.):

1. Set all environment variables in hosting platform
2. Ensure Clerk dashboard has production URLs:
   ```
   Sign In: https://yourdomain.com/sign-in
   Sign Up: https://yourdomain.com/sign-up
   After Sign In: /notes
   After Sign Up: /notes
   ```
3. Deploy and test auth flow

---

**Your routing is now properly configured!** ✅
