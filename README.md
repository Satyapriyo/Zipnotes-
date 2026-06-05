# ZipNotes - Modern Note-Taking Application

A full-featured note-taking application built with **Next.js 16**, **TypeScript**, **Clerk Authentication**, **Supabase Database**, **shadcn/ui Components**, and **TipTap Rich Text Editor** for a Notion-like experience.

## Features

✨ **Authentication**: Secure user authentication with Clerk  
📝 **Rich Text Editor**: TipTap-powered editor with formatting, lists, links, and images  
☁️ **Cloud Storage**: All notes stored in Supabase  
🎨 **Beautiful UI**: shadcn/ui components with Tailwind CSS  
📱 **Responsive Design**: Works seamlessly on desktop and mobile  
⚡ **Real-time**: Instant synchronization of notes  
🔒 **Secure**: Row-level security policies on database  
📋 **Grid View**: Organize notes in an elegant card grid  
🗂️ **Sidebar Navigation**: Clean navigation with quick access to all notes  

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Clerk
- Go to [clerk.com](https://clerk.com) and create an application
- Copy your **Publishable Key** and **Secret Key**
- In Clerk dashboard, set redirect URLs:
  - Sign in: `http://localhost:3000/sign-in`
  - Sign up: `http://localhost:3000/sign-up`
  - After sign in: `/notes`
  - After sign up: `/notes`

### 3. Set Up Supabase
- Create a project at [supabase.com](https://supabase.com)
- Run this SQL in the SQL Editor to create the notes table:

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notes_user_id ON notes(user_id);
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notes" ON notes
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create notes" ON notes
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own notes" ON notes
  FOR UPDATE USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own notes" ON notes
  FOR DELETE USING (auth.uid()::text = user_id);
```

### 4. Configure Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/notes
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/notes

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## Usage

1. **Sign up** on the home page
2. You'll be redirected to your notes dashboard
3. Click **"New Note"** to create a note
4. Use the rich text editor to write and format your content
5. Click **"Save"** to store your note
6. View all notes in the grid on the notes page
7. Click any note to edit it
8. Delete notes with the trash icon

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Auth**: Clerk  
- **Database**: Supabase (PostgreSQL)
- **UI**: shadcn/ui, Tailwind CSS
- **Editor**: TipTap
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home/landing page
│   ├── layout.tsx           # Root layout
│   ├── sign-in/             # Sign-in page
│   ├── sign-up/             # Sign-up page
│   └── notes/
│       ├── layout.tsx       # Notes sidebar layout
│       ├── page.tsx         # Notes grid view
│       └── [id]/page.tsx    # Note editor
├── components/
│   ├── RichEditor.tsx       # TipTap editor
│   └── ui/                  # shadcn components
└── lib/
    └── supabase.ts          # Supabase client
```

## Troubleshooting

**Notes not showing?**
- Check Supabase RLS policies are enabled
- Verify user is authenticated in Clerk dashboard

**Sign-in redirect loop?**
- Verify Clerk environment variables are correct
- Check redirect URLs in Clerk dashboard

**Build errors?**
- Delete `.next` folder and rebuild: `rm -rf .next && npm run build`

## Browser Support

Chrome, Firefox, Safari, Edge (latest versions)

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

See full [SETUP.md](./SETUP.md) for detailed instructions.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
