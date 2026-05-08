# Chakana — Ancestral Modernism Design System

> _Aquí tu apoyo vuelve._
> Ecosistema de Economía Circular · Cuenca, Ecuador

Chakana is a circular-economy platform rooted in Cuenca ("La Atenas del
Ecuador"), where neighbours, makers, and small businesses route used goods,
materials and labour back into the local economy instead of into landfill.
The brand presents itself in Spanish first, English second; the design
system is set up to support both.

The visual identity is summed up in two words from the brief: **Ancestral
Modernism.** It bridges Andean geometry — the *Chakana*, the four-step cross
that organises Andean cosmology — with the editorial precision of high-end
sustainable luxury. The result reads like a curated gallery exhibition:
sober, warm, deeply rooted, never "tech-y."

---

## Sources

| Source | What it gave us |
|---|---|
| **Design system brief** (pasted into chat) | The full creative North Star, palette, type, elevation, components & content rules. The single normative document — see §1–6 of the brief. |
| **`uploads/Chakana.png`** | The product splash. Source of the logo mark, wordmark style, signature copy ("Aquí tu apoyo vuelve", "Reactivando la Atenas"), and atmosphere reference. Cropped to `assets/logo.png` and kept in full at `assets/chakana-splash.png`. |

No codebase or Figma was attached — the UI kit was built from the brand
brief plus the splash, and stays deliberately small (a marketing site for
the platform, the only surface evidenced by the splash).

---

## CONTENT FUNDAMENTALS

The voice is **quiet, civic, and warm.** The brand is a neighbourhood
co-op, not a startup. Copy reads like the wall text of a museum
exhibition or the editor's note in an independent magazine.

### Language
- **Spanish-first.** All hero/marketing copy is written in Spanish (Latin
  American, Ecuadorian register). English appears as a secondary layer for
  international supporters but is never the primary voice.
- **Local nouns, lightly used.** "Chakana", "Atenas", "Cuenca", "barrio",
  "feria", "taller" appear naturally. Avoid translating them — let them sit.
- **No corporate jargon.** No "synergy", "leverage", "ecosystem partner"
  (even though Chakana is itself an ecosystem — the word is reserved for
  the literal subtitle "Ecosistema de Economía Circular").

### Tone & person
- Speaks in **second person plural / inclusive first person**:
  "tu apoyo", "lo que damos", "nuestro barrio". Never "we, the platform"
  vs "you, the user". The brand is a participant, not a service provider.
- **Verbs of return.** "vuelve", "regresa", "circula", "reactiva",
  "germina". Movement is always cyclical, never one-way.

### Casing & punctuation
- Display headlines are **sentence case**, not Title Case. (`Aquí tu
  apoyo vuelve.` not `Aquí Tu Apoyo Vuelve.`)
- Wordmarks and brand stamps use **ALL CAPS with wide tracking**
  (`CHAKANA`, `REACTIVANDO LA ATENAS`).
- Metadata and category tags use **ALL CAPS, smaller, primary-coloured**
  (`· CUENCA, ECUADOR ·`, `MERCADO`, `TALLERES`).
- Mid-dot bullets `·` separate place/category metadata, not commas.
- Periods on hero statements: **yes.** They feel like the close of a
  museum caption.

### Length
- Heroes are **one sentence**, often a fragment. ("Aquí tu apoyo vuelve.")
- Body paragraphs run 2–4 sentences max. White space does the work
  prose would in another brand.
- CTAs are 1–3 words: `Sumarse`, `Ver mercado`, `Empezar a circular`.

### What we don't do
- **No emoji.** Anywhere.
- **No exclamation marks.** Confidence, not enthusiasm.
- **No corporate "We help X do Y" formulations.**
- **No bright "Success!" / "Oops!" microcopy.** Errors stay sober:
  `No pudimos cargar el mercado. Inténtalo nuevamente en un momento.`

### Examples (from the splash + the brief)
- Hero: **"Aquí tu apoyo vuelve."**
- Subtitle: **"Ecosistema de Economía Circular"**
- Place stamp: **"· CUENCA, ECUADOR ·"**
- Footer line: **"REACTIVANDO LA ATENAS"**
- Section eyebrows: `01 · MERCADO`, `02 · TALLERES`, `03 · CICLO`

---

## VISUAL FOUNDATIONS

The system is governed by a single instruction: **let it feel quiet.**
Every other rule below is in service of that.

### Palette atmosphere
- Warm, earth-toned, low-saturation. Pigments derived from Andean
  iron-rich soil and oxidised copper.
- **Two colours do the heavy lifting:** Rojo Tierra (`#A63A2F`) and
  Crema (`#F5F0EB`). Turquesa Andino (`#3AAFA9`) is a guest, not a host —
  used for accents, positive states, and the Cycle Indicator only.
- **Never pure black.** Text is Gris Carbón `#3D3D3D`.
- **Never pure white** as a background — surfaces step `#FFFFFF` →
  `#F8F3EE` → `#F5F0EB` to produce containment without lines.

### Typography
- **Raleway 600/700** for displays and headlines — geometric, monolithic,
  generously tracked (`-0.02em`).
- **Inter 400/500** for body and UI. Trust + legibility.
- Hero headings are placed **asymmetrically** — left-aligned with a
  pronounced right-side offset, often overlapping an image or coloured
  block by ~20px.
- A type pairing favourite: oversized Raleway display next to very small
  Inter `label-md` in primary red. The tag-magazine look.

### Background & imagery
- **No full-bleed gradients.** No mesh blobs. No "tech aurora."
- Imagery is **warm and grainy**, never cool/blue. Photography evokes
  Cuenca: terracotta rooftops, cobble streets, hands at work, woven
  textiles, dried clay.
- **Subtle linear gradients are allowed on primary CTAs only**
  (`#86231A → #A63A2F`, top to bottom).
- The Chakana mark may be used as a **foreground emblem** (header,
  splash, footer stamp) but never as a tiled background pattern.
- When floating navigation or modals overlay content, use **glassmorphism**:
  `surface @ 80% opacity` + `backdrop-blur: 12px`.

### Layout
- **Asymmetry by default.** A heading shifted left, an image cropped off
  the right edge, a paragraph indented half a column. Avoid centred
  symmetric hero compositions.
- **Overlap is encouraged** — let text overhang an image by ~20px,
  let a coloured block tuck under a card by 16px.
- Containment is achieved by **background shifts**, not borders. Step
  from `surface` to `surface-container-low` to enclose a section.
- Generous outer margins. Treat horizontal padding like a frame.

### Borders, shadows & elevation
- **The "No-Line" Rule.** Designers are prohibited from using 1px solid
  borders to define sections. Containment uses background shifts and
  negative space.
- If a border is required for a11y/affordance, use **Ghost Borders**:
  `outline-variant` at 15% opacity. Felt, not seen.
- **No standard tech drop shadows.** Floating elements use **Soil Shadows**:
  `0 20px 40px rgba(134, 35, 26, 0.05)` — primary red at low alpha,
  warm rather than cold.
- Modals/floating nav layer Soil Shadow + glassmorphism together.

### Corner radii
- **Universal 10px (`--radius-md`).** Buttons, inputs, cards, modals,
  images. The radius echoes "softened geometry of weathered stone".
- Pills (`999px`) only for chips, badges, and the cycle indicator dots.
- 4px / 6px reserved for tiny inline elements (kbd, code, tag swatches).

### Hover, press, focus
- **Hover (buttons):** subtle lift via `--shadow-soil-sm` + gradient
  shifts one stop darker. **Never a colour-flip.**
- **Hover (links):** colour shift `primary → primary-deep`; the underline
  is always present, doesn't appear/disappear.
- **Hover (cards):** the card rises with a Soil Shadow, the eyebrow
  tag shifts to `primary-deep`. No scale.
- **Press:** depth, not bounce. `transform: translateY(1px)` and shadow
  collapses to `--shadow-soil-sm`.
- **Focus:** 2px primary outline at radius+2, offset 2px. Inputs use a
  2px `primary` *underline* that animates in on focus while the fill
  stays put.

### Motion
- **Curves:** `cubic-bezier(0.22, 0.61, 0.36, 1)` is the default.
  Spring (`0.34, 1.56, 0.64, 1`) is used **once per page max** — usually
  on the splash logo entry.
- **Durations:** 120ms / 200ms / 360ms.
- **Crossfades over slides.** Carousels fade; they don't whoosh.
- No bounce, no parallax, no scroll-jacking, no number tickers.

### Transparency & blur
- Used **only** for the floating nav and modal overlays
  (glassmorphism). Body content is always solid.
- `backdrop-blur: 12px` is the canonical value.

### Cards
- Sit on `surface-container-lowest` (`#FFFFFF`) when on a
  `surface-container-low` (`#F8F3EE`) section, or on
  `surface-container-low` when on `background` (`#F5F0EB`).
- 10px radius. **No border.** No shadow at rest. Soil Shadow on hover.
- "Featured" cards may use the **Andean Edge** — a small 45° corner
  accent in `secondary` Turquesa, evoking the Chakana stepped corner.

### The Cycle Indicator
- A non-linear, **stepped 4-step track** (it mirrors the four arms of the
  Chakana). Filled steps in `secondary` Turquesa; remaining steps in
  `surface-container-highest`. Used for circular-economy progress
  (`Donado → Recolectado → Restaurado → Devuelto`).

---

## ICONOGRAPHY

The brand has **no proprietary icon font.** Two layers of glyphs are used
in production:

1. **Brand emblems (raster).** The Chakana mark from the splash, plus
   the wordmark "CHAKANA" and the place stamp "· CUENCA, ECUADOR ·".
   Stored in `assets/`. Never recreated as inline SVG — the mark is a
   piece of art, not an icon.
2. **Functional icons → Lucide.** Linked from CDN
   (`https://unpkg.com/lucide-static@latest`) and used at **1.5px stroke**
   on a 24px grid. Lucide's organic, hand-drawn weight matches the
   "softened geometry" rule far better than Material Icons or Heroicons
   (which feel too tech).

   _Substitution flag:_ this is a substitution — the brief did not ship
   an icon set. Lucide is the closest CDN-available match for the visual
   tone. If you have a curated icon set, drop it in and update §ICONOGRAPHY.

3. **Unicode used sparingly.** The mid-dot `·` is used as a metadata
   separator in eyebrows. The vertical bar `|` is used in the splash as a
   divider. Arrows (`→`, `↗`) appear in CTA copy. **No emoji at all.**

Files in `assets/`:
- `logo.png` — the Chakana mark on a transparent background, 400×400.
- `chakana-splash.png` — the original product splash, kept as a reference
  for hero composition, copy treatment, and atmosphere.

---

## INDEX

```
.
├── README.md                          ← you are here
├── SKILL.md                           ← agent skill manifest
├── colors_and_type.css                ← all foundational tokens (color, type, spacing, elevation, motion)
├── assets/
│   ├── logo.png                       ← Chakana mark, transparent
│   └── chakana-splash.png             ← original product splash, full
├── preview/                           ← Design System tab cards
│   ├── color-primary.html, color-secondary.html, color-surfaces.html, color-text.html, color-status.html
│   ├── type-display.html, type-headline.html, type-body.html, type-labels.html, type-pairing.html
│   ├── spacing-scale.html, radius-scale.html, elevation-soil.html, glass-surface.html
│   ├── component-buttons.html, component-inputs.html, component-cards.html, component-badges.html, component-cycle.html
│   └── brand-logo.html, brand-splash.html
└── ui_kits/
    └── marketing/                     ← Chakana platform marketing site
        ├── README.md
        ├── index.html                 ← composed homepage
        ├── Header.jsx, Hero.jsx, ImpactStrip.jsx, MarketSection.jsx,
        │   TallerSection.jsx, CycleSection.jsx, JoinSection.jsx, Footer.jsx
```
