# PetSense AI · Build Plan

## Context
- **Current prototype** (Figma, 11 screens): Welcome → Create profile → Scan records → Home → Timeline → Vaccine detail → Meds → Share → Sitter view → Vet link → Reminder. Persona: **Biscuit, a healthy 4-yr Golden**. It is a good *records organizer*. But it has **no AI screen**.
- **Crit2 deck** already pivoted to **senior & chronic-condition dog owners** and pitched **"PetSense AI: From Uncertainty to Confidence"**. Its weakest claims are: safe AI guidance, paid retention, recurring need, and depth of logging.
- **Maker Day 2 feedback:** (1) say whether it's for dogs or all pets, (2) pick a wedge (high-spend vs. can't-afford-vet), (3) the audience liked PetSense AI.
- **Interview evidence that should drive v2:** Sophia (chronic GI dog): *"Am I overreacting, or waiting too long?"* She wants next-step guidance, not a diagnosis, and wants to know what's normal *for her dog*. She struggles to recall symptom history for the vet. Rachel (senior poodle) can't tell age from illness. Elise paid $700 for an ER visit that wasn't an emergency.
- **Decisions (confirmed):** Dogs only. Wedge = **high-spend owners of senior / chronic-condition dogs**. Yerin builds it, comfortable dev.
- **Maker Day 3 (Nov 13) results:** the product is now pitched as **"PetSense AI"**: AI next-step guidance for **new or unexpected symptoms**, based on each dog's health history. The risk register has 29 hypotheses, and the top 5 are tied at doubt × importance = 9: voluntary opening, trust in AI advice, logging in ≤ 2 min, safe red-flag escalation, and urgency over wellness. Adoption test round 1: only **2 of 8** chose the AI app first (goal ≥ 5 of 8). 3 waited, 2 Googled, 1 contacted a vet. **The real rival is waiting and guessing**, so the pitch becomes **"Should I wait?"**: PetSense tells owners when to stop waiting. The logging-speed and trust experiments haven't run yet; they need a working symptom save flow and vet-reviewed scenarios.

**Core gap:** the pitch is about PetSense, but the prototype doesn't show it, and the persona doesn't match the wedge. v2 makes PetSense the hero and rebuilds the demo around a senior dog.

---

## Part 1: Product changes

