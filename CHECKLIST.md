# ZipNotes - Setup Checklist

Complete this checklist to get your app running with proper authentication and routing.

## ✅ Pre-Setup Requirements

- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Clerk account created (clerk.com)
- [ ] Supabase account created (supabase.com)

## 📦 Installation

- [ ] Run `npm install`
- [ ] Verify no installation errors
- [ ] Check `node_modules` folder exists

## 🔐 Clerk Setup

1. **Create Clerk Application**
   - [ ] Go to https://clerk.com/sign-in
   - [ ] Create new application
   - [ ] Copy **Publishable Key**
   - [ ] Copy **Secret Key**

2. **Configure Redirect URLs in Clerk Dashboard**
   - [ ] Go to Application → Settings → URLs
   - [ ] Set Sign In URL: `http://localhost:3000/sign-in`
   - [ ] Set Sign Up URL: `http://localhost:3000/sign-up`
   - [ ] Set After Sign In: `/notes`
   - [ ] Set After Sign Up: `/notes`
   - [ ] Save changes

3. **Add to `.env.local`**
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

## 💾 Supabase Setup

1. **Create Supabase Project**
   - [ ] Go to https://supabase.com
   - [ ] Create new project
   - [ ] Wait for project to be created
   - [ ] Copy **Project URL**
   - [ ] Copy **Anon Key** (public)
   - [ ] Copy **Service Role Key** (secret)

2. **Create Notes Table**
   - [ ] Go to SQL Editor in Supabase
   - [ ] Paste the SQL schema (see SETUP.md)
   - [ ] Execute query
   - [ ] Verify table created in Database tab

3. **Add to `.env.local`**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```

## 🔧 Environment Configuration

- [ ] `.env.local` file exists in project root
- [ ] All 8 environment variables are set:
  - [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - [ ] `CLERK_SECRET_KEY`
  - [ ] `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
  - [ ] `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
  - [ ] `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
  - [ ] `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`

- [ ] `.env.local` is in `.gitignore` (don't commit secrets!)

## 🚀 Running the App

- [ ] Run `npm run dev`
- [ ] App starts on http://localhost:3000
- [ ] No errors in terminal
- [ ] No errors in browser console

## 🧪 Testing the App

### Home Page
- [ ] Load http://localhost:3000
- [ ] See landing page with features
- [ ] "Get Started" button visible
- [ ] "Sign In" button visible

### Sign Up Flow
- [ ] Click "Get Started"
- [ ] Redirected to `/sign-up`
- [ ] Clerk sign-up form loads
- [ ] Create account with email
- [ ] **Should redirect to `/notes`** ✅ (Not back to home!)

### Notes Page
- [ ] See empty notes page (no notes yet)
- [ ] "New Note" button in sidebar
- [ ] "Your Notes" heading visible
- [ ] Grid layout shows empty state message

### Create Note
- [ ] Click "New Note" button
- [ ] Title input field shows
- [ ] Rich editor loads with toolbar
- [ ] Toolbar has: Bold, Italic, H2, H3, Lists, Link, Image, Undo, Redo

### Write & Format
- [ ] Type some text
- [ ] Click Bold button - text becomes bold
- [ ] Click Italic button - text becomes italic
- [ ] Create bullet list
- [ ] Add a heading

### Save Note
- [ ] Click "Save" button
- [ ] Button shows "Saving..." state
- [ ] After save, redirected to `/notes`
- [ ] Note appears in grid!

### View Note
- [ ] Note card visible in grid
- [ ] Shows title and preview
- [ ] Click note card
- [ ] Opens in editor
- [ ] Content is loaded
- [ ] Can edit and save again

### Delete Note
- [ ] Hover over note card
- [ ] Click trash icon
- [ ] Note disappears from grid

### Sign Out
- [ ] Click user avatar (top right of sidebar)
- [ ] Click "Sign Out"
- [ ] Redirected to home page
- [ ] Cannot access `/notes` anymore (redirects to sign-in)

## 🐛 Debugging Checklist

If something isn't working:

1. **Notes not appearing:**
   - [ ] Check Supabase table exists
   - [ ] Check RLS policies are enabled
   - [ ] Check user_id matches in database

2. **Auth redirect loop:**
   - [ ] Verify Clerk keys in `.env.local`
   - [ ] Check Clerk dashboard redirect URLs
   - [ ] Clear browser cookies
   - [ ] Restart dev server

3. **Database connection error:**
   - [ ] Check Supabase URL is correct
   - [ ] Check Supabase keys are correct
   - [ ] Check project is active in Supabase
   - [ ] Verify `.env.local` has NEXT_PUBLIC_ prefix

4. **Editor not working:**
   - [ ] Check browser console for errors
   - [ ] Ensure TipTap is installed: `npm ls @tiptap`
   - [ ] Clear browser cache
   - [ ] Restart dev server

## 📋 Build & Deploy Checklist

Before deploying:

- [ ] Run `npm run build` - no errors
- [ ] TypeScript check passes
- [ ] All pages render correctly
- [ ] Auth flow works
- [ ] Database operations work

For Vercel deployment:

- [ ] Push code to GitHub
- [ ] Connect repo to Vercel
- [ ] Add all 9 environment variables
- [ ] Deploy
- [ ] Test in production

## 🎉 Completion

When everything works:

- [ ] Home page loads (/)
- [ ] Can sign up (/sign-up)
- [ ] After auth, redirected to /notes (NOT home!)
- [ ] Can create notes
- [ ] Can see notes in grid
- [ ] Can edit notes
- [ ] Can delete notes
- [ ] Can sign out
- [ ] After sign out, /notes is protected

**You're all set! 🚀**

---

## 📞 Support

If you get stuck:

1. Check the **ROUTING_GUIDE.md** for auth/routing issues
2. Check the **SETUP.md** for detailed configuration
3. Check console errors (F12 → Console tab)
4. Check terminal for errors
5. Check environment variables match exactly

Common solutions:
- Restart dev server: `npm run dev`
- Clear browser cache and cookies
- Delete `.next` folder and rebuild
- Check all environment variables
