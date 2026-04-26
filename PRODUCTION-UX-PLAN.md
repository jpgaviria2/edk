# EDK Production UX Implementation Plan

Goal: make EDK feel like the Duolingo of Bitcoin learning — guided, low-friction, mobile-first, and playful — while giving facilitators a separate group/classroom mode like Airbnb separates browsing from hosting.

## Product principles

1. **One clear next action per screen**
   - Learners should never wonder where to click next.
   - Each block page should show one primary action: Start lesson / Continue / Try activity.

2. **Two distinct app modes**
   - **Learn mode:** solo learner journey, short screens, progress path, quizzes, simulations, reflection.
   - **Host mode:** facilitator dashboard, group flow, timing, materials, roles, discussion prompts, projector-friendly instructions.

3. **Progressive disclosure**
   - No long curriculum dumps.
   - Content appears as cards, steps, activities, and expandable sections.
   - Advanced/reference content lives behind “More context,” not in the main path.

4. **Mobile-first, classroom-ready**
   - Learner mode works on a phone.
   - Host mode works on a laptop/projector.
   - No backend required; static GitHub Pages compatible.

5. **Play before explanation**
   - Start each block with a scenario or small decision.
   - Teach concepts after the learner experiences the problem.

## Information architecture

```text
/                 Marketing-style landing page with mode choice
/learn/           Learner path dashboard
/host/            Facilitator / group mode dashboard
/BLOCK 01.../     Learner-facing block page
/BLOCK 02.../     Learner-facing flagship block page
...
/assets/          Shared CSS/JS/design system
```

## Global navigation

Desktop:
- EDK logo
- Learn
- Host
- Roadmap
- GitHub
- Primary CTA

Mobile:
- EDK logo
- Hamburger button
- Slide/dropdown menu
- Mode switch buttons: Learn / Host

Footer:
- Learn path
- Host mode
- Materials
- GitHub
- License / credits note in repo docs, not intrusive on learner screens

## Learner mode UX

Each learner block page should have:
- App header with progress indicator
- Block number and estimated time
- Short concept intro
- “What you’ll do” cards
- One interactive activity or quiz
- Reflection text box only when useful
- Clear next-block CTA
- “Host this lesson” secondary link

## Host mode UX

Host mode should feel like a facilitator control panel:
- Choose session length: 10 / 30 / 60 minutes
- Group size guidance
- Materials checklist
- Run-of-show
- Discussion prompts
- Projector prompt cards
- Debrief questions
- Link back to learner activity

## Cleanup rules

- Remove curriculum-document presentation from learner pages.
- No blank worksheet rows or placeholder form images.
- No visible source-path references.
- Avoid walls of text.
- Use cards, chips, progress, buttons, and short paragraphs.
- Keep deep references in markdown docs, not on main app screens.

## Implementation phases

### Phase 1 — Navigation and mode split
- Add shared CSS/JS design system.
- Add responsive header, hamburger menu, footer.
- Create `/learn/` dashboard.
- Create `/host/` dashboard.
- Update homepage to route users into Learn or Host.

### Phase 2 — Beginner funnel polish
- Redesign Blocks 1–4 as concise app screens.
- Add progress indicators and next actions.
- Make Block 2 feel like the flagship.
- Add “Host this lesson” link on every block.

### Phase 3 — Full 12-block consistency
- Apply same shell to Blocks 5–12.
- Add locked/up-next states where activities are not yet fully interactive.
- Standardize icons, lesson durations, and activity labels.

### Phase 4 — Rich interactions
- Add local progress with `localStorage`.
- Add better quizzes and scoring.
- Add activity timers for host mode.
- Add printable cards / projector mode per block.

### Phase 5 — Production polish
- Accessibility pass.
- Link checks.
- Responsive QA.
- Performance cleanup.
- GitHub Pages deployment verification.
