# Wine Cellar

A simple wine inventory and menu management app for sommeliers.

## Features

- **Wine Inventory Management** - Add, edit, and delete wines
- **Quick Count Mode** - Rapidly update bottle counts during inventory
- **Auto-generated Menu** - Public menu page updates automatically
- **Low Stock Alerts** - Visual warnings when bottles are running low
- **Category Organization** - Wines organized by type (red, white, sparkling, etc.)

## Quick Start

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your project dashboard, go to **SQL Editor**
3. Copy the contents of `supabase-schema.sql` and run it
4. Go to **Project Settings > API** and copy your project URL and anon key

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the admin dashboard.

Open [http://localhost:3000/menu](http://localhost:3000/menu) for the public menu.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Admin dashboard - manage wines, update inventory |
| `/menu` | Public menu - shareable link for website |

## Deployment

Deploy to Vercel:

```bash
npm install -g vercel
vercel
```

Add your environment variables in Vercel dashboard.

## Future Enhancements (when adding multiple users)

The app is architected for easy addition of authentication:

1. Enable Supabase Auth in your project
2. Add login/signup pages
3. Update Row Level Security policies in `supabase-schema.sql`
4. Add `user_id` column to wines table for multi-tenant support
