# ZedPrep — Complete Build Plan

> **Working name:** ZedPrep (recommended). Swap to your final brand if you choose differently.
> **Document version:** 1.0 — Master plan
> **Last updated:** 2026-09-10
> **Owner:** Richard Tembo
> **Status:** Pre-build, ready to start

---

## 0. How to use this document

This is the master brief for ZedPrep. It serves three purposes:

1. **A vision document** — for you, your future co-founder, and your team to align on what we're building and why.
2. **A build specification** — for any developer (including AI agents) to know what to build, in what order, with what constraints.
3. **A pitch artifact** — for school head teachers, education partners, and potential investors to understand the opportunity.

Read it end to end once. Then keep it open while you build.

---

## 1. The vision

Every Zambian student walks into their ECZ exam room confident, prepared, and supported — regardless of which school they attend, where they live, or what their family can afford.

**Mission:** Build the most trusted, locally-built, AI-assisted exam-prep platform for Zambian secondary school students — starting with the Examinations Council of Zambia (ECZ) syllabus, sold through schools, seeded by Zambian teachers.

**One-line pitch:** *ZedPrep is Zambia's ECZ-aligned revision platform — past papers, AI-marked answers, and teacher-built content, all in one place.*

---

## 2. The problem

- **~200,000+** Zambian students sit ECZ exams every year. Most pass, but most underperform relative to their potential.
- **Past papers exist** but are scattered, sometimes paywalled, and rarely organized by topic or syllabus code.
- **Tutors are scarce and expensive** — concentrated in Lusaka and the Copperbelt, leaving rural students behind.
- **Existing apps (uLesson, CambriLearn, Edukoya)** are either not Zambia-based or not aligned with the ECZ syllabus. They are general-African or general-African-British, which means students get content that doesn't match the exam they'll actually sit.
- **Teachers lack tools** to scale their impact beyond the classroom.
- **Parents are kept in the dark** about their child's real academic progress.

The opportunity is a localized, syllabus-aligned, AI-powered, mobile-first platform sold through the school system.

---

## 3. Target users & personas

### Primary learners (the people who use the app daily)

**Persona 1: Chipo the grinder**
- Form 4, Lusaka, attends a well-resourced private school
- Has a smartphone, decent data bundle, English-fluent
- Goal: get a grade 1 or 2 in ECZ Maths and Sciences
- Behaviour: practices past papers obsessively, hates surprises
- Will pay (or her parents will) for premium that feels like a competitive edge

**Persona 2: Bwalya the striver**
- Form 3, rural Copperbelt or Southern Province, attends a government school
- Shares a phone with family, data-constrained
- Goal: pass ECZ with respectable grades, beat the family expectation
- Behaviour: limited time online, needs every minute to count
- Will not pay directly, but the school might pay on his behalf

### Secondary users

**Persona 3: Mr. Banda the teacher**
- Subject teacher at a partner school
- Wants more impact, more income, more recognition
- Will create content if compensated or recognized
- Evangelist to other teachers and head teachers

**Persona 4: Mrs. Mutale the parent**
- Working mother, Lusaka
- Wants to know her child is actually learning, not just scrolling
- WhatsApp-native, time-poor
- Will pay K30-80/month for peace of mind

**Persona 5: The head teacher**
- Runs a school with 200-1000 students
- Under pressure from parents for results
- Has a small budget for edtech, but expects ROI
- Decision-maker for the school license

---

## 4. Value proposition

**For students:** *"Practice the exact style of your ECZ exam, get instant AI-marked feedback, and track your readiness — all from your phone, even offline."*

**For schools:** *"Bulk-license exam-prep your teachers trust and your parents notice — with content your own teachers help build, and a dashboard showing real progress."*

**For teachers:** *"Reach more students beyond your classroom, earn from your question packs, and see exactly where each class is struggling."*

**For parents:** *"Get a weekly WhatsApp digest of your child's real progress — not just screen time, but actual exam readiness, with one specific thing you can do to help."*

---

## 5. Brand & name

**Recommended name:** **ZedPrep**

| Why this name works | Why other options were considered |
|---|---|
| Clear and serious — signals exam prep, not casual quizzes | ZEDQUIZ was considered but undersells the platform |
| Zambian identity (the "Zed") without being slangy | ZEDMOCK is punchy but informal |
| Scales: "ZedPrep for Cambridge" still works later | PAMODZI is differentiated but risky without brand work |
| Easy to spell, say, remember, and find on app stores | EXAMZI is generic |
| Schools trust it; parents respect it | ZEDREADY is aspirational but vague |

**Tagline:** *Get ECZ-ready, the Zambian way.*

