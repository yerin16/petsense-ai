# PetSense AI

Interactive prototype of **PetSense AI** for **owners of senior and chronic-condition dogs**. When a new symptom appears, it answers "Should I wait?" using the dog's own health history. It also includes daily check-ins, meds, a health timeline, and experiment screens.

Demo persona: **Biscuit**, an 11-year-old Golden Retriever with hip osteoarthritis and recurring GI flare-ups. The app ships with 60 days of seeded history, all relative to today. Use **Reset demo data** at the bottom of Home before each crit.

## Live link

**https://petsense-ai.expo.app** works on any phone or laptop browser. Use "Add to Home Screen" for an app-like feel.

To redeploy after changes:

```bash
npx expo export --platform web && npx eas-cli@latest deploy --prod
```

## Run locally

```bash
npm install
npx expo start          # press w for web, i for iOS simulator, or scan the QR code with Expo Go
```

## Experiment results (Google Sheet)

The server reads the Sheet's Apps Script URL from `STUDY_SHEET_URL`:

- Local: put `STUDY_SHEET_URL=https://script.google.com/macros/s/.../exec` in `.env.local` (gitignored).
- Live link: `npx eas-cli@latest env:set --name STUDY_SHEET_URL --value <url> --environment production --visibility sensitive`, then `npx expo export --platform web && npx eas-cli@latest deploy --prod --environment production`.

## PetSense AI (real AI)

Everyone with the link gets prewritten demo answers. Real Claude answers need two server-side variables, then a redeploy. Leave out `--value` so the CLI prompts for it, which keeps the key out of your shell history:

```bash
npx eas-cli@latest env:set --name ANTHROPIC_API_KEY --environment production --visibility sensitive
npx eas-cli@latest env:set --name PETSENSE_PASSCODE --environment production --visibility sensitive
npx expo export --platform web && npx eas-cli@latest deploy --prod --environment production
```

Then open **Presenter mode** (bottom of Home) on the demo device and enter the passcode. Optional: `PETSENSE_MODEL` (default `claude-opus-5-5`).

## Structure

| Path | What |
|---|---|
| `app/(tabs)/` | Home, Timeline, PetSense, Meds tabs |
| `app/study/` | Experiment screens. Send each participant `/study?code=P03` |
| `app/api/log+api.ts` | Forwards experiment results to the Google Sheet |
| `app/api/petsense+api.ts` | PetSense: red-flag rules → demo answer or Claude (with passcode) |
| `src/petsense/` | Red flags, demo answers, prompt, dog-history summary, presenter passcode |
| `src/study/` | A/B assignment, result logging, offline queue |
| `scripts/sheet-apps-script.gs` | Paste into the Sheet's Apps Script (setup steps inside) |
| `app/checkin.tsx` | Daily check-in sheet |
| `src/ui/` | Design tokens (from Figma) + shared components + pill tab bar |
| `src/seed/` | Biscuit's demo data and date helpers |
| `src/store/` | Zustand store (persisted on device) + selectors |

## Build order

See [PLAN.md](PLAN.md) for details. Demo Day is Dec 4.

1. ✅ Foundation: tokens, components, seed data, Home / Timeline / Meds, daily check-in
2. ✅ Rename to PetSense AI + web link (EAS Hosting)
3. ✅ Results logging to a Google Sheet for experiments
4. ✅ Adoption choice screen with the "Should I wait?" intro (experiment 1 retest)
5. ✅ Symptom log + save flow, A (text-first) / B (tap-to-pick), auto-timed (experiment 2)
6. ✅ Trust screens: personalized vs. generic guidance (experiment 3)
7. ✅ Real PetSense AI: triage, red-flag rules, demo mode, presenter passcode
8. Polish + demo script + backup video
