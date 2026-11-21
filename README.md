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

## Structure

| Path | What |
|---|---|
| `app/(tabs)/` | Home, Timeline, PetSense, Meds, Share tabs |
| `app/checkin.tsx` | Daily check-in sheet |
| `src/ui/` | Design tokens (from Figma) + shared components + pill tab bar |
| `src/seed/` | Biscuit's demo data and date helpers |
| `src/store/` | Zustand store (persisted on device) + selectors |

## Build order

See [PLAN.md](PLAN.md) for details. Demo Day is Dec 4.

1. ✅ Foundation: tokens, components, seed data, Home / Timeline / Meds, daily check-in
2. ✅ Rename to PetSense AI + web link (EAS Hosting)
3. Results logging to a Google Sheet for experiments
4. Symptom log + save flow, A/B, auto-timed (experiment 2)
5. Adoption choice screen with the "Should I wait?" intro (experiment 1 retest)
6. Trust screens: personalized vs. generic guidance (experiment 3)
7. Real PetSense AI: triage, red-flag rules, demo mode, presenter passcode
8. Polish + demo script + backup video
