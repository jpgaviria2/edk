# Board Model

## Recommended board size
Use a **Monopoly-style 24-space perimeter board** per table.

Why 24 spaces:
- feels like a real board game loop
- enough variety for multiple money systems
- still fast enough for moderator-led play
- supports **up to 8 players/teams per table**
- gives more satisfying movement than an ultra-short loop

See also: `BOARD-LAYOUT-24SPACE.md`

## Recommended board spaces
Recommended 24-space perimeter layout:
1. GO / Production
2. Water Trade
3. Open Market A
4. Food Trade
5. Crisis Space A
6. Commodity Exchange
7. Community Well
8. Shelter Trade
9. Open Market B
10. Fish Trade
11. Gold Market
12. Government Levy
13. Trade Route
14. Medici Bank
15. Open Market C
16. Cattle Trade
17. Crisis Space B
18. Central Bank
19. Vault / Treasury
20. Bitcoin Savings
21. Lightning Payment
22. Open Market D
23. Generational Wealth Check
24. Ruler / Policy Space

## Space behavior
### GO / Production
Collect your role payout.

### Trade spaces
Accept the posted trade, pay with current-era money if allowed, or skip.

### Commodity Exchange
Convert goods into the current commodity money if allowed by the era.

### Crisis Space
Resolve the currently active event or draw a local event if instructed.

### Gold Market
Convert into or out of gold if the era allows.

### Medici Bank
Deposit gold, receive slips, redeem slips, or check branch rules.

### Government / Ruler
Resolve taxes, freezes, confiscations, or policy changes.

### Central Bank
Introduce fiat, interest, or money printing changes.

### Bitcoin Savings
Move value into sats, choose custody mode, or protect savings.

### Lightning Payment
Make one fast low-friction sats payment.

### Generational Wealth Check
Set aside savings for final scoring.

## Important design rule
A landed space should never require open-ended negotiation to understand what happens.
Every space must present a **small menu of clear choices**.

Target resolution speed:
- understand space in under 5 seconds
- choose action in under 10 seconds
- finish resolution in under 20 seconds
