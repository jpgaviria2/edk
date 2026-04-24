# History of Money Mini App

A polished static mini app for the EDK `Block 1` lesson.

## What it now includes

- My First Bitcoin Diploma alignment for:
  - money emerging from barter and market process
  - medium of exchange, store of value, and unit of account
  - durability, portability, divisibility, fungibility/uniformity, scarcity, and acceptability
- Cleaner landing page with clear entry points for:
  - **Solo mode**
  - **Presenter / conference mode**
- A cleaner **guided solo market** as the opening experience
  - player starts with a concrete item
  - player has a concrete target item to reach
  - solo mode surfaces one trader/concept at a time instead of overwhelming the learner with a full market
  - successful trades are recommended when they exist; failed trades explain coincidence-of-wants, quantity, and divisibility problems in plain language
- Presenter mode still keeps the fuller market simulation
  - multiple visible trader cards with clear **HAVE** and **WANT** states
  - step-by-step market trading with a visible trade log and market inventory
- Follow-up rounds for:
  - commodity money
  - inflation
- Stronger feedback states for correct and incorrect answers
- Improved recap readability with round history and selected money traits
- Bitcoin bridge and clearer replay options
- Presenter foundations aligned to the market simulation:
  - projector-friendly layout
  - participant market board with people/roles in the market
  - presenter-controlled market progression
  - reveal / hide lesson controls for later rounds
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
- `styles.css` — mobile-first, tactile market UI, and projector-aware styling
- `app.js` — barter market game flow, presenter market simulation, later lesson rounds, and content model
