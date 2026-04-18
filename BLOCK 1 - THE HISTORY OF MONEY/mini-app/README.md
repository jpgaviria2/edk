# History of Money Mini App MVP

Lean mobile-first mini app for the EDK `Block 1` lesson.

## What it includes

- Intro screen
- Round 1: barter
- Round 2: commodity money
- Round 3: inflation
- Money properties recap
- Short Bitcoin bridge
- Replay support

## Why this location

This repo currently appears to be content-first and does not yet contain a dedicated Fedi or web app package scaffold. To keep the MVP directly usable in JP's fork without inventing a larger app architecture, this mini app lives beside the relevant lesson content in:

- `BLOCK 1 - THE HISTORY OF MONEY/mini-app/`

That makes it easy to:

- open directly as a static web experience
- wrap or port into a future Fedi mini app container
- evolve the content next to the underlying lesson materials

## Run locally

Open `index.html` directly in a browser, or serve the folder with any simple static server if preferred.

## Structure

- `index.html` — shell
- `styles.css` — mobile-first UI
- `app.js` — tiny reusable round engine + configurable content
