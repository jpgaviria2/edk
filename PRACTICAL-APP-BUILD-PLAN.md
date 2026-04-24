# Practical App Build Plan

Goal: turn the EDK into the ultimate practical Bitcoin learning platform, using My First Bitcoin curriculum as the content backbone and one practical app/game per block.

## Content architecture

Each block now has:

- `CURRICULUM.md` — source mapping and game opportunities
- `CONTENT-PLAN.md` — block-specific learning goals, key concepts, source files, and app thesis
- `APP-BRIEF.md` — build-ready practical app brief
- `curriculum-content/` — copied relevant My First Bitcoin markdown files for that block
- `index.html` — block landing page linking learners/builders to the block content

## Standard app structure for every block

Each practical app should include:

1. **Learn** — short, curriculum-backed concept explanation
2. **Try** — interactive game/simulator
3. **Discuss** — facilitator prompts
4. **Apply** — real-world decision/scenario
5. **Build** — printable/classroom extension

## Build priority

1. Finish Block 2 — History of Money as the reference-quality app.
2. Build Block 1 — What Is Money? to introduce money functions/properties before history.
3. Build Block 3 — Fiat, Inflation & Purchasing Power to deepen the problem setup.
4. Build Block 4 — Why Bitcoin? Problems → Solutions to bridge into Bitcoin.
5. Build Blocks 5–12 in sequence.

## Quality bar

A block is production-ready when:

- It teaches one clear concept per screen.
- It has at least one practical interactive exercise.
- It can be used solo or by a facilitator.
- It includes attribution to My First Bitcoin where curriculum is adapted.
- It works as static GitHub Pages content.
- It passes a local static smoke test.

## Canonical 12 blocks

1. What Is Money?
2. History of Money
3. Fiat, Inflation & Purchasing Power
4. Why Bitcoin? Problems → Solutions
5. What Is Bitcoin?
6. Wallets, Keys & Custody
7. Transactions: Send & Receive
8. Lightning & Daily Payments
9. Hashing, Mining & Proof of Work
10. Nodes, Rules & Consensus
11. UTXOs, Fees & Privacy
12. Bitcoin Future & Philosophy
