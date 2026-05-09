---
name: chakana-design
description: Use this skill to generate well-branded interfaces and assets for Chakana — an Ancestral-Modernism, Andean-rooted circular-economy platform — either for production or for throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files (`colors_and_type.css`, `assets/`, `preview/`, `ui_kits/marketing/`).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy the relevant assets out (`assets/logo.png`, `colors_and_type.css`, the JSX components in `ui_kits/marketing/`) and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions about audience, surface (web / app / print / slide), language (Spanish first by default), and tone (editorial / civic / quiet), then act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Two non-negotiables to honour every time:

1. **The "No-Line" Rule.** Never use 1px solid borders to define sections. Use background shifts (`surface` → `surface-container-low`) and the spacing scale instead. If a border is required, use the `outline-variant` ghost border at 15% opacity.
2. **Never pure black, never pure white.** Text is `#3D3D3D` Gris Carbón. The page canvas is `#F5F0EB` Crema. Pure white only appears as the topmost surface tier (`surface-container-lowest`).
