# History of Money Card Trading Kit

This kit adds a **physical card-trading format** for Block 02 that fits JP's newer workshop direction: fast, tactile, Monopoly-Go-like trading instead of a plaza-first setup.

## What is included

- `index.html` — deck builder and print-ready sheet generator
- `styles.css` — poker-card layout, print styling, crop marks, and responsive preview
- `app.js` — the 8 card categories, default counts, mirrored back-page logic, and sheet rendering
- `generate-bw-pdf.py` — generates the office-printer-friendly black-and-white PDF
- `generate-bw-pdf-8up.py` — generates the safer 8-up black-and-white PDF
- `history-of-money-card-trading-kit-bw.pdf` — bundled 9-up black-and-white printable deck
- `history-of-money-card-trading-kit-bw-8up.pdf` — bundled safer 8-up black-and-white printable deck

## Card types included

The deck generator includes these 8 workshop-ready categories:

1. Mango
2. Cattle
3. Shelter
4. Water
5. Fish
6. Gold Coins
7. Banknotes
8. Dollars

Default output is **100 cards of each type** for a full 800-card run.

## How to open it

Open this file in any browser:

- `BLOCK 02 - HISTORY OF MONEY/moneypoly/physical-kit/history-of-money-card-kit/index.html`

If you prefer from the repo root, you can also open:

- `./BLOCK 02 - HISTORY OF MONEY/moneypoly/physical-kit/history-of-money-card-kit/index.html`

## How to print

1. Open `index.html`.
2. Use **Download safest B&W PDF** if your printer or phone preview clips near the edges.
3. Use **Download standard B&W PDF** for the denser 9-up office-printer-friendly version, or **Download color PDF** if you want the richer file.
4. Leave the default counts at `100` for each category, or reduce them for a smaller test deck.
5. Click **Print fronts**.
6. Reinsert the printed sheets.
7. Click **Print backs** and use **flip on long edge**.
8. Cut along crop marks.

## Suggested workshop use

- Use mango, fish, water, shelter, and cattle cards in the early barter rounds.
- Introduce gold coins once the room is ready to talk about durable commodity money.
- Introduce banknotes when you shift to redeemable paper claims and trusted issuers.
- Introduce dollars when you want a clean fiat-money round with easy exchange and inflation/debasement discussion.
- Keep one or two full decks per table cluster so trading feels abundant and quick.

## Facilitator notes

- The face designs are intentionally clear and readable from hand distance, not poster distance.
- The back designs are category-specific so facilitators can sort decks quickly after a workshop.
- The print generator mirrors each 9-card back page for simpler duplex alignment.
- Run a 1-page print test before committing the full 178-sheet duplex job.

## Fast verification

Before handing it off, check:

- the page loads in a browser
- the deck summary shows 800 total cards by default
- fronts render as 89 sheets
- backs render as 89 mirrored sheets
- each of the 8 categories appears in the legend and the generated deck
