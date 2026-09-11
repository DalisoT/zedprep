# ZedPrep — Project Memory (AGENTS.md)

> This file is the project brain. Read it first when picking up work in a new session.

## What this is

ZedPrep is a Zambian ECZ-aligned exam-prep platform. Full vision, scope, and roadmap live in `BUILD_PLAN.md` (root). **Read that before making any product or architecture decision.**

## Current status

**Step 1 of the 12-week build plan: complete (pending npm install + visual verification).**

Done in this step:
- Landing page (`web/src/app/page.tsx`) — B2B-focused, "Pilot your school" CTA, mobile-responsive
- Project scaffold: Next.js 14 + TypeScript + Tailwind + shadcn-compatible setup
- Brand colors wired into Tailwind (`brand-700` = `#0E7C3A`, `accent-300` = `#F2C744`)
- `.env.example` ready for services to be added in later steps
- README with run instructions and PowerShell workaround

Not done (deferred to later steps per the build plan):
- Database, auth, payments, AI integration, real app functionality — all on hold

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
    ├── .gitignore
    ├── public/
    └── src/
        └── app/
            ├── layout.tsx
            ├── page.tsx       # Landing page
            └── globals.css
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

**Step 2:** Database + auth foundation.
- Supabase project setup
- Database schema migrations (from `BUILD_PLAN.md` §9)
- Basic signup flow (school admin first, then teacher invite, then student)
- Auth wired into the Next.js app

## Common pitfalls to avoid

- Don't add features not in BUILD_PLAN.md §6 (MVP scope) without asking
- Don't pull in a UI library (Material UI, Chakra, etc.) — Tailwind + lucide is enough for MVP
- Don't optimize for scale before product-market fit
- Don't add admin CMS — the teacher upload tool IS the admin
- Don't write tests yet — manual QA is fine until post-MVP
- Don't use Anthropic/OpenAI APIs for MCQ or short answer grading — that's what embeddings are for (see BUILD_PLAN.md §10)
