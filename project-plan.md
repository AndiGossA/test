# Project Plan: Lifestyle Plan App

## 1. Overview

A free, personal web app that turns the "Lifestyle Plan: October 2026 – December 2027" document into an interactive, editable tool for tracking budget, goals, career development, and skills — with built-in review cadences (weekly/monthly/quarterly/annual).

**Owner:** Andi
**Plan period modeled:** Oct 2026 – Dec 2027 (5 quarters: Q4 2026 → Q4 2027)
**Platform:** Responsive web app, installable as a PWA on desktop and mobile
**Cost:** $0 — no backend required for v1
**Data storage:** Browser local storage (IndexedDB) + manual JSON export/import for backup/portability
**Built with:** Claude Code

---

## 2. Tech Stack Recommendation

- **Frontend:** React + Vite (fast, simple, works great as a PWA)
- **Styling:** Tailwind CSS (fast to build responsive layouts)
- **Storage:** IndexedDB (via a small wrapper like `idb`) for structured data; fallback to localStorage for simple settings
- **PWA:** `vite-plugin-pwa` for installability + offline support
- **Charts:** Recharts or Chart.js (net worth tracker, budget breakdown, skills progress)
- **Hosting (optional, still free):** GitHub Pages, Vercel free tier, or Netlify free tier — or just run locally

No login, no server, no monthly cost.

---

## 3. Data Model

Core entities, derived directly from the document's sections:

| Entity | Fields |
|---|---|
| **Vision/Priorities** | text fields per category (financial, personal, career, skills), top 3 priorities |
| **Period** | id, label (e.g. "Q4 2026"), start date, end date, theme |
| **BudgetCategory** | name, target %, notes |
| **FinancialMilestone** | name, target date, target amount, current amount, status |
| **HealthGoal / RelationshipGoal / EnrichmentGoal** | text, done (bool), target date |
| **QuarterlyCheckin** | period id, health notes, relationships notes, enrichment notes, general notes |
| **CareerState** | field (role/responsibilities/compensation/strengths/gaps), now value, target value |
| **CareerMilestone** | name, target date, notes, status |
| **Skill** | name, current level (1-5), target level (1-5), priority |
| **LearningItem** | skill/course, format, target completion, budget |
| **SkillMilestone** | description, target date, done |
| **ReviewLog** | type (weekly/monthly/quarterly/annual), date, notes |
| **ChangelogEntry** | date, description |

---

## 4. Feature Breakdown (mapped to your doc's sections)

1. **Vision & Priorities** — editable text panel, top-3 priorities pinned to dashboard
2. **Timeline Overview** — visual 5-quarter timeline/roadmap view with themes
3. **Budgeting**
   - Editable budget framework (category % + notes, with a "does this add to 100%?" check)
   - Financial milestones tracker with progress bars and status
   - Weekly/monthly/quarterly tracking checklist tied to the Review Cadence
4. **Personal Goals** — checklist items per sub-area (health, relationships, enrichment) + the quarterly check-in grid as an editable table
5. **Career Development** — now→target comparison table, milestone tracker, quarterly action-plan checklist
6. **Skill Development** — skills audit table with level sliders (1–5), learning plan table, milestone checklist
7. **Review Cadence** — a "what's due" widget (weekly/monthly/quarterly/annual) that surfaces open items based on today's date
8. **Notes & Changelog** — freeform log, timestamped

---

## 5. Screens

- **Dashboard** — top 3 priorities, current quarter theme, what's due this week/month, quick-glance progress (budget %, goals % complete, skills progress)
- **Timeline** — the 5-quarter roadmap
- **Budget** — framework + milestones + tracking
- **Goals** — health / relationships / enrichment + quarterly check-in grid
- **Career** — now vs target, milestones, quarterly actions
- **Skills** — audit, learning plan, milestones
- **Reviews** — log past reviews, see what's due
- **Settings** — export/import data, reset, (optional future: enable cloud sync)

---

## 6. Build Phases (for Claude Code)

**Phase 1 — Foundation**
- Project scaffold (Vite + React + Tailwind)
- Data layer: IndexedDB schema + CRUD functions
- Import the doc's default structure as seed data

**Phase 2 — Core CRUD screens**
- Vision/Priorities, Timeline, Budget, Goals, Career, Skills — basic editable views

**Phase 3 — Review cadence logic**
- "What's due" logic based on current date vs. weekly/monthly/quarterly/annual rules
- Review log

**Phase 4 — Dashboard + polish**
- Dashboard aggregating key stats/progress
- Charts (budget breakdown, skills radar, financial milestone progress)

**Phase 5 — PWA + portability**
- Installable PWA, offline support
- JSON export/import for backup

**Phase 6 (optional, later)** — Cloud sync if you ever want multi-device

---

## 7. Open Decisions

- Hosting: run locally only, or deploy free (GitHub Pages/Vercel)?
- Notifications: any interest in browser notifications for "review due" reminders, or just an in-app banner?
- Should the app hold *only* this plan, or be flexible enough to reuse for future plans (2028+)?

---

## 8. Changelog

- *2026-09-21* — Initial project plan created.
- *2026-09-21* — Plan period re-based to Q4 2026 → Q4 2027 (5 quarters) to match
  the re-based `lifestyle-plan.md`.
