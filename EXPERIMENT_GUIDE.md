# Experiment guide (for Jessie & Charlotte)

Everything you need to run the three PetSense AI experiments. The app does the timing, the A/B assignment and the note-taking: every answer goes straight into our Google Sheet. **We need 8 people, and each person does all three tasks in one session of about 10 minutes.**

## Who can take part

- Adults who own a **senior dog (about 8+)** or a dog with an **ongoing health condition**.
- **Not** classmates, friends on the team, or anyone who has seen PetSense before.
- Write down how you found them (for the slides).

## Before your first real session

1. **Practice once yourself** with a team code: open `https://petsense-ai.expo.app/study?code=T01` and do all three tasks. Team codes start with **T** (T01, T02, …) and are ignored in the results.
2. In the Sheet's **Results** tab, delete any rows whose participant starts with **T**.
3. In the Sheet, add a column after `id` called **team_notes**. The app never writes there, so it's safe for your notes.

## Participant links

Send each person **their own link**. The code in the link tells the app who they are and which version (A/B) they get. Each experiment is balanced: 4 people get A and 4 get B.

| Participant | Link | Task 1 (adoption) | Task 2 (logging) | Task 3 (trust) |
|---|---|---|---|---|
| P01 | `https://petsense-ai.expo.app/study?code=P01` | A appetite | A text | B generic |
| P02 | `https://petsense-ai.expo.app/study?code=P02` | A appetite | B tap | A personalized |
| P03 | `https://petsense-ai.expo.app/study?code=P03` | B activity | B tap | A personalized |
| P04 | `https://petsense-ai.expo.app/study?code=P04` | B activity | A text | A personalized |
| P05 | `https://petsense-ai.expo.app/study?code=P05` | B activity | B tap | A personalized |
| P06 | `https://petsense-ai.expo.app/study?code=P06` | A appetite | A text | B generic |
| P07 | `https://petsense-ai.expo.app/study?code=P07` | A appetite | B tap | B generic |
| P08 | `https://petsense-ai.expo.app/study?code=P08` | B activity | A text | B generic |
| Spare: P09 | `https://petsense-ai.expo.app/study?code=P09` | A appetite | B tap | A personalized |
| Spare: P10 | `https://petsense-ai.expo.app/study?code=P10` | B activity | A text | B generic |

**Use P01 to P08 in order.** If someone drops out or their session doesn't count, give the next person P09 (then P10), not the same code. Don't tell participants which version they have.

## Running a session (about 10 minutes)

1. Get on a call. Ask them to use **their own phone** if possible, and send their link.
2. Say something neutral, like:
   > "Thanks for helping! You'll do three short tasks in a prototype app for dog owners. There are no right or wrong answers. I can't help during the tasks, so just do what you'd really do. Please think out loud if you like."
3. They tap the tasks **in order** (each one unlocks after the previous one).
4. **Don't help, hint or react** during the tasks. If they ask a question, say *"Do whatever you'd do at home."*
5. In **team_notes**, write anything that matters, especially for **task 2: did they ask for help?** (A log with help doesn't count as a pass.)
6. At the end, you can ask a short debrief question (e.g. "Why did you pick that first?") and note the answer. The numbers come from what they did, not what they say.

### What each task is

| Task | What they see | What it measures |
|---|---|---|
| **1. What would you do?** | A short intro to PetSense, then a mild made-up symptom, then 4 equal buttons: PetSense AI, Google, vet, wait | The **first** button they tap |
| **2. Log a symptom** | "Biscuit threw up once and ate less today. Please record this and save it." A text form (A) or tap-to-pick form (B) | Seconds from seeing the task to "Saved ✓", and whether the log is accurate |
| **3. Read some guidance** | A situation (soft stool, otherwise fine) and PetSense's advice, personalized with his history (A) or generic (B). Then monitor / call vet / urgent care | Whether they pick the safe answer that matches the advice (monitor at home) |

## If something goes wrong

- **The page froze or the internet dropped:** their answers are saved on their device and send automatically when they reopen the link.
- **A task needs to be redone after a technical problem:** on the study page, open **"For the team"** at the bottom and tap **Redo**. Only use this for technical problems, and only the participant's **earliest** row counts.
- **"Page not found" right after Yerin updates the app:** wait 5 minutes and reload.
- **Anything else:** message Yerin.

## Reading the results

Open the **Results** tab. Each finished task is one row. Ignore rows whose participant starts with **T**. If someone has two rows for the same task, use the **earlier** one (`received_at`).

| Column | Meaning |
|---|---|
| `participant` | P01 to P10 |
| `experiment` | adoption, logging or trust |
| `version` | A or B |
| `choice` | What they picked (`petsense`, `google`, `vet`, `wait`; `saved` or `gave_up`; `monitor`, `call_vet`, `urgent`) |
| `seconds` | Time taken |
| `correct` | Logging: was the log accurate? Trust: did they pick the safe answer? (blank for adoption) |
| `detail` | Plain-English details: what they typed or picked, button order, errors |

### Pass marks (set before running, from our experiment cards)

| Experiment | Counts as a pass for one person | Passes if |
|---|---|---|
| **1. Adoption** | `choice` = **petsense** | **5 or more of 8** |
| **2. Logging** | `choice` = **saved**, `correct` = **TRUE**, `seconds` **≤ 120**, and **no help** (team_notes) | **6 or more of 8** |
| **3. Trust** | `correct` = **TRUE** (picked "Monitor at home") | **6 or more of 8** |

**Check version A logging rows by hand.** For the text form, the app only guesses accuracy from keywords. Read what they wrote in `detail` and fix `correct` if the guess is wrong (they should mention vomiting once, eating less, and "Today").

### For the slides

- Report each result as **"X of 8"** against the pass mark, plus what the others chose instead (e.g. "5 of 8 chose PetSense first; 2 waited; 1 Googled").
- Show A vs. B side by side, but **don't claim one version is better**: 4 people each is too few.
- Say the trust scenario's safe answer came from **public vet guidance (VCA, "Diarrhea in Dogs")**, not a vet review.
