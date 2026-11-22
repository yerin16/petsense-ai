# Pet Life: Update since Maker Day 2

Where Pet Life is headed after Maker Day 2, and what's being built now.

> **Update (Nov 22):** this note is from before Maker Day 3, so its experiments and dates are out of date. The app is now **PetSense AI** and everything is built. **To run the experiments, use [EXPERIMENT_GUIDE.md](EXPERIMENT_GUIDE.md)** (participant links, session script, how to read the Sheet). Demo Day notes are in [DEMO_DAY.md](DEMO_DAY.md).

---

## 1. What we heard at Maker Day 2

1. **Is it for all pets or just dogs?** We need to say this clearly.
2. **Pick a wedge.** Two options were suggested:
   - High-quality pet owners who spend a lot on their pets
   - Owners who can't afford vet care and want the closest alternative
3. **PetSense AI looked interesting.** The audience wanted to see more of it.

---

## 2. What we decided

### Dogs only
Our interviews, the pivot slide, and the persona are all about dogs. Saying "dogs only" makes the pitch sharper. Cats can come later.

### Wedge: high-spend owners of senior & chronic-condition dogs
This builds on the pivot we already made in Crit 2 (*All dog owners → Senior & chronic-condition dog owners*), with the spending angle added.

**Why this wedge and not the "can't afford vet care" one:**
- These owners **already spend a lot** on their dogs, so a subscription (~$8–12/mo) is believable. That supports our "paid retention" claim.
- They have a **recurring need**: an aging or sick dog means constant "is this normal?" moments. That supports our "recurring need" claim.
- The interviews back it up:
  - **Sophia** (dog with chronic GI issues): *"Am I overreacting, or am I waiting too long?"* She wants to know **what to do next**, not a diagnosis.
  - **Rachel** (10-yr-old poodle): couldn't tell if tiredness was just age or something wrong.
  - **Elise**: paid **$700** for an ER visit that turned out not to be an emergency.
- The "can't afford vet care" wedge has **higher risk**. If the AI stands in for a vet, a wrong answer can hurt the dog. It also has a weaker business model.

> Bonus: PetSense still helps with cost. It can tell owners "this can wait for your regular vet," which avoids unnecessary ER bills like Elise's.

### PetSense AI becomes the main feature
Our Crit 2 deck pitched PetSense, but **the Figma prototype didn't have a single PetSense screen**. Now it's the center of the app.

How it works:
1. The owner describes what they're seeing ("he's had soft stool for 2 days and left some breakfast").
2. PetSense checks it against **the dog's own history**: daily check-ins, conditions, meds, and past flare-ups.
3. It gives one of three answers:
   - 🟢 **Monitor at home**
   - 🟡 **Call your vet today**
   - 🔴 **Go to emergency now**
4. Each answer explains *why* (e.g. "3rd soft-stool day; last flare in June resolved with bland diet"), what to watch for, and when to escalate.

**Safety (our "safe AI guidance" weakest claim):**
- Emergency symptoms (bloat, toxin ingestion, collapse, etc.) are **hard-coded rules**. Those cases go straight to "Go to ER" without asking the AI.
- The AI is **not allowed to diagnose or suggest drug doses**.
- When unsure, it picks the more cautious answer. Every result says *"PetSense is not a vet."*

---

## 3. What changed in the prototype

**Persona update:** Biscuit is now an **11-year-old Golden Retriever with hip arthritis and a sensitive stomach**, not a healthy 4-year-old. Same name, so it connects to Crit 2.

| Screen | Before (Figma) | Now |
|---|---|---|
| Home | Stat tiles (weight, vaccines, meds) | **"Lately vs. Biscuit's normal"** card + **"Something seem off?"** PetSense entry |
| Daily check-in | — | **New.** 30-second log: appetite, energy, stool, mobility, water. Each one shows "normal for him" |
| Timeline | Vaccines, visits | Adds **flare-ups** and **lab results**, with filters |
| Meds | Med list + refill | Adds a **GI flare-up plan** from the vet, with "call the vet if…" warnings |
| PetSense | — | **New.** Chat → triage result (stage 2, Nov 18) |
| Vet visit prep | Basic vet summary link | Auto summary of **everything since the last visit** (stage 5) |
| Share / Sitter | Sharing access | Kept, plus "what's normal / red flags" for the sitter (stage 5) |

**Cut for now:** multi-pet, cats, booking integrations, real document scanning.

---

## 4. Figma → a real app

I'm building it as a real app with **React Native (Expo)** instead of continuing in Figma.

**Why:**
- Figma can only fake **one scripted PetSense conversation**. Testers can't type their own concern, so we can't learn whether the AI advice is actually useful.
- Daily check-ins only mean something if people **use it over several days**. That needs a real app.
- One codebase runs on **iPhone** (for user tests) and in a **browser** (for crit demos).

