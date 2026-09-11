# ZedPrep — Web

The marketing site and (eventually) the student PWA. Built with Next.js 14 + Tailwind.

## Status

- ✅ **Step 1 (current):** Landing page only — no auth, no database, no app logic. Just a real page to validate demand with head teachers.
- ⏳ Step 2: Database + auth (Supabase)
- ⏳ Step 3: Teacher upload tool
- ⏳ Step 4: Student PWA
- ⏳ Step 5: Simulated exams
- ⏳ Step 6: Payments (MTN MoMo)
- ⏳ Step 7: WhatsApp parent digest

See `../BUILD_PLAN.md` for the full plan.

## Run it locally

You'll need **Node.js 20+** installed. (You have v24.20.0 — perfect.)

### First time

```powershell
# Open PowerShell in this web/ folder
cd C:\Users\RICHARD_TEMBO\Desktop\projects\zedprep\web

# Install dependencies (this may take 1-2 minutes)
npm install

# Start the dev server
npm run dev
```

Then open <http://localhost:3000> in your browser.

### If `npm` is blocked by PowerShell execution policy

You have two options:

**Option A — bypass for this session:**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
npm run dev
```

**Option B — use cmd.exe directly:**
```powershell
cmd /c "npm install && npm run dev"
```

### Common commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server at <http://localhost:3000> |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run lint` | Run the linter |

## Folder structure

```
web/
├── src/
│   └── app/
│       ├── layout.tsx     # Root layout, fonts, metadata
│       ├── page.tsx       # Landing page (the only real page right now)
│       └── globals.css    # Tailwind directives + base styles
├── public/                # Static assets
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
└── postcss.config.mjs
```

## Brand

- **Name:** ZedPrep
- **Tagline:** Get ECZ-ready, the Zambian way.
- **Primary color:** `#0E7C3A` (brand-700) — deep Zambian green
- **Accent color:** `#F2C744` (accent-300) — warm gold

## Before you show this to anyone

1. Open `src/app/page.tsx`
2. Find the `CONTACT_WHATSAPP` constant at the top
3. Replace `260970000000` with your real WhatsApp number (format: country code + number, no plus, no spaces)
4. Replace `hello@zedprep.co.zm` with a real email
5. Save — Next.js will hot-reload

## Deployment

When you're ready to put this online:

1. Push this folder to a GitHub repo
2. Go to <https://vercel.com> and import the repo
3. Vercel auto-detects Next.js, just click Deploy
4. Once live, point your real domain (`zedprep.co.zm` or `zedprep.com`) at it

We'll handle the actual deploy together in a later step.

## Questions / blockers

If you hit any error running `npm install` or `npm run dev`, paste the error to me and I'll fix it.
