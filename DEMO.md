# Demo Day guide

**Fri Dec 4 · 7 minutes · counts double.** Slides PDF due 5:00 PM. Every member must be there.

## What the 7 minutes must cover

- [ ] **Vision:** customer, problem, wedge, and what PetSense does, in a sentence or two
- [ ] **Experiments:** what we tested, results as "X of 8" against the pass marks, what's new since Maker Day 3, and how it changed our view
- [ ] **Demo:** the working app as an owner uses it (about 2 min, script below)
- [ ] **What's next:** what isn't built, what we'd build next, and our verdict on the venture
- [ ] **Reflection:** what we believed in September vs. now, the moment evidence changed our minds, what we'd do differently

**Fix from Maker Day 3 feedback:** show where the top 5 risks came from (the risk register, all tied at 9), how we ranked them ("if this is false, does the product fail?"), and why the order is *open it → log it → trust it*.

## Before the demo

1. Use the device you'll present with. Open **https://petsense-ai.expo.app**.
2. At the bottom of Home, tap **Reset demo data**.
3. Tap **Presenter mode**, enter the team passcode (ask Yerin), and tap **Turn on live AI**.
4. Ask one practice question and check that the answer says **"PetSense AI"** at the top right. If it says "Demo answer", the demo still works, but tell Yerin.
5. Tap **Reset demo data** again.

## Demo script (about 2 minutes)

**Setup line:** *"This is Biscuit, an 11-year-old Golden with hip arthritis and a sensitive stomach. His owner logs a 30-second check-in each day, so PetSense knows what's normal for him."* Point at "Lately vs. Biscuit's normal" on Home.

**1. "Should I wait?" → monitor** 🟢
- Tap **Something new? Should I wait?**
- Pick **Vomiting → 1**, **Ate less**, **Today**, then **Save**.
- Say: *"PetSense compares this with his history. His last flare-up started the same way and settled with his vet's plan, so it says it's OK to watch at home, and tells you exactly when to stop waiting."*
- Tap **Save to Biscuit's timeline**, then **Done**.

**2. When to stop waiting → call the vet** 🟡
- Ask again with the same symptoms, but pick **2+ days ago**.
- Say: *"Same symptoms, but it's lasted longer than his plan covers, so now it says call the vet today."*

**3. Safety first → emergency** 🔴
- Ask again: pick **Something else**, **Today**, and type the note *"his belly looks swollen and he keeps retching"*.
- Say: *"Emergency signs are checked by fixed rules before any AI runs, so this goes straight to 'Go to emergency now'."*

**Closing line:** *"The part we built ourselves is this: guidance that uses the dog's own history and tells owners when to stop waiting."*

With live AI, wording changes a little each time, and answer 2 might also say "call the vet". That's fine. Never type real medical questions from the audience during the demo.

## Things to say carefully

- PetSense **is not a vet** and doesn't diagnose. Don't claim it's clinically safe: the emergency rules are a safety net, not validated.
- The trust experiment's safe answer comes from **public vet guidance (VCA)**, not a vet review.

## If something goes wrong

- **No internet or the AI fails:** the app automatically shows prewritten answers, so keep going.
- **The app won't load at all:** play the backup video.

## Backup video shot list

About 2 minutes, recorded from a phone screen, with a voice-over of the lines above. Before recording: tap **Reset demo data**, turn on **Presenter mode** (so answers say "PetSense AI"), and turn on Do Not Disturb. It's fine to record each shot separately and join the clips.

| # | Shot | What's on screen | Say |
|---|---|---|---|
| 1 | **Home** (~10s) | Home, scroll slowly to "Lately vs. Biscuit's normal" | "This is Biscuit, 11, hip arthritis and a sensitive stomach. A 30-second daily check-in tells PetSense what's normal for him." |
| 2 | **Should I wait?** (~5s) | Tap the gradient card at the top | "Something new comes up. Should I wait?" |
| 3 | **🟢 Log it** (~15s) | Vomiting → 1, Ate less, Today, then Save. Stay on "Checking Biscuit's history…" | "Logging takes seconds." |
| 4 | **🟢 Answer** (~25s) | "Monitor at home" banner, scroll slowly through why, what to do, when to call | "His last flare-up started the same way and settled with his vet's plan. It also tells you exactly when to stop waiting." |
| 5 | **Timeline** (~10s) | Save to Biscuit's timeline, then Done. Open Timeline and show the "New symptom" entry | "It goes into his history for the vet." |
| 6 | **🟡 Longer** (~20s) | Same symptoms but **2+ days ago**, then "Call your vet today" | "Same symptoms, but it's lasted longer than his plan covers, so call the vet today." |
| 7 | **🔴 Emergency** (~20s) | Something else, Today, note *"his belly looks swollen and he keeps retching"*, then "Go to emergency now" | "Emergency signs are checked by fixed rules before any AI runs." |
| 8 | **Close** (~10s) | PetSense tab, Recent answers showing all three levels | "Guidance that uses the dog's own history and tells owners when to stop waiting." |

Scroll slowly so the text is readable, and keep a copy of the video on the presenting laptop in case the Wi-Fi is down.
