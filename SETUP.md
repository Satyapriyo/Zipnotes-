# ZipNotes - Setup Guide

## Overview
ZipNotes is a modern note-taking application built with Next.js, featuring rich text editing, real-time sync, and cloud storage.

## Prerequisites
- Node.js 18+
- npm or yarn
- A Supabase account
- A Clerk account

## Installation

1. **Install dependencies:**
```bash
npm install
```

## Configuration

### 1. Clerk Setup

1. Go to [clerk.com](https://clerk.com) and create a new application
2. Copy your publishable key and secret key
3. Set up the redirect URLs in Clerk dashboard:
   - Sign in: `http://localhost:3000/sign-in`
   - Sign up: `http://localhost:3000/sign-up`
   - After sign in: `/notes`
   - After sign up: `/notes`

### 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Create the following table in your Supabase database:

```sql
-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX idx_notes_user_id ON notes(user_id);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for select
CREATE POLICY "Users can view their own notes"
  ON notes
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- Create RLS policy for insert
CREATE POLICY "Users can create notes"
  ON notes
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Create RLS policy for update
CREATE POLICY "Users can update their own notes"
  ON notes
  FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Create RLS policy for delete
CREATE POLICY "Users can delete their own notes"
  ON notes
  FOR DELETE
  USING (auth.uid()::text = user_id);
```

3. Copy your Supabase URL and API keys

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/notes
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/notes

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## Features

- **Authentication**: Secure user authentication with Clerk
- **Rich Text Editor**: Notion-like editor with formatting tools
- **Cloud Storage**: Notes stored in Supabase database
- **Grid View**: Organize notes in a clean grid layout
- **Real-time Updates**: Instant synchronization across devices
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Home page
│   ├── layout.tsx              # Root layout with Clerk provider
│   ├── sign-in/                # Sign in page
│   ├── sign-up/                # Sign up page
│   └── notes/
│       ├── layout.tsx          # Notes layout with sidebar
│       ├── page.tsx            # Notes list with grid view
│       └── [id]/
│           └── page.tsx        # Note editor page
├── components/
│   ├── RichEditor.tsx          # Rich text editor component
│   └── ui/                     # shadcn UI components
├── lib/
│   ├── supabase.ts             # Supabase client setup
│   └── utils.ts                # Utility functions
└── styles/
    └── editor.css              # Editor styling
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Authentication Issues
- Verify Clerk keys are correctly set in `.env.local`
- Check redirect URLs in Clerk dashboard match your application URLs
- Clear browser cookies and try again

### Database Issues
- Verify Supabase connection string is correct
- Check that the notes table exists with correct schema
- Verify Row Level Security policies are enabled

### Editor Issues
- Ensure TipTap extensions are properly installed
- Check browser console for any JavaScript errors
- Try clearing browser cache and reloading

## Support

For issues or questions, please refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
