# Bullet Studios -- Script Scoring Prototype

A working prototype for the **Bullet Studios script scoring flow**, built as part of the Junior Vibe Coder assignment. This app demonstrates the full creator journey: **script submission, AI scoring, decision outcomes, and marketplace visibility**.

## Live Demo

> _Link will be added after Vercel deployment_

## Features

- **Real authentication** -- Email/password signup and login via Supabase Auth
- **Script submission** -- Title, logline, genre, tags, and file upload (PDF/DOC/TXT via Supabase Storage)
- **AI score simulation** -- Mock scoring with 6 sub-dimensions (Plot, Pacing, Hook, Characters, Dialogue, Binge Factor), contextual feedback, and a 2-4s simulated processing delay
- **Decision logic** -- Four outcome tiers based on overall score:
  - 90+ → Rights purchase offer
  - 80-89 → Revenue share deal (fully built with terms and accept flow)
  - 70-79 → Marketplace listing
  - Below 70 → Feedback with improvement suggestions
- **Creator dashboard** -- Stats overview, script cards with status badges and scores, filter tabs
- **Script detail** -- Animated score reveal, sub-score breakdown bars, good/improvement feedback sections
- **Revenue share deal** -- Terms display (60/40 split, min guarantee, duration, payment schedule) with accept CTA
- **Rights availability** -- Owned vs available rights with inquiry buttons
- **Script marketplace** -- Search and browse scripts available for production

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS (custom dark theme) |
| Icons | Lucide React |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth (email/password) |
| File Storage | Supabase Storage |
| AI Scoring | Mock API route (no external API key needed) |

## Running Locally

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Install dependencies

```bash
cd bullet-studios
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the contents of `supabase-schema.sql` to create the `scripts` table and storage bucket
3. In your Supabase project settings, go to **Authentication > Email** and ensure email auth is enabled

### 3. Configure environment variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project's **Settings > API** page.

### 4. Start the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000), sign up, and start submitting scripts.

## Deployment

Deploy to Vercel:

1. Push the repo to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add the same environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings
4. Deploy

## Project Structure

```
bullet-studios/
├── src/
│   ├── app/
│   │   ├── (app)/              # Authenticated routes with navbar
│   │   │   ├── dashboard/      # Creator dashboard
│   │   │   ├── submit/         # Script upload form
│   │   │   ├── scripts/[id]/   # Script detail + deal + rights
│   │   │   └── marketplace/    # Script marketplace
│   │   ├── api/score/          # Mock AI scoring endpoint
│   │   ├── login/              # Sign in page
│   │   └── signup/             # Sign up page
│   ├── components/             # Reusable UI components
│   └── lib/                    # Supabase clients, types, utilities
├── supabase-schema.sql         # Database setup script
├── PLAN.md                     # Detailed implementation plan
└── .env.example                # Environment variable template
```

## Additional Documentation

- **Full technical plan**: See [PLAN.md](PLAN.md) for architecture decisions, data model, scoring logic, and design rationale.