**Costs:** PetSense uses the Claude API, at about **$0.05 per question**. A crit demo costs under $1, and a one-week user study about $6. There's also a **demo mode** with pre-written answers, so the demo works without Wi-Fi.

---

## 5. Build plan (fit to Maker Day 3 & 4)

PetSense moved earlier than in the original plan. It's the part we built ourselves that matters most for Demo Day, and it's what our riskiest hypotheses ("safe AI guidance", "recurring need") depend on.

| Stage | What gets built | Target date |
|---|---|---|
| **1 · Foundation** | App look (from our Figma), Biscuit's demo data, Home / Timeline / Meds, daily check-in | ✅ Done (Nov 11) |
| **2 · PetSense AI** | Chat, triage result, safety rules, demo mode | Nov 18 |
| **3 · Daily tracking** | Setup where owners describe their dog's "normal," plus a trends chart | Nov 22 |
| **4 · Test build** | Version that test owners can install and use for a week | Nov 23 |
| **5 · Polish** | Vet-visit summary, sitter view, pricing screen, demo rehearsal | Dec 1–3 |

**Maker Day 3 (Nov 13):** the app is the prototype behind our experiments. Stage 1 is working and can be shown as "underway."
**Maker Day 4 (Dec 4):** live demo of a customer using check-ins + PetSense, with a recorded backup. The one-week owner test (about Nov 23–30, Thanksgiving week) gives us results that are new since Maker Day 3.

---

## 6. How you can help: Maker Day 3 & 4

I'm handling the prototype. Can you two own the presentations and experiments? Here's what each Maker Day is graded on, and what we need.

### Maker Day 3: Derisking Plan · Fri Nov 13 · 5 min
📎 Slides as **one PDF by 5:00 PM Nov 13** (the Milestone 5 PDF is a separate upload)

- [ ] **Risk register with 20+ hypotheses**, each scored on **doubt** and **importance**. Start from our Crit 2 weakest claims and `Pet_Life_Evidence_Ledger_Recalibrated.xlsx`.
- [ ] **Tallest tales:** the top 3–5 hypotheses, and *why* they outrank the rest.
- [ ] **Three experiments**, one per tallest tale. Each needs: the hypothesis, the experiment, the **behavior** we measure (not opinions), and a **success threshold set in advance**. Suggestions:

  | Hypothesis | Experiment | Behavior measured | Threshold (draft) |
  |---|---|---|---|
  | Senior/chronic owners have a **recurring need** and will log often enough | 1-week test: owners use the app daily | Days with a check-in | ≥ 5 of 7 days for ≥ 60% of testers |
  | PetSense gives **safe, useful guidance** | 15 symptom scenarios run through PetSense, then checked by a vet or vet tech (Doneisha?) | Triage matches the vet's call | ≥ 13 of 15 match, and 0 emergencies under-called |
  | Owners will **pay** for it | Pricing screen in the app ("Start Premium · $9/mo") | % of testers who tap to subscribe | ≥ 30% |

  A cheap one to run first: post a sign-up form for the owner test in senior-dog Facebook/Reddit groups. **Behavior:** sign-ups. **Threshold:** ≥ 8 in 3 days. This tests demand and recruits testers at the same time.
- [ ] **Order and dates:** put the experiments in order of *most risk reduced for least cost*, name our constraints (time, number of testers, vet access), and give each unfinished experiment a date.
- [ ] **Status and data so far:** interviews (11 done), prototype stage 1 built, and anything else underway.
- [ ] **What changed:** canvas updates (customer segment, wedge, value proposition) and the product changes from section 3.

### Maker Day 4: Demo Day · Fri Dec 4 · 7 min · counts double
📎 Slides as **one PDF by 5:00 PM Dec 4** (also our Milestone 6)

- [ ] **Recruit 5–8 senior or chronic-condition dog owners now** for the one-week test (about Nov 23–30, Thanksgiving week, so ask early).
- [ ] **Line up a vet or vet tech** to review the PetSense scenarios.
- [ ] **Run the experiments and record the results** against the thresholds above. Results must be **new since Maker Day 3**.
- [ ] **Verdict:** is this venture worth pursuing? It has to follow from the results.
- [ ] **Reflection:** what we believed in September vs. now, the moment the evidence changed our mind (e.g. the pivot to senior/chronic dogs), what went wrong, and what we'd do differently.
- [ ] **Demo:** write a short customer story/script for the live demo, and record a backup video in case it breaks.
- [ ] **What's next:** what isn't built and what we'd build next.

**What I'll provide:** the working app (live demo + test build), PetSense scenario results, and usage numbers from the owner test (check-ins per tester, PetSense uses, pricing-screen taps).

---

## Try the app

You need Node.js installed and the Expo Go app on your phone. In the project folder, run:

```bash
npm install
npx expo start
```

Then scan the QR code with your phone camera, or press `w` to open it in a browser. Use **"Reset demo data"** at the bottom of Home to start fresh.
