# Pet Life

Interactive prototype for **owners of senior and chronic-condition dogs**: daily check-ins compared against the dog's own normal, meds, health timeline, and PetSense (AI triage, coming in milestone 3).

Demo persona: **Biscuit**, an 11-year-old Golden Retriever with hip osteoarthritis and recurring GI flare-ups. The app ships with 60 days of seeded history, all relative to today. Use **Reset demo data** at the bottom of Home before each crit.

## Run

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

## Milestones

1. ✅ Foundation: tokens, components, seed data, Home / Timeline / Meds, daily check-in
2. Onboarding with baseline, Trends chart
3. PetSense: red-flag rules, Claude API route, triage card, demo mode
4. Vet-visit prep report, sitter view, paywall, user testing build