**Visual identity (to be developed):**
- Colors: deep green (#0E7C3A — Zambian flag-inspired but not kitsch) + warm gold accent (#F2C744)
- Typography: clean sans-serif, mobile-readable
- Tone: confident, friendly, never condescending
- Local touch: subtle Zambian visual cues in marketing, not the product UI

**Domain priorities (check availability):**
- `zedprep.co.zm` (Zambian, ideal)
- `zedprep.com` (international fallback)
- `zedprep.app` (alternative)
- Handles: `@zedprep` on Twitter/X, Instagram, TikTok, Facebook, WhatsApp Business

---

## 6. MVP scope — what's in, what's out

### Phase 1 MVP (Months 1-3) — the thing you ship

**In scope:**

| Area | Feature |
|---|---|
| **Platform** | Progressive Web App (PWA), mobile-first |
| **Audience** | Form 3, Form 4, Form 5 |
| **Subjects** | Mathematics, English, Science, Social Studies (4 subjects) |
| **Content** | Past papers 2022-2024, ~400 questions per subject = 1,600 questions |
| **Question types** | Multiple choice + short answer (one word, single sentence) |
| **Grading** | MCQ = exact match. Short answer = embedding similarity vs mark scheme |
| **Simulated exam** | Pick a subject, 20 random questions, 30-minute timer, end-of-exam report |
| **Teacher tool** | Web form: paste/type question, mark scheme, add diagram image, tag topic, set difficulty |
| **School admin** | Dashboard: enrollment, usage stats, basic analytics |
| **Parent comms** | Weekly WhatsApp digest (opt-in, summary only) |
| **Payments** | MTN MoMo Collection API + Airtel Money + Stripe for international |
| **Auth** | Phone-number based (with school code join) |
| **Languages** | English only for MVP |

**Explicitly OUT of MVP (designed for, not built yet):**

| Deferred feature | Why deferred | When to add |
|---|---|---|
| Essay marking | High AI cost, hard to grade well | Phase 2 (month 4-6) |
| Handwritten photo capture (OCR) | OCR on Zambian schoolwork is unreliable | Phase 2 |
| Local language support (Bemba, Nyanja, etc.) | Massive translation effort | Phase 3 (month 7-12) |
| Cambridge / IB content | Wrong market for MVP | Phase 4 (year 2+) |
| Adaptive difficulty / spaced repetition | Requires data we don't have yet | Phase 2 |
| AI Study Buddy chat | Its own product, expensive | Phase 3 |
| USSD / feature-phone support | Different product surface | Phase 3-4 |
| Grade 6 + A levels | Different UI, different content | Phase 3 |
| Premium parent reports | Needs B2C sales motion | Phase 2-3 |
| Teacher revenue share marketplace | Needs a working B2B base first | Phase 3 |
| Topic weightage insights | Needs analytical maturity | Phase 2-3 |
| Mental prep / wellness module | Nice to have | Phase 4 |

---

## 7. Phased roadmap

### Phase 1: MVP (Months 1-3)
**Goal:** Prove the product works in 2-3 schools with 300+ students.

- PWA foundation
- Teacher upload tool
- Student practice (MCQ + short answer)
- Simulated exam
- WhatsApp parent digest
- School admin dashboard
- 1,600 seeded questions
- MTN MoMo payment

### Phase 2: Polish & pilot (Months 4-6)
**Goal:** Convert pilots into paying schools, deepen the value.

- Add 2-3 more subjects (likely Biology, Chemistry, Physics — highest ECZ failure rates)
- Expand content to ~2,000 questions per subject
- Add essay marking (with strict AI cost caps)
- Add adaptive difficulty + simple spaced repetition
- Add personalised study plan
- Spaced repetition
- 2-3 paying pilot schools (K1,500/term each)
- Premium parent reports (K30/month)
- Add Airtel Money payment
- Topic weightage insights

### Phase 3: Scale & differentiate (Months 7-12)
**Goal:** 10+ schools, 5,000+ active students, K2M+ ARR.

- A levels + Grade 6 launches
- Handwritten photo capture (OCR)
- Local language support — Bemba first
- AI Study Buddy
- Teacher revenue share marketplace
- Push notifications + reminders
- Education conference presence
- NGO partnerships (UNICEF, Plan International)

### Phase 4: Expand & moat (Year 2+)
**Goal:** Regional expansion, defensible position.

- Cambridge / IB content
- Malawi, Zimbabwe, Tanzania expansion (similar exam systems)
- White-label for school networks
- Career guidance + scholarship info
- Mental health & wellness module
- Alumni network
- Acquire or partner with local tutoring companies

---

## 8. Technical architecture

### Stack (one developer, MVP, low cost)

| Layer | Technology | Rationale |
|---|---|---|
| **App** | Progressive Web App (PWA) | No app store gatekeeping, instant updates, works on any phone, cheap to build. PWA is the right MVP bet in Zambia. Convert to React Native in Phase 3 if needed. |
| **Frontend** | Next.js 14 (App Router) + Tailwind + shadcn/ui | Fast, SEO-friendly, great DX, mature ecosystem |
| **Backend** | Next.js API routes (simple) or NestJS (if you want a separate service) | Start with API routes for speed, extract to NestJS in Phase 2 if needed |
| **Database** | PostgreSQL via Supabase or Neon | Managed, cheap, well-supported |
| **Cache** | Redis via Upstash | Sessions, rate limiting, embedding cache |
| **File storage** | Cloudflare R2 | Cheap, S3-compatible, no egress fees (good for Zambian users) |
| **Auth** | Clerk or Supabase Auth | Don't build auth yourself |
| **AI – embeddings** | `bge-small-en` from BAAI, hosted on your own infra or Hugging Face Inference | Cheap, fast, good for short-answer similarity. ~$0.0001 per question. |
| **AI – essays** | Claude Sonnet or GPT-4o via API, used sparingly | Only for essays > 50 words. Cached aggressively. ~$0.01-0.05 per essay. |
| **AI – handwriting OCR** | Google Cloud Vision or AWS Textract | Defer to Phase 2. |
| **Payments** | MTN MoMo Collection API + Airtel Money API + Stripe | MoMo is the default in Zambia, Airtel is second, Stripe for diaspora |
| **Notifications** | WhatsApp Business API via 360dialog or Twilio; SMS via Africa's Talking; email via Resend | WhatsApp dominates open rates in Zambia |
| **Analytics** | PostHog (self-host or cloud) | Generous free tier, includes session replay |
| **Error tracking** | Sentry | Standard |
| **Hosting** | Vercel (web) to start, AWS Cape Town region when scaling | Cape Town is the closest data center to Zambia |
| **Offline** | Service Workers + IndexedDB (PWA native) | Pre-download question packs, sync when online |

### Architecture diagram (text)

```
┌──────────────────────────────────────────────────────────────┐
│                  Client (PWA on student phones)              │
└──────────────────────────┬───────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼─────┐      ┌─────▼────┐      ┌─────▼─────┐
   │ Student  │      │ Teacher  │      │  School   │
   │  PWA     │      │ Portal   │      │  Admin    │
   └────┬─────┘      └────┬─────┘      └────┬──────┘
        └──────────────────┼──────────────────┘
                           │
                ┌──────────▼──────────┐
                │   Next.js Frontend   │
                │   + API Routes       │
                └──────────┬───────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼─────┐      ┌─────▼────┐      ┌─────▼─────┐
   │ Postgres │      │  Redis   │      │ Cloudflare│
   │ (Supabase)│     │ (Upstash)│      │    R2     │
   └────┬─────┘      └────┬─────┘      └────┬──────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼──────────┐ ┌────▼──────┐  ┌────────▼────────┐
   │ AI Embeddings │ │ Claude /  │  │   Notifications │
   │   (bge-small) │ │  GPT-4o   │  │ WhatsApp / SMS  │
   └───────────────┘ └───────────┘  └─────────────────┘
```

### Key architectural decisions

1. **PWA over native app for MVP.** Saves 6+ weeks of build, no App Store review, instant updates. Convert later if needed.
2. **Embeddings first, LLM second.** MCQ and short answers use cheap embeddings (~$0.0001/Q). Essays use expensive LLM (~$0.05/Q). This single decision keeps AI costs manageable.
3. **Cache aggressively.** Every AI call result is cached. Same student + same question = no new AI call. Same question across students = one AI call.
4. **Offline-first for students.** A student in a low-data area should be able to download a subject's worth of questions and practice for a week without re-hitting the network.
5. **One codebase, multiple personas.** Student, teacher, school admin are all Next.js routes with different auth scopes. Don't build separate apps for each.

---

## 9. Database schema (key tables)

```sql
-- Core entities

CREATE TABLE schools (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  location        TEXT,
  district        TEXT,
  contact_name    TEXT,
  contact_phone   TEXT,
  contact_email   TEXT,
  plan            TEXT DEFAULT 'trial', -- trial, standard, premium
  status          TEXT DEFAULT 'active', -- active, suspended, churned
  joined_at       TIMESTAMPTZ DEFAULT now(),
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       TEXT NOT NULL,
  phone           TEXT UNIQUE,
  email           TEXT UNIQUE,
  password_hash   TEXT, -- if using email/password
  role            TEXT NOT NULL, -- student, teacher, parent, school_admin, platform_admin
  school_id       UUID REFERENCES schools(id),
  grade           TEXT, -- 'Form 3', 'Form 4', etc.
  is_active       BOOLEAN DEFAULT true,
  last_active_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE subjects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL, -- Mathematics, English, etc.
  code            TEXT UNIQUE NOT NULL, -- MATH, ENG, SCI, SST
  syllabus        TEXT DEFAULT 'ECZ',
  color_hex       TEXT -- for UI
);

CREATE TABLE topics (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id      UUID REFERENCES subjects(id),
  name            TEXT NOT NULL,
  syllabus_code   TEXT, -- e.g. 'M4.3.2' for ECZ Form 4 Maths Topic 3.2
  weight          INT DEFAULT 1, -- for topic weightage analysis
  grade           TEXT
);

CREATE TABLE questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            TEXT NOT NULL, -- mcq, short, essay, photo
  subject_id      UUID REFERENCES subjects(id),
  topic_id        UUID REFERENCES topics(id),
  grade           TEXT NOT NULL,
  content         TEXT NOT NULL, -- the question text
  mark_scheme     TEXT, -- for short/essay, the model answer
  points          INT DEFAULT 1,
  difficulty      INT DEFAULT 2, -- 1=easy, 2=medium, 3=hard
  source          TEXT, -- 'ECZ 2023', 'teacher_uploaded', 'textbook'
  year            INT,
  paper_ref       TEXT, -- 'Paper 1', 'Paper 2', etc.
  status          TEXT DEFAULT 'draft', -- draft, approved, rejected
  created_by      UUID REFERENCES users(id),
  reviewed_by     UUID REFERENCES users(id),
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE question_options (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id     UUID REFERENCES questions(id) ON DELETE CASCADE,
  text            TEXT NOT NULL,
  is_correct      BOOLEAN DEFAULT false,
  order           INT NOT NULL
);

CREATE TABLE question_images (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id     UUID REFERENCES questions(id) ON DELETE CASCADE,
  url             TEXT NOT NULL,
  caption         TEXT,
  order           INT DEFAULT 0
);

CREATE TABLE attempts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  question_id     UUID REFERENCES questions(id),
  answer          TEXT, -- text answer or selected option ID
  is_correct      BOOLEAN,
  score           NUMERIC, -- 0-100% for partial credit
  time_taken_sec  INT,
  ai_feedback     JSONB, -- structured feedback from AI
  mode            TEXT, -- 'practice', 'simulated_exam', 'past_paper'
  exam_id         UUID, -- FK to simulated_exams
  attempted_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE simulated_exams (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  subject_id      UUID REFERENCES subjects(id),
  question_count  INT DEFAULT 20,
  duration_min    INT DEFAULT 30,
  started_at      TIMESTAMPTZ DEFAULT now(),
  completed_at    TIMESTAMPTZ,
  total_score     NUMERIC
);

CREATE TABLE parent_child_links (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id       UUID REFERENCES users(id),
  child_id        UUID REFERENCES users(id),
  relationship    TEXT, -- mother, father, guardian
  whatsapp_opt_in BOOLEAN DEFAULT true,
  UNIQUE(parent_id, child_id)
);

CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID REFERENCES schools(id),
  plan            TEXT NOT NULL, -- trial, standard, premium
  amount_kwacha   NUMERIC NOT NULL,
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  status          TEXT DEFAULT 'active', -- active, expired, cancelled
  payment_method  TEXT, -- momo, airtel, stripe
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID REFERENCES schools(id),
  amount_kwacha   NUMERIC NOT NULL,
  method          TEXT, -- momo, airtel, stripe, cash
  external_ref    TEXT, -- MoMo transaction ID, Stripe charge ID
  status          TEXT, -- pending, completed, failed, refunded
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  channel         TEXT, -- whatsapp, sms, email, in_app
  type            TEXT, -- weekly_digest, exam_reminder, etc.
  content         TEXT,
  status          TEXT, -- queued, sent, failed, read
  sent_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE teacher_uploads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id      UUID REFERENCES users(id),
  file_url        TEXT, -- bulk upload via CSV
  question_count  INT,
  status          TEXT, -- processing, approved, rejected
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE audit_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  action          TEXT NOT NULL,
  entity_type     TEXT,
  entity_id       UUID,
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

**Indexing priorities (add these for performance):**
- `attempts(user_id, attempted_at DESC)` — for student history
- `attempts(question_id)` — for question analytics
- `questions(subject_id, grade, status)` — for content browsing
- `users(school_id, role)` — for school admin dashboards
- `notifications(user_id, status, sent_at DESC)` — for delivery tracking

---

## 10. AI architecture — the marking system

This is your technical moat. Get it right and competitors can't easily copy you.

### The four-tier grading strategy

**Tier 1: No AI (free)**
- MCQ: string match against the correct option
- Time tracking, streak tracking, XP — all just SQL aggregates
- **Cost: $0 per question**

**Tier 2: Embeddings (very cheap)**
- For one-word and short answers (< 50 words)
- Embed both the student's answer and the mark scheme using `bge-small-en`
- Compute cosine similarity
- Map similarity to a score: `>0.85 = full marks, 0.6-0.85 = partial, <0.6 = wrong`
- Cache every result — same question + same answer = no new computation
- **Cost: ~$0.0001 per question**
- **Coverage: ~70% of all answers**

**Tier 3: Large LLM (expensive)**
- For essays (> 50 words) and complex reasoning
- Use Claude Sonnet (preferred for nuance) or GPT-4o (faster, cheaper)
- Structured prompt: "You are an ECZ marker. Here's the question, the mark scheme, and the student's answer. Award 0-{max_points} marks. Justify each mark. Return JSON."
- Hard cap: max 5 essays per student per day in free tier; unlimited in premium
- **Cost: ~$0.01-0.05 per essay**
- **Coverage: ~5% of answers, ~30% of student value**

**Tier 4: Custom (Phase 3+)**
- Fine-tuned model on Zambian-marked essays
- Or: train a small model on a corpus of past papers + mark schemes
- **Cost: very low at scale, but high upfront**

### AI cost math (rough)

Assume 1,000 active students, each doing 50 questions/month:
- 50,000 questions/month
- 70% are MCQ = 35,000 free
- 25% are short answer = 12,500 × $0.0001 = **$1.25/month**
- 5% are essays = 2,500 × $0.03 = **$75/month**
- **Total AI cost: ~$76/month for 1,000 students**

That's the math that makes the business viable. If you let every answer hit GPT-4, the cost balloons to $1,000+ per month. Tier the AI properly.

### Handwriting OCR (Phase 2)

- Student takes photo of written work
- Google Cloud Vision extracts text (handles cursive, print, crossed-out work reasonably well)
- Extracted text goes into Tier 2 or Tier 3 grading
- Low-confidence OCR (confidence < 0.7) flags for human review
- Human-in-the-loop: teacher reviews flagged attempts, marks them manually, model learns

### Content moderation AI

- All teacher-uploaded questions go through a moderation queue
- AI pre-screens: checks for clarity, completeness, alignment with ECZ syllabus code
- Flags suspicious content (duplicate, off-topic, inappropriate)
- Human moderator (you + 1 trusted teacher initially) reviews flagged items
- Approved questions go live

---

## 11. UX/UI — key user journeys

### Student journey

1. **Sign up** — Enter phone number → receive OTP → enter school code (or join as individual)
2. **Onboarding** — Select grade → select subjects → take a 5-question diagnostic per subject
3. **Dashboard** — "Your Form 4 Maths readiness: 67%." Shows: continue last topic, take a mock exam, browse past papers
4. **Practice mode** — Pick a subject → pick a topic → see question → submit answer → see mark + explanation immediately
5. **Past paper mode** — Pick a year + paper → questions presented in order → results at the end
6. **Simulated exam** — Pick subject → 20 random questions → 30-minute timer (visible) → submit → detailed report
7. **End of session** — Session summary, XP earned, streak updated, share button for parents

### Teacher journey

1. **School admin invites teacher** — Email or WhatsApp with setup link
2. **Teacher signs up** — Confirms identity, picks subjects, picks grade levels
3. **Upload portal** — Clean web form
   - Pick subject + grade
   - Type/paste question
   - For MCQ: add 4 options, mark one correct
   - For short answer: add model answer
   - For essay: add mark scheme + point breakdown
   - Add diagram image (optional)
   - Tag topic + difficulty + ECZ syllabus code
4. **Submit** — Goes to moderation queue
5. **After approval** — Goes live in student app, teacher notified with view count
6. **Teacher dashboard** — See how many of their questions have been attempted, average scores, comments

### School admin journey

1. **School signs up** — Via landing page, school license form
2. **Admin login** — Sees school dashboard
3. **Dashboard widgets**:
   - Students enrolled (with weekly trend)
   - Questions answered (with weekly trend)
   - Average score by subject
   - Top-performing students
   - Students at risk
   - Teacher engagement
4. **Manage teachers** — Invite, deactivate, view activity
5. **Manage students** — Bulk invite via code, view enrollment
6. **Billing** — See current plan, next renewal, payment history, upgrade option

### Parent journey

1. **Child links parent** — Child enters parent's phone number in app
2. **Parent receives WhatsApp** — Opt-in message: "Chipo wants to share her progress with you on ZedPrep. Reply YES to confirm."
3. **Weekly digest (Sunday 7pm)** — Auto-sent WhatsApp message:
   - "Chipo practiced Maths 3 times this week"
   - "Average score: 78% (up from 65% last week)"
   - "Top strength: Algebra. Needs work: Trigonometry"
   - "One thing you can do: ask her to explain how sine and cosine work"
4. **Parent portal (Phase 2)** — Web view with detailed reports

---

## 12. Business model & pricing

### Primary: B2B school license

| Plan | Price (per term) | Includes | Target |
|---|---|---|---|
| **Pilot** | Free (months 3-4) | Full app, up to 500 students, 1 term | 2-3 schools, prove value |
| **Standard** | K1,500/term (~K4,500/year) | Full app, 500 students, all 4 core subjects | Most schools |
| **Premium** | K3,000/term | Standard + parent reports + advanced analytics + Airtel Money + A levels | Better-resourced schools |

Pricing rationale: K1,500/term is affordable for most Zambian private schools, profitable at scale, and a small fraction of a school's annual fees. Government schools may need NGO sponsorship.

### Secondary: B2C parent premium (Phase 2)

- K30/month or K300/year
- Includes: detailed progress reports, weekly WhatsApp digests with specifics, study recommendations
- Year 1 target: 5-10% of student users convert
- Distributed via WhatsApp pay + MoMo

### Tertiary: Teacher revenue share (Phase 3)

- Teachers create question packs (e.g. "Mr. Banda's Form 4 Maths: 200 Hard Questions")
- Teachers set price (K50-200 per pack)
- Platform takes 30%, teacher gets 70%
- Solves the long-term content supply problem

### Long-tail: Sponsored content (Phase 3+)

- A bank or telco sponsors a topic (e.g. "Financial Literacy" or "Digital Safety")
- Brand-safe, recurring revenue
- Doesn't disrupt learning

### What we DON'T do

- No ads in the student experience (ruins trust)
- No selling student data (ruins everything)
- No gambling-style monetization (no loot boxes, no "pay to skip ads")
- No ICO / token / NFT / metaverse nonsense

---

## 13. Go-to-market strategy

### Pre-launch (Months 1-2)

- Identify 2-3 pilot schools through your lined-up teachers (this is the wedge)
- Build landing page (1 day, single page, clear value prop, "Pilot schools wanted" CTA)
- Get informal MOUs from head teachers ("we'll pilot in term 1 if you deliver X")
- Recruit 5-10 teachers to seed content (your lined-up teachers)
- Soft launch in 1 school: 50 students, free, 4-week pilot
- Collect feedback, iterate, prepare for wider launch

### Launch (Month 3)

- 1,600 questions live, 4 subjects, simulated exam working
- 3 schools onboarded, 300-500 students
- Marketing: WhatsApp parent groups, parent-teacher meetings, school visits
- Press: feature in local education publications, Zambian edtech blogs
- Offer schools: "First term free if you commit to a 1-year pilot at K1,500/term"

### Growth (Months 4-12)

- Word of mouth in education community
- Education conferences: Zambia ICT Summit, EdTech Africa, MOE exhibitions
- NGO partnerships: UNICEF Zambia, Plan International, World Vision, Edukans
- Referral: school A gets 1 month free for referring school B (cap at 3 referrals)
- Teacher ambassador program: 1 teacher per 5 schools evangelizes to peers
- Parent testimonials: video case studies of children whose grades improved

### Year 2+

- Regional expansion: Malawi, Zimbabwe (same exam structure)
- White-label for school networks (a chain of 20 schools gets its own branded version)
- University partnerships: UNZA, CBU student ambassadors
- Government engagement: pitch to Ministry of Education for national rollout

---

## 14. Content strategy

### Phase 1 sources (target: 1,600 questions)

| Source | Volume | How |
|---|---|---|
| ECZ past papers 2022-2024 | ~800 questions | Digitize, clean up, tag with topics + syllabus codes |
| Teacher-contributed original | ~600 questions | Lined-up teachers, incentivized with recognition + future revenue share |
| Carefully selected textbooks | ~200 questions | With permission, only the best practice questions |

### Content quality bar

- Every question has a clear, unambiguous correct answer or mark scheme
- Every question tagged with topic + ECZ syllabus code
- Every question reviewed by moderator before going live
- Diagram images: high-res, well-labeled, not blurry
- Difficulty calibrated against actual ECZ performance

### Phase 2 (target: 5,000+ questions)

- Add textbook sources with permissions
- Cross-reference with full ECZ syllabus coverage
- Build topic weightage from past paper analysis (which topics appear most in ECZ)
- Add worked examples (not just questions — also teach the method)
- Add common-mistakes database ("students most often lose marks on Q6 by...")

### Phase 3 (target: 15,000+ questions)

- Teacher marketplace adds 100+ new questions/week organically
- User-submitted questions (with moderation)
- AI-generated question variations (after fine-tuning)

---

## 15. Success metrics

### Month 3 (MVP launch)

| Metric | Target |
|---|---|
| Questions in catalog | 1,600 |
| Subjects covered | 4 |
| Schools onboarded | 3 |
| Active students | 300+ |
| Week-1 retention | 50%+ |
| Average simulated exams per student | 1+ |
| Teacher content submissions | 500+ |
| Parent WhatsApp open rate | 70%+ |

### Month 6

| Metric | Target |
|---|---|
| Questions in catalog | 5,000 |
| Subjects covered | 6 |
| Schools onboarded | 10 |
| Active students | 2,000+ |
| Month-1 retention | 60%+ |
| Simulated exam completion rate | 70%+ |
| Paying pilot schools | 3 |
| Monthly recurring revenue | K4,500 (3 schools × K1,500) |

### Month 12

| Metric | Target |
|---|---|
| Questions in catalog | 15,000 |
| Subjects covered | All Form 3-5 subjects |
| Schools onboarded | 50+ |
| Active students | 15,000+ |
| Month-1 retention | 65%+ |
| Paid parent premium subscribers | 500+ |
| ARR | K1,500,000+ |
| Teacher revenue share contributors | 10+ |

### North star metric

**Weekly active students who complete at least one simulated exam.**

This single number captures: engagement, value delivery, and exam-readiness impact.

---

## 16. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| AI marking too inaccurate for free users | High | High | Human moderation for low-confidence scores; transparent "AI-suggested" vs "confirmed" labels; always show model answer after attempt |
| Schools won't pay | Medium | Critical | Pilot free first, prove value, then charge. Lead with private schools (have budgets). Have a clear "what you get for K1,500/term" pitch. |
| Teachers won't create content without immediate payment | Medium | High | Seed with lined-up teachers (relationship capital), then introduce revenue share in Phase 3 once content has users |
| MTN MoMo API integration is painful | High | Medium | Budget 2-3 weeks for payment integration. Have Airtel Money + Stripe as backup. Manual invoicing for first few schools if needed. |
| Handwritten OCR doesn't work well | High | Medium | Defer to Phase 2 entirely. Don't promise it in MVP. |
| Data costs too high for students | Medium | Medium | Aggressive PWA offline, low-data mode, image compression, WhatsApp digest is text-only |
| Founder burnout (solo) | High | High | Co-founder or technical co-lead within 6 months. Cut scope aggressively. Take Sundays off. |
| ECZ changes syllabus | Low | High | Build topic tagging from day 1. Question topics are abstract; syllabus codes are metadata. Re-tag if needed. |
| Competitor launches similar product | Medium | Medium | Speed + local content + teacher relationships. First-mover advantage matters but not decisive. |
| Privacy / child data concerns | Medium | High | Comply with Zambia's Data Protection Act. Minimal data collection. No selling of student data. Clear privacy policy. |
| Political / regulatory headwinds (edtech in schools) | Low | High | Engage MOE early as partner, not adversary. Position as complement to teachers, not replacement. |
| Plagiarism / cheating on simulated exams | Medium | Low | Browser-based PWA makes cheating harder anyway. Camera proctoring is Phase 4. Honor system at MVP. |
| Bandwidth outages during exams | High | Low | Offline mode means most functionality works anyway. WhatsApp digest has retry logic. |

---

## 17. 12-week build plan

### Weeks 1-2: Foundation

- [ ] Pick final name, register domain
- [ ] Set up Next.js + Tailwind + shadcn/ui project
- [ ] Set up Postgres (Supabase), Redis (Upstash), R2 (Cloudflare)
- [ ] Create database schema migrations, deploy to dev environment
- [ ] Set up auth (Clerk or Supabase Auth)
- [ ] Set up Sentry, PostHog
- [ ] Build landing page (single page, "Pilot schools wanted")
- [ ] Email/call 3 head teachers through your lined-up teachers

**Deliverable:** Landing page live, head teachers interested, dev environment ready.

### Weeks 3-4: Teacher upload tool

- [ ] Build teacher signup flow (via school admin invite)
- [ ] Build upload form: question type, subject, grade, content
- [ ] Mark scheme input (text + structured MCQ options)
- [ ] Image upload for diagrams (R2)
- [ ] Topic tagging + ECZ syllabus code selector
- [ ] Moderation queue UI
- [ ] Manual moderation workflow
- [ ] Invite your 5 lined-up teachers, start uploading

**Deliverable:** Teachers uploading 50+ questions/day, moderation queue working.

### Weeks 5-6: Student PWA core

- [ ] PWA setup, install prompt, manifest, service worker
- [ ] Student signup: phone + OTP + school code
- [ ] Grade + subject selection
- [ ] Question display (MCQ + short answer types)
- [ ] Tier 1 (MCQ) + Tier 2 (embeddings) AI marking integration
- [ ] Answer submission, feedback display
- [ ] Progress saved per question per student
- [ ] Basic dashboard

**Deliverable:** Student can sign up, answer questions, get instant marks.

### Weeks 7-8: Practice & simulated exam

- [ ] Topic-based practice mode
- [ ] Past paper browser (year + paper)
- [ ] Simulated exam: 20 questions, 30 min timer, end-of-exam report
- [ ] Topic-level analytics ("You're 78% on Algebra, 34% on Trig")
- [ ] Streaks + XP system
- [ ] Light gamification (basic badges for milestones)

**Deliverable:** Simulated exam fully working, basic gamification live.

### Weeks 9-10: School dashboard + parent comms

- [ ] School admin: enrollment management, bulk student invite
- [ ] School dashboard: usage stats, average scores, top performers
- [ ] Parent link flow (child enters parent phone, parent confirms via WhatsApp)
- [ ] WhatsApp Business API integration via 360dialog
- [ ] Weekly digest cron job (Sunday 7pm)
- [ ] Basic email digest for non-WhatsApp parents
- [ ] Notification log + retry logic

**Deliverable:** School admin can see what's happening. Parents get weekly WhatsApp.

### Weeks 11-12: Payments, polish, pilot

- [ ] MTN MoMo Collection API integration (start with sandbox)
- [ ] Airtel Money + Stripe as backup
- [ ] Onboarding flow polish (reduce friction)
- [ ] Error handling, loading states, mobile responsiveness audit
- [ ] Performance: bundle size, load time, offline sync
- [ ] Privacy policy + terms of service
- [ ] Onboard 2-3 schools, 50+ students
- [ ] 1-week feedback loop with pilot
- [ ] Bug bash + critical fixes
- [ ] Press release / WhatsApp marketing to parents

**Deliverable:** Live in 2-3 schools, real usage, real feedback, real money in 30 days.

---

## 18. Team & roles

### Solo (Months 1-3)

- **You:** Founder, full-stack dev, sales, marketing, customer support
- **Lined-up teachers:** Part-time content contributors
- **1 trusted teacher friend:** Content moderator, beta tester

### Phase 2 (Months 4-6) — adding 1-2 people

- **Co-founder or senior dev** (technical partner, shares the burden)
- **Part-time content moderator** (review uploaded questions)
- **Part-time community/sales** (handles school relationships, could be a teacher)

### Phase 3 (Months 7-12) — adding 3-4 more people

- **1 more developer**
- **1 designer** (part-time, contract)
- **1 customer success manager** (handles school accounts, renewals, escalations)
- **1 community manager** (WhatsApp groups, parent engagement)

### Year 2+ — building the team

- 6-10 people total
- Move from "founder does everything" to "founder sets direction, team executes"

---

## 19. Budget estimate (first 6 months)

| Item | Estimated cost |
|---|---|
| Infrastructure (Vercel, Supabase, Upstash, R2) | $50-200/month |
| Domain + email | $50/year |
| AI API costs (embeddings + LLM) | $50-300/month |
| WhatsApp Business API (360dialog) | $50-100/month |
| MTN MoMo / Airtel API access | Variable per transaction |
| Sentry / PostHog | $0-50/month (free tiers cover MVP) |
| Design (Figma, assets, occasional contractor) | $200 once + $200/month |
| Legal (privacy policy, terms) | $300-500 once |
| Accounting | $50-100/month |
| Marketing (mostly WhatsApp + a few school visits) | $100-300/month |
| Co-founder/contractor (if added) | $500-1500/month |
| **Total estimated burn** | **$5,000-15,000 over 6 months** |

Lean is the name of the game. Don't hire until you have paying schools.

---

## 20. Why this will succeed (the moat)

1. **Local content moat** — 1,600 ECZ-aligned questions, tagged with syllabus codes, reviewed by Zambian teachers. Competitors can copy features; they can't easily copy 5,000 high-quality Zambian-marked questions in 6 months.
2. **Teacher relationships** — Your lined-up teachers are the content supply. Once they're in, they're sticky. Switching costs are high.
3. **B2B distribution** — Schools are the right sales motion. One school contract = 200-500 students. Compound that over 50 schools and you have a defensible user base.
4. **AI cost efficiency** — The four-tier grading strategy keeps AI costs under $100/month for 1,000 students. That's a margin that lets you out-price international competitors.
5. **Zambian identity** — "Built in Zambia, for Zambian students" is a real message that international edtech can't credibly claim. Local parents trust local.
6. **Speed of execution** — You can ship a PWA MVP in 12 weeks. By the time a competitor evaluates and starts building, you're already in 5 schools.

---

## 21. Why this might fail (the honest list)

1. **Schools don't pay** — If you can't convert pilots to paid, the model collapses. Mitigation: pilot free, prove value, then charge.
2. **AI marking is bad** — If students get bad marks on legitimate answers, they leave. Mitigation: human-in-the-loop moderation, transparent scoring, model answer always shown.
3. **You burn out** — Solo founder building for 7 years on a dream project is at high risk of burnout. Mitigation: aggressive scope cuts, find a co-founder within 6 months, take weekends off.
4. **Content supply dries up** — Your lined-up teachers move on, get busy, lose interest. Mitigation: revenue share from day 1, build the upload tool so good that it's easy to contribute.
5. **MTN MoMo is a nightmare to integrate** — If payments don't work, schools can't pay. Mitigation: 2-3 week budget, Airtel + Stripe as backup, manual invoicing for first few schools.
6. **A well-funded competitor copies you** — Unlikely in the short term (Zambia is small, edtech is hard), but possible. Mitigation: be the local, trusted, content-rich option. International competitors can't credibly be local.
7. **You ship something nobody wants** — Mitigation: build the landing page first, get 3 head teachers to commit, build only after you have demand signals.

---

## 22. Immediate next actions (this week)

In priority order:

1. **[ ] Pick a name** — Confirm ZedPrep (or your final choice)
2. **[ ] Register domain** — `zedprep.co.zm` (primary), `zedprep.com` (fallback)
3. **[ ] Set up project repo** — I'll scaffold the Next.js + Postgres setup for you
4. **[ ] Write the landing page** — Single page, "Pilot schools wanted", I can draft the copy
5. **[ ] Email/call 3 head teachers** — Through your lined-up teachers, get informal commitment
6. **[ ] Recruit 5-10 content teachers** — Confirm who will upload, what their subjects are, agree on compensation (recognition now, revenue share in Phase 3)
7. **[ ] Write 10 example questions + mark schemes** — Test the content workflow end-to-end
8. **[ ] Set up project tracking** — Trello, Notion, or even a spreadsheet for the 12-week plan

---

## 23. Long-term vision (year 2+)

If Phase 1-3 succeed, ZedPrep becomes:

- **The de-facto revision platform for Zambian secondary students.** When a Form 3 student thinks "exam prep", they think ZedPrep.
- **A regional edtech player.** Expand to Malawi, Zimbabwe, Tanzania — same exam structure, similar market, Zambian playbook.
- **A teacher income platform.** The teacher marketplace becomes a real income source for educators, attracting the best talent to create content.
- **A career-launching platform.** Add career guidance, scholarship matching, university prep — ZedPrep becomes a student's companion from Form 1 to first job.
- **A Zambian tech company that ships.** A real example of a world-class product built in Zambia, for Zambia, that scales.

That's the dream. The 12-week build is the first step.

---

## Appendix A: Decision log

When you make a major decision, log it here. Future you (and any co-founder) will thank you.

| Date | Decision | Rationale | Alternatives considered |
|---|---|---|---|
| 2026-09-10 | Name: ZedPrep (proposed) | Serious, scalable, Zambian identity | ZEDQUIZ, ZEDMOCK, PAMODZI, EXAMZI, ZEDREADY |
| 2026-09-10 | Schools-first go-to-market | Aligned with teacher relationships, predictable revenue | All-three-at-once, B2C only, B2B only |
| 2026-09-10 | PWA over native app for MVP | Faster build, no app store gatekeeping | React Native, Flutter |
| 2026-09-10 | 4-tier AI marking strategy | Keeps AI costs manageable, scalable | All-GPT-4 (too expensive) |
| 2026-09-10 | ECZ-only for MVP | Focused content acquisition, clear market | Cambridge, IB, mixed |

---

## Appendix B: Open questions to resolve

- [ ] Final name decision
- [ ] Domain availability check
- [ ] Co-founder: solo or pair up before launch?
- [ ] Pilot schools: which 2-3, signed up by when?
- [ ] Seed teachers: who exactly, what subjects, what's the agreement?
- [ ] Pricing: is K1,500/term the right number? Test with 1 school first.
- [ ] WhatsApp provider: 360dialog or Twilio? Compare costs.
- [ ] AI provider: Claude or GPT-4o? Test both on a sample of 20 essays.

---

**End of build plan. Let's ship this.**
