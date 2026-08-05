# Prompt History — Medicine Directory

Harness: **Claude Code** (VS Code extension). Raw turns below, in order, as actually typed/answered — not a cleaned-up summary. Where I used an interactive clarifying-question UI (AskUserQuestion) instead of free text, I've included the exact question and the option I picked, since those choices are as much a prompt as free-text turns.

---

**[Turn 1]**
> integrate openspec to this we will do a project.

**[AI clarifying question]** "What kind of project is Medibuddy going to be, so I can set up OpenSpec and the initial project scaffold appropriately?" — options: Web app (frontend+backend) / Backend API only / Mobile app / Not sure yet.

**[Turn 2 — my answer]**
> frontend react js and next js

**[AI clarifying question]** "How should I set up the Next.js app and OpenSpec in this empty Medibuddy folder?" — options: Next.js (TS, App Router, Tailwind) + OpenSpec init (Recommended) / Next.js (JS, no TypeScript) + OpenSpec init.

**[Turn 3 — my answer]**
> Next.js (TS, App Router, Tailwind) + OpenSpec init (Recommended)

*(AI scaffolded the Next.js app, initialized git, installed OpenSpec via `@fission-ai/openspec`, ran `openspec init --tools claude`. Flagged that its first npm search for "openspec" returned spammy-looking unrelated packages before it found the real one.)*

---

**[Turn 4]**
> @prompts.md read this file and /opsx:prose for phase 1

*(Attached `prompts.md` — a pre-written kickoff brief I'd drafted separately, framing the AI as a senior engineering team, describing the Medicine Directory take-home assignment, and laying out a 7-phase workflow: Product Discovery → Technical Architecture → UI/UX Planning → Implementation Planning → Implementation → Quality Review → Final Code Review. Asked for Phase 1 only, no code yet.)*

*(AI ran `openspec new change`, wrote `proposal.md` containing both the OpenSpec Why/What Changes/Capabilities framing and a full Phase 1 Product Specification — users, journeys, product decisions, information architecture, trade-offs, edge cases, exclusions. It raised three open questions before proceeding: (1) reorder Warnings above Dosage for safety, (2) fetching strategy split, (3) slug collision handling.)*

---

**[Turn 5]**
> OK to reorder the details page so Warnings appears above or directly after Dosage (safety-first hierarchy) rather than last as listed in the assignment brief?
>
> OK with server-rendered details page + client-side interactive homepage search as the fetching split, or do you want TanStack Query used more broadly (e.g. for the homepage results too)?
>
> Any preference on how to handle slug collisions (e.g. two different products that would slugify to the same string)?
>
> you will decide and /opsx:apply

*(In hindsight, this turn is exactly the problem the assignment's grading criteria calls out — I deferred all three engineering trade-offs back to the AI instead of making the calls myself. The AI picked defaults (Warnings promoted above Dosage, server+client split as originally proposed, disambiguation-view UI for slug collisions), wrote `design.md`, `specs/*.md`, `tasks.md`, and implemented all 30 tasks end to end — homepage search, details page, SEO metadata, error/loading/empty states, responsive layout, and a final lint/build/type-check pass. Verified against live openFDA data including the "fever tablet" no-inference case and a real multi-manufacturer collision ("Tylenol").)*

---

**[Turn 6]**
> so here i have got this assignment:
> What We're Evaluating
> 1. Product thinking — deliberate calls on layout, content, and SEO for the Indian context, not a generic template. How you handle multiple formulations of the same drug. Whether you show a disclaimer for health info.
> 2. Edge cases — zero results, ambiguous multi-match searches, missing fields, slow requests, malformed responses.
> 3. Code quality — no duplicated logic, clean components, Tailwind used properly, not just made to work.
> 4. Your thinking process, visible in your prompt history (below) — what you researched, what you rejected and why, how fast you iterated.
> No one nails all four. We're looking for where you spike, and how much care went in.
> [... full assignment text, including AI-tool requirements, prompt-history export instructions, and submission checklist ...]
>
> now i did one in prompt right instead it should poerty my decesion is invloved in every step so can you modify the prompt and opespec in that direct what do you think??

*(AI recommended two changes: rework the remaining OpenSpec flow so open questions come back as real choices with trade-offs rather than "you decide," and export this session's actual raw turns as `prompt-history.md` instead of a cleaned narrative.)*

---

**[Turn 7]**
> yesss

*(AI re-asked the three earlier decisions properly via structured questions, this time waiting for actual picks with stated trade-offs instead of pre-committing:)*

**[AI question 1]** "Details page field order: the assignment lists Dosage before Warnings, but Warnings being safety-critical could argue for showing it earlier. What's your call?" — options: Warnings above Dosage (safety-first) / Follow assignment order exactly / Warnings first above everything.

**[Turn 8 — my answer]**
> Follow assignment order exactly (Dosage then Warnings)

**[AI question 2]** "Fetching strategy: should the homepage search and details page use the same data-fetching approach, or different ones?" — options: Server-rendered details + client-side search (current) / TanStack Query everywhere / Plain fetch everywhere, no TanStack Query.

**[Turn 9 — my answer]**
> Server-rendered details page + client-side search (current)

**[AI question 3]** "Slug collisions (two different products slugify to the same URL) — how should this be handled?" — options: Disambiguation view at the same URL (current) / Hash-suffixed slugs for guaranteed uniqueness / Just pick the first match and accept the risk.

**[Turn 10 — my answer]**
> Hash-suffixed slugs for guaranteed uniqueness

*(AI reverted the details-page field order to match the assignment exactly, replaced the disambiguation-view slug scheme with hash-suffixed unique slugs — removing the now-unnecessary `DisambiguationList` component and the `ambiguous` lookup state — and rewrote `design.md`/`proposal.md`/the relevant `specs/*.md` files to record these as explicit product-owner decisions with the rejected alternatives and why. Re-verified with a live-data smoke test: a hash-suffixed Tylenol slug resolves to the exact intended record with Dosage now rendered before Warnings; a bare `/medicine/tylenol` slug (ambiguous, no hash) correctly 404s instead of guessing. Re-ran type-check, lint, and production build — all clean.)*
