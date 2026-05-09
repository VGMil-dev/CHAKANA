# Chakana — Marketing site UI kit

A pixel-fidelity recreation of the Chakana platform's public-facing
marketing surface: where neighbours discover the project, browse what's
circulating in the barrio, and decide to join.

This kit is **inferred from the brand brief and the product splash** —
no codebase or Figma was provided. The composition follows the splash's
canonical structure (mark · wordmark · subtitle · hero line · place
stamp · footer line) and applies the brand's editorial-asymmetry rules
across longer-form sections.

## Components

| File | Purpose |
|---|---|
| `Header.jsx` | Glassmorphic floating top nav with the Chakana mark + Spanish nav. |
| `Hero.jsx` | Splash-style hero — asymmetric Raleway display headline with a primary-coloured accent word, place stamp, and dual CTA. |
| `ImpactStrip.jsx` | Three-stat editorial strip — `display-md` numbers next to small `body-sm` captions, separated by tonal layering only. |
| `MarketSection.jsx` | The "Mercado" listing — three product cards, no dividers, mid-dot metadata. |
| `TallerSection.jsx` | Featured "Talleres" card with the Andean Edge accent + supporting paragraph. |
| `CycleSection.jsx` | Educational walkthrough of the 4-step Cycle Indicator. |
| `JoinSection.jsx` | Membership CTA on a `surface-container-low` panel — Spanish first, English secondary. |
| `Footer.jsx` | Wordmark + place stamp + "REACTIVANDO LA ATENAS" legend. |

## Conventions

- All components consume tokens from `../../colors_and_type.css`. No
  hardcoded hex values inside JSX.
- Components are presentational — no real data fetching, no routing.
  `index.html` strings them together to form the homepage.
- Copy is Spanish-first, civic, sentence-case. Eyebrows are
  ALL CAPS + primary red + wide-tracked.
- Loaded with React 18 + Babel inline, per the host conventions.
