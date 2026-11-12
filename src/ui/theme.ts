// Design tokens pulled from the Pet Life Figma prototype (Home / Timeline / Meds frames).

export const colors = {
  ink: '#2A0F3F', // primary text
  muted: '#8A7A96', // secondary text
  plum: '#4A1A6B', // text on white chips/buttons
  violet: '#6E2F94', // date labels
  lilac: '#F1E6F6', // chip + icon backgrounds
  lilacLine: '#E3D7EA', // dividers, empty check
  rail: '#C7ADD9', // timeline rail
  white: '#FFFFFF',
  coral: '#E5566F', // urgent / emergency
  coralSoft: '#FCE3EA',
  green: '#2E9E6B', // given / healthy
  greenSoft: '#DFF3EA',
  amber: '#C9821A', // "call your vet" triage level
  amberSoft: '#FBEEDB',
  onDarkMuted: '#E4D3EE',
};

export const gradients = {
  screen: ['#D9BFE8', '#F3EAF8'] as const, // vertical page background
  primary: ['#3A1157', '#7A35A3'] as const, // buttons, active chips
  hero: ['#3A1157', '#6E2F94'] as const, // "due soon" card
  tabBar: ['#3A1157', '#5B2380'] as const,
};

export const fonts = {
  heading: 'Poppins_600SemiBold',
  headingMedium: 'Poppins_500Medium',
  body: 'Montserrat_400Regular',
  bodyMedium: 'Montserrat_500Medium',
  bodySemi: 'Montserrat_600SemiBold',
};

export const radius = { card: 24, cardSm: 20, hero: 28, pill: 100 };

export const shadow = {
  card: { boxShadow: '0px 6px 18px 0px rgba(64,20,89,0.12)' },
  tabBar: { boxShadow: '0px 6px 18px 0px rgba(51,13,77,0.3)' },
};

export const space = { gutter: 24, gap: 14 };