### Positioning
- Tagline (after Maker Day 3): **"Should I wait?"** PetSense AI tells you when to stop waiting.
- Focus: **new-symptom guidance first, wellness tracking second** (hypothesis #5). The daily check-in stays as history that PetSense uses, but it isn't the main loop.
- Say on the welcome screen and in the deck: *For dogs 7+ or living with a chronic condition.*
- New persona: **Biscuit, 11-yr Golden, osteoarthritis + recurring GI flare-ups.** Keeping the name preserves continuity with Crit2.
- Pricing story: **$5/month** (matches risk register #22). Pricing isn't a top-5 risk, so no pricing screen gets built before Demo Day.

### Screen-by-screen

| # | Screen | Change |
|---|---|---|
| 0 | Welcome | New tagline and wedge copy |
| 1 | Create profile | Add **conditions**, current meds, primary vet, and a **"Biscuit's normal" baseline** (appetite, energy, stool, mobility, water) |
| 2 | Import records | Keep. Show extracted conditions/labs as well as vaccines |
| 3 | Home | Lead with **"Something new? Should I wait?"** (opens the symptom log → PetSense), then the "Lately vs. normal" card and today's meds |
| **NEW** | **Symptom log** | Record a new symptom (A: text-first / B: tap-to-pick layout for the A/B test). Saves to the timeline and feeds PetSense. Must be finishable in ≤ 2 min without help (experiment 2) |
| **NEW** | **Study screens** | Standalone experiment flows at `/study/*` (adoption, logging, trust) with A/B assignment, auto-timing, and results sent to a Google Sheet |
| **NEW** | **Daily check-in** | 30-second log: 5 taps (appetite/energy/stool/mobility/vomiting) + optional note/photo. Builds the baseline and tests depth of use |
| **NEW** | **PetSense chat** | Owner describes the concern → PetSense asks 1–3 follow-ups → returns a **triage card** |
| **NEW** | **PetSense triage result** | One of **Monitor at home / Call your vet today / Go to emergency now**, plus: *why* (cites Biscuit's history, e.g. "3rd soft-stool day; last flare in June resolved with bland diet"), *what to watch*, *escalate if…*, and a "not a diagnosis" note. Buttons: Log to timeline, Call vet, Find 24h ER |
| 4 | Health timeline → **Trends** | Symptom chart over time, overlaid with meds/visits/flare-ups |
| **NEW** | **Vet visit prep** | Auto-generated "since last visit" summary (symptoms, trends, med adherence, owner questions) → share link/PDF. Merges with the old screen 9 |
| 6 | Meds | Keep. Add **flare-up protocol** (vet-provided steps when GI acts up) |
| 7–8 | Share / Sitter | **Cut** (after Maker Day 3). The Share tab is removed from the app |
| 5, 10 | Vaccine detail, reminder | Keep as is |
| ~~NEW~~ | ~~Premium paywall~~ | Cut before Demo Day (not a top risk) |

**Defer:** multi-pet, cats, booking integrations, real OCR (fake the scan with canned results), onboarding baseline + Trends chart, vet-visit prep report, sitter view, pricing screen.

### PetSense safety design (the "safe AI" weakest claim)
1. **Hard-coded red-flag rules run first** (e.g. bloated abdomen + retching, collapse, toxin ingestion, no urination 24h, pale gums). These skip the LLM and return "Go to ER now" immediately.
2. The LLM gets the dog's profile, baseline, the last 30 days of check-ins, meds, and conditions. It must return **structured JSON**: `{triage_level, reasoning, history_refs[], watch_for[], escalate_if[], questions_for_vet[]}`. The prompt forbids diagnoses and drug dosing.
3. When unsure, the result is always one level more cautious. Every result includes "PetSense is not a vet".
4. These rules are cheap to build, but **safety is not validated**. The risk register keeps red-flag escalation (#4) as a future safety gate that needs a clinician-reviewed test set, so the demo and slides must not claim clinical safety.

---

## Part 2: Figma vs. real app (recommendation)

**Recommendation: build it as a real Expo (React Native) app, and stop iterating in Figma except for quick visual exploration.**

Why:
- The thing the audience liked (PetSense) is **conversational and history-dependent**. Figma can only fake one canned path, so testers can't type their own concern and judge whether the advice is useful. That is exactly the weakest claim you need evidence for.
- The experiments need **real behavior**: timed symptom saves, first clicks, and action choices. Only working screens can record those.
- Your Figma file is clean and componentized (Status bar, Field/*, Button/*, Chip/*), so translating it is cheap. Use the Figma MCP `get_design_context` per frame to pull tokens and layout.
- Expo gives you one codebase for an **iPhone via Expo Go/TestFlight** (user tests), plus **web** (laptop/projector demos and a shareable link for crit).

What *not* to build: no auth, no real backend database, no real OCR, no real vet integrations. Keep it a **high-fidelity prototype in code** with seeded data.

### Stack
- **Expo SDK (latest) + TypeScript + Expo Router** (file-based tabs: Home, Timeline, PetSense, Meds)
- **State:** Zustand + AsyncStorage persistence. Seed with Biscuit's 60-day history so trends look real on first launch
- **Charts:** victory-native or react-native-gifted-charts
- **Styling:** tokens pulled from the Figma variables (purple gradient, glass cards, Poppins-like type), via `get_variable_defs`
- **PetSense backend:** the *only* server piece. One **Expo API route** (`app/api/petsense+api.ts`, deployed with EAS Hosting) whose sole job is keeping the Claude API key off the device. No database, no auth: all pet data stays on the phone, and the app sends profile + recent logs + the question with each request. It calls the **Claude API** with structured JSON output. Model: `claude-opus-5-5` by default (switchable through an env var to `claude-sonnet-5-5` or `claude-haiku-5-5`). Use prompt caching on the system prompt.
- **Cost estimate:** each question is about 5K input + 1.5K output tokens, so roughly $0.05 on Opus 5.5, $0.025 on Sonnet 5.5, and $0.001 on Haiku 5.5. A demo (~10 questions) costs under $1. The experiments use scripted screens, not live AI, so they cost about $0. Set a monthly spend limit in the Anthropic Console.
- **PetSense is real, not mocked.** Add a **Demo mode** toggle that returns canned responses for 4 scripted scenarios (`src/petsense/demoResponses.ts`). Use it for crit if the network is unreliable, and as the fallback if the API call fails.
- **"Reset demo" button** in settings to restore seeded state before each crit
- **Shareable web link:** deploy the web version with **EAS Hosting** (`npx expo export --platform web` + `npx eas-cli@latest deploy`), giving a link like `https://pet-life.expo.app`. Anyone can open it in a phone or laptop browser with nothing to install, and "Add to Home Screen" makes it look like an app. EAS Hosting also runs the PetSense API route. GitHub Pages can't run it, because it only serves static files and the API key would be exposed. Redeploy after each change: `npx expo export --platform web && npx eas-cli@latest deploy --prod`.
- **Public-link safety: presenter passcode.**
  - By default, everyone with the link gets **Demo mode**: canned PetSense answers for a few sample concerns, at $0 cost.
  - **Settings → Presenter mode** asks for a **team passcode** once per device. The phone remembers it and sends it with each PetSense request.
  - The **server checks the passcode** against `PETSENSE_PASSCODE`, which is stored with `ANTHROPIC_API_KEY` as EAS environment variables with "sensitive" visibility (EAS Hosting can't deploy "secret" ones; after changing one, re-export and redeploy). Only on a match does it call Claude. Otherwise it returns the demo answer. The passcode is never in the app code, because anyone can read web app code in browser dev tools.
  - Share the passcode only with people who should get real AI (e.g. a teammate demoing). The experiments use scripted screens and don't need it.
  - Backstop: a monthly spend limit in the Anthropic Console (e.g. $10).

### Project layout (new repo in `pet-life/`)
```
app/(tabs)/index.tsx        Home
app/(tabs)/trends.tsx       Trends/timeline
app/(tabs)/petsense.tsx     Chat
app/(tabs)/meds.tsx
app/(tabs)/share.tsx
app/checkin.tsx             modal
app/triage/[id].tsx         result card
app/vet-prep.tsx
app/onboarding/*            welcome, profile, baseline, import
app/symptom.tsx             new-symptom log
app/study/*                 experiment flows: adoption, logging, trust
app/api/petsense+api.ts     Claude proxy
src/store/                  pet, checkins, meds, petsense history
src/petsense/redFlags.ts    deterministic rules
src/petsense/prompt.ts      system prompt + JSON schema
src/seed/biscuit.ts         60-day demo data
src/ui/                     tokens + Card, Chip, Button, Field (mirroring Figma components)
```

---

## Part 3: Build order (after Maker Day 3)

No day-by-day timeline. Build in this order, because each step unblocks the next. The test screens follow the same chain we present: **Will they open it? → Can they give it data? → Will they trust and act on the answer?**

**Fixed dates**
- **Test screens ready early enough** for the team to run 8 people per experiment before Demo Day. Demo Day needs results that are new since Maker Day 3.
- **Fri Dec 4, Demo Day** (7 min, counts double): working product live, slides PDF (Milestone 6) due 5:00 PM.

| # | Build | Why / what it unblocks | Status |
|---|---|---|---|
| 1 | **Foundation**: Expo + Router, Figma tokens, components, Biscuit seed data, Home / Timeline / Meds, daily check-in | Base app | ✅ Done |
| 2 | **Rename to PetSense AI + web link**: live at **https://petsense-ai.expo.app** (EAS project `@_yerin16/petsense-ai`) | Participants are remote, so every experiment needs a link | ✅ Done |
| 3 | **Results logging**: study screens send participant code, version (A/B), choice and time to a Google Sheet. `/study?code=P03` start page, balanced A/B table for P01–P08, rows saved on the device until the Sheet confirms them | All three experiments | ✅ Built (needs the Sheet URL) |
| 4 | **Adoption choice screen**: new "Should I wait?" intro → scenario (A: appetite / B: activity, random) → 4 equal buttons (PetSense AI / Google / vet / wait and monitor), records the first click. Button order is shuffled per participant. After a redo, only the earliest row counts | **Experiment 1 retest (pass ≥ 5/8)**. The most existential test and the simplest screen, so it goes first and the team can start running people sooner | ✅ Built |
| 5 | **Symptom log + save flow** in two versions (A: text-first / B: tap-to-pick layout instead of photo/voice, which the card allows), auto-timed from start to "Saved ✓". Same made-up symptom for everyone (Biscuit vomited once, ate less today); accuracy is checked automatically (B exactly, A by keywords, so the team reads A rows); "I can't finish this" logs a give-up. The form is reusable for step 7 | **Experiment 2 (logging ≤ 2 min, pass ≥ 6/8)**, blocked until this works | ✅ Built |
| 6 | **Trust screens**: fixed scenario + scripted guidance (A: personalized with the dog's history / B: generic), then pick monitor / call vet / urgent care | **Experiment 3 (pass ≥ 6/8 safe, aligned choices)**. No vet review: use a clear-cut mild scenario whose safe answer (monitor at home) matches published "when to call your vet" guidance, and cite that source. Built with VCA's "Diarrhea in Dogs" (updated Jul 2026) as the source: soft stool since this morning, eating and playful, safe answer = monitor; decision time is logged | ✅ Built |
| 7 | **Real PetSense AI**: symptom → triage using the dog's history, red-flag rules, demo mode, presenter passcode. Home leads with "Should I wait?" | **Demo Day:** "the part we built that matters" | ✅ Built (demo mode live; real AI needs ANTHROPIC_API_KEY + PETSENSE_PASSCODE on EAS) |
| 8 | **Polish + demo**: demo script, recorded backup video, rehearsal | Demo Day | |

**A/B in every experiment (required):** the team's Maker Day 3 experiment cards give each test two randomized versions, 4 people each, and the class's Rule 2 requires a control and a test. Pass/fail uses the overall score out of 8. A vs. B is reported descriptively only, with no claims that one version is better. Note on the logging card that version B is the tap-to-pick layout before recruiting.

**Removed from the old plan:** the 1-week owner diary test and its usage tracking (replaced by the three experiments), the daily-tracking milestone (onboarding baseline + trends), the pricing screen, vet-visit prep, the sitter view, and the Share tab.

**Decisions (confirmed Nov 21):**
- App name: **PetSense AI** (rename the app, title and web link to match the deck). Build step 2 includes the rename.
- Daily check-in: **kept, but as secondary history** that PetSense uses.
- Experiment results: **auto-sent to a Google Sheet**.
- PetSense for Demo Day: **real AI + demo mode**, not scripted only ("a mockup is not a build").
- Trust experiment: **no vet review**. The team sets the reference answer from public vet guidance, says so on the slides, and updates experiment card 3 to match.

**What Demo Day needs from the build** (Maker Day 4 rubric):
- **Product:** a working product, not a mockup, and the part we built ourselves has to matter. For us that's step 7, real PetSense AI using Biscuit's history. It must run live, with a recorded backup in case it fails.
- **Demo as a customer uses it:** one connected flow. Home → "Something new? Should I wait?" → log the symptom (the step 5 form, reused) → PetSense triage card → saved to the timeline.
- **Evidence:** results must be new since Maker Day 3 and measure behavior against thresholds set in advance (first click, seconds to save, action chosen). So the test screens (steps 3–6) come first, early enough for the team to run 8 people each.
- **Within 7 minutes:** keep the live demo to about 2 minutes, with a fixed script (step 8).

Team guides: [EXPERIMENT_GUIDE.md](EXPERIMENT_GUIDE.md) (running the experiments) and [DEMO.md](DEMO.md) (Demo Day checklist and demo script).

**Roles:** one teammate builds the prototype and test screens. The other two own recruiting, running the experiments, and the slides.


## Verification
- `npx expo start`: run on the iOS simulator (simulator MCP) and on web, and click through every screen against the Figma frames.
- PetSense scenario suite: a script hits `/api/petsense` with the 15 scenarios. Red-flag cases must return `emergency` without calling the LLM. No response may contain a diagnosis or dosing.
- Fresh-install test: the seeded demo works offline except for PetSense, and "Reset demo" restores it.
- Web link test: open the deployed link on a phone (Safari and Chrome) and a laptop, add it to the home screen, and confirm the data persists after closing and reopening. Demo mode answers PetSense without an API key. With no passcode or a wrong one, the server returns demo answers and makes no Claude call. With the right passcode, it gives real answers.
- Study screens: run each `/study/*` flow on a phone end to end in both A and B versions. Confirm the timer stops at "Saved ✓" and that a row (code, version, choice, seconds) lands in the Google Sheet.
- Demo Day deck: experiment results against the pre-set thresholds, the "Should I wait?" pitch, and the live PetSense demo with a backup video.
