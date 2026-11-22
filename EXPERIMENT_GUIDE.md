# Experiment guide

How to run the three PetSense AI experiments. The app handles timing, A/B assignment and recording: every answer goes straight into our Google Sheet.

**8 people. Each person does all three tasks in one session (about 10 minutes).**

## The three experiments

| # | Task | Version A | Version B | Pass if |
|---|---|---|---|---|
| 1 | **What would you do?** A short PetSense intro and a mild symptom, then 4 equal buttons (PetSense AI / Google / vet / wait) | Appetite: ate only half of breakfast | Activity: wanted to head home early on the walk | **5 of 8** tap PetSense AI first |
| 2 | **Log a symptom:** "Biscuit threw up once and ate less today. Record it and save it." | Text-first form (type it) | Tap-to-pick form (choose symptoms) | **6 of 8** save an accurate log in **≤ 2 min, without help** |
| 3 | **Read some guidance:** soft stool but otherwise fine, PetSense says monitor at home. Then pick monitor / call vet / urgent care | Personalized (uses Biscuit's history) | Generic (same advice, no history) | **6 of 8** pick **Monitor at home** |

Each experiment gives 4 people version A and 4 people version B. Report A vs. B side by side, but don't claim one is better: 4 people each is too few.

## Who can take part

Adults who own a **senior dog (about 8+)** or a dog with an **ongoing health condition**. Not classmates or anyone who has seen PetSense before.

## Before the first session

1. Practice once with a team code: `https://petsense-ai.expo.app/study?code=T01`. Codes starting with **T** are for practice.
2. In the Sheet's **Results** tab, delete the rows whose participant starts with **T**.
3. Add a column after `id` called **team_notes**, for your notes.

## Links

Send each person **their own link**, P01 to P08 in order. If a session doesn't count, give the next person P09 (then P10) instead of reusing a code.

| Code | Link | Versions (task 1 / 2 / 3) |
|---|---|---|
| P01 | `https://petsense-ai.expo.app/study?code=P01` | A / A / B |
| P02 | `https://petsense-ai.expo.app/study?code=P02` | A / B / A |
| P03 | `https://petsense-ai.expo.app/study?code=P03` | B / B / A |
| P04 | `https://petsense-ai.expo.app/study?code=P04` | B / A / A |
| P05 | `https://petsense-ai.expo.app/study?code=P05` | B / B / A |
| P06 | `https://petsense-ai.expo.app/study?code=P06` | A / A / B |
| P07 | `https://petsense-ai.expo.app/study?code=P07` | A / B / B |
| P08 | `https://petsense-ai.expo.app/study?code=P08` | B / A / B |
| P09 (spare) | `https://petsense-ai.expo.app/study?code=P09` | A / B / A |
| P10 (spare) | `https://petsense-ai.expo.app/study?code=P10` | B / A / B |

## During the session

1. Get on a call and send their link. Their own phone is best.
2. Say: *"You'll do three short tasks in a prototype app for dog owners. There are no right or wrong answers, and I can't help during the tasks, so just do what you'd really do."*
3. **Don't help or react.** If they ask something, say *"Do whatever you'd do at home."*
4. In **team_notes**, write whether they **asked for help in task 2**. A log with help doesn't pass.

**If something breaks:** answers are saved on their device and send when they reopen the link. To redo a task after a technical problem, open **"For the team"** at the bottom of the study page and tap **Redo**. Only the earliest row counts.

## Reading the Sheet

Skip rows starting with **T**. If someone has two rows for the same task, use the earlier one.

- **Adoption:** count rows where `choice` = `petsense`.
- **Logging:** count rows where `choice` = `saved`, `correct` = TRUE, `seconds` ≤ 120, and team_notes says no help. For **version A**, read what they typed in `detail` and fix `correct` if needed: the app only guesses from keywords (it should mention vomiting once, eating less, and today).
- **Trust:** count rows where `correct` = TRUE.

On the slides, give each result as **"X of 8"** against the pass mark, plus what the others chose. For experiment 3, say the safe answer comes from public vet guidance (VCA, "Diarrhea in Dogs"), not a vet review.
