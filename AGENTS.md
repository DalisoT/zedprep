# ZedPrep — Project Memory (AGENTS.md)

> This file is the project brain. Read it first when picking up work in a new session.

## What this is

ZedPrep is a Zambian ECZ-aligned exam-prep platform. Full vision, scope, and roadmap live in `BUILD_PLAN.md` (root). **Read that before making any product or architecture decision.**

## Current status

**Step 3 of the 12-week build plan: complete (pending user running migration 0003).**

Done in Step 3:
- Migration `0003_questions_and_invites.sql`: questions, question_options, teacher_invites tables + RLS policies + `accept_teacher_invite` and `get_my_role` SECURITY DEFINER helpers
- School admin "Invite a teacher" UI on dashboard: generates invite link, copyable
- Teacher invite acceptance flow: `/invite/[token]` page validates token, handles new signups and logged-in users, prevents self-downgrade for school_admins
- Teacher portal: `/teacher` landing page with stats + CTAs
- Teacher question submission form: `/teacher/questions/new` (MCQ + short answer)
- Teacher's questions list: `/teacher/questions` showing status (pending/approved/rejected)
- School admin moderation queue: dashboard section with approve/reject buttons + rejection reason field
- Dashboard stats updated: teacher count, pending count, approved count

Not done (deferred to later steps):
- Student PWA + simulated exam (Steps 4-5)
- Payments: MTN MoMo + Airtel + Stripe (Step 6)
- WhatsApp parent digest (Step 7)
- Question image upload (Phase 2 — needs Supabase Storage setup)
- Topic dropdown (Phase 2 — needs structured ECZ topics table)

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

**Step 4:** Student PWA + simulated exam.
- PWA manifest + service worker (offline support)
- Student signup flow (via school code)
- Student dashboard: subject + topic browser
- Practice mode: answer MCQ + short answer questions (uses AI short-answer marking)
- Past paper browser
- Simulated exam: 20 random questions, 30-min timer, end-of-exam report
- Streaks + basic gamification

Until Step 4 is done, students cannot sign up or use the app — teachers and school admins only.

## Common pitfalls to avoid

- Don't add features not in BUILD_PLAN.md §6 (MVP scope) without asking
- Don't pull in a UI library (Material UI, Chakra, etc.) — Tailwind + lucide is enough for MVP
- Don't optimize for scale before product-market fit
- Don't add admin CMS — the teacher upload tool IS the admin
- Don't write tests yet — manual QA is fine until post-MVP
- Don't use Anthropic/OpenAI APIs for MCQ or short answer grading — that's what embeddings are for (see BUILD_PLAN.md §10)
