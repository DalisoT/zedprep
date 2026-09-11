# ZedPrep — Project Memory (AGENTS.md)

> This file is the project brain. Read it first when picking up work in a new session.

## What this is

ZedPrep is a Zambian ECZ-aligned exam-prep platform. Full vision, scope, and roadmap live in `BUILD_PLAN.md` (root). **Read that before making any product or architecture decision.**

## Current status

**Step 2 of the 12-week build plan: complete (pending user running the SQL migration).**

Done in Step 2:
- Supabase project connected: `https://jkfzanjcganzhhmmwcxh.supabase.co` (anon key in `web/.env.local`, git-ignored)
- Supabase client utilities: `src/lib/supabase/{client,server,middleware}.ts`
- Middleware for auth state refresh and protected route redirection
- Initial database migration: `web/supabase/migrations/0001_initial_schema.sql` (tables: schools, users, subjects, topics, subscriptions + RLS policies + `create_school_for_admin` SECURITY DEFINER function)
- Signup flow: `/signup` → email confirmation → `/onboarding` → `/dashboard`
- Login flow: `/login` with redirect-back support
- Onboarding form: collects school name, district, location, contact info, calls the RPC to create school + user + trial subscription
- Protected dashboard: shows school name, plan, user name, step-by-step roadmap, log-out
- Landing page nav updated with Log in / Sign up links
- Documentation: `web/supabase/README.md` with how to apply the migration

Not done (deferred to later steps per the build plan):
- Teacher upload tool (Step 3)
- Student PWA + simulated exam (Steps 4-5)
- Payments: MTN MoMo + Airtel + Stripe (Step 6)
- WhatsApp parent digest (Step 7)

## Folder structure

```
zedprep/
├── BUILD_PLAN.md          # Master plan — vision, scope, tech, AI, business, 12-week plan
├── README.md              # Project overview
├── AGENTS.md              # This file
├── docs/                  # Reserved for future design docs, GTM materials
└── web/                   # The Next.js app
    ├── README.md          # How to run the web app
    ├── package.json
    ├── tsconfig.json
    ├── next.config.mjs
    ├── tailwind.config.ts
    ├── postcss.config.mjs
    ├── .env.example
    ├── .env.local         # Real Supabase keys (git-ignored, never commit)
    ├── .gitignore
    ├── middleware.ts      # Supabase auth state refresh + protected route guard
    ├── public/
    ├── supabase/
    │   ├── README.md      # How to apply migrations
    │   └── migrations/
    │       └── 0001_initial_schema.sql
    └── src/
        ├── lib/
        │   └── supabase/
        │       ├── client.ts   # Browser client
        │       ├── server.ts   # Server client (for Server Components)
        │       └── middleware.ts
        └── app/
            ├── layout.tsx
            ├── globals.css
            ├── page.tsx           # Landing page
            ├── login/page.tsx     # /login
            ├── signup/page.tsx    # /signup
            ├── onboarding/page.tsx # /onboarding (school details form)
            └── dashboard/
                ├── page.tsx
                └── logout-button.tsx
```

## Tech stack (locked)

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 (shadcn-compatible, not yet installed) |
| Icons | lucide-react |
| Database | Supabase (Postgres) — Step 2 |
| Cache | Upstash Redis — Step 2 |
| Storage | Cloudflare R2 — Step 2 |
| Auth | Supabase Auth or Clerk — Step 2 |
| AI | bge-small embeddings (Tier 2) + Claude Sonnet (Tier 3) — Step 4-5 |
| Payments | MTN MoMo + Airtel Money + Stripe — Step 6 |
| Notifications | WhatsApp Business API + Africa's Talking + Resend — Step 7 |
| Hosting | Vercel |

## Brand (locked)

- **Name:** ZedPrep
- **Tagline:** Get ECZ-ready, the Zambian way.
- **Primary color:** `#0E7C3A` (Tailwind: `brand-700`)
- **Accent color:** `#F2C744` (Tailwind: `accent-300`)
- **Tone:** Professional, friendly, Zambian. Never condescending.

## Decisions log (project-level)

| Date | Decision | Source |
|---|---|---|
| 2026-09-10 | Name: ZedPrep | User accepted after recommendation |
| 2026-09-10 | Go-to-market: schools first | BUILD_PLAN.md §12 |
| 2026-09-10 | MVP stack: PWA + Next.js 14 + Supabase + R2 | BUILD_PLAN.md §8 |
| 2026-09-10 | Step 1 = landing page only | User confirmed |

## Working agreement (with user)

The user explicitly asked for:
1. **Step by step** — small, verifiable deliverables
2. **Call them out** if scope creeps beyond the MVP plan

This means: when a request doesn't fit the MVP scope in `BUILD_PLAN.md`, push back. Say no, redirect to the plan, or get explicit approval before deviating.

## Next planned step (don't start without confirming with user)

**Step 3:** Teacher upload tool.
- Web form for teachers to add questions (MCQ, short answer, essay — though essays are MVP-out)
- Mark scheme input
- Image upload for diagrams (R2)
- Topic tagging + ECZ syllabus code
- Moderation queue (manual review by you + 1 trusted teacher initially)
- Teacher dashboard: see their questions' performance
- Invite flow: school admin invites teachers via email, teacher signs up, gets linked to school

Until Step 3, the only thing the user (school admin) can do after signing up is see the welcome dashboard. The questions/subjects tables are empty. No student-facing pages yet.

## Common pitfalls to avoid

- Don't add features not in BUILD_PLAN.md §6 (MVP scope) without asking
- Don't pull in a UI library (Material UI, Chakra, etc.) — Tailwind + lucide is enough for MVP
- Don't optimize for scale before product-market fit
- Don't add admin CMS — the teacher upload tool IS the admin
- Don't write tests yet — manual QA is fine until post-MVP
- Don't use Anthropic/OpenAI APIs for MCQ or short answer grading — that's what embeddings are for (see BUILD_PLAN.md §10)
