# History of Money Mini App

A polished static mini app for the EDK `Block 1` lesson.

## What it now includes

- Cleaner landing page with clear entry points for:
  - **Solo mode**
  - **Presenter / conference mode**
- Three polished rounds:
  - barter
  - commodity money
  - inflation
- Stronger feedback states for correct and incorrect answers
- Improved recap readability with round history and selected money traits
- Bitcoin bridge and clearer replay options
- Presenter foundations:
  - projector-friendly layout
  - reveal / hide lesson controls
  - next / restart / reset round / skip round controls
  - lightweight facilitator prompts in the UI
  - simple audience vote board scaffold with per-round reset

## GitHub Pages / root launch

This repo now launches the History of Money experience from the **repository root** via `index.html`.

Implementation detail:
- root `index.html` redirects to `BLOCK 1 - THE HISTORY OF MONEY/mini-app/`
- app source remains inside the lesson folder so the experience stays close to its educational content

## Why this approach

It keeps the project:
- **static-site friendly** for GitHub Pages
- suitable for mini app wrapping later
- modular enough for the History of Money lesson to grow
- focused on this lesson only, without introducing a generic platform

## Files

- `index.html` — document shell
- `styles.css` — mobile-first and projector-aware styling
- `app.js` — lesson flow, presenter controls, voting scaffold, and content model
