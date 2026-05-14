# Moneypoly Moderator Mode

This is the recommended format for a **large meetup / conference room**.

## Core concept

The room plays as **8 parallel table boards**, but the experience is controlled by **one central moderator on stage**.

That means:
- the moderator rolls the dice for everyone
- all tables move at the same time
- all tables resolve their landing space at the same time
- the moderator announces events to the whole room
- bankers/table captains enforce the effects locally

This solves the biggest large-room problem: speed and synchronization.

## Recommended room structure

- **1 moderator on stage**
- **1 projected master board / timer / event screen**
- **8 physical table boards**
- **up to 8 players or teams per table**
- **1 table captain or banker per table pair**

Recommended sweet spot: 6 players/teams per table.
Maximum supported: 8 players/teams per table.

## What each table is

Each table is a **self-contained local market board** with:
- the same board layout
- the same categories of spaces
- the same movement each round
- different player inventories and trade decisions

So the room shares one rhythm, but each table still has its own outcomes.

## Turn loop

### 1. Moderator rolls dice on stage
Example: "Everyone moves 6."

### 2. Every team moves 6 spaces on its own board
Movement is synchronized across the room.

### 3. Teams resolve their landing space
At each table, the team decides:
- take the trade
- skip the trade
- use money if the era allows it
- save instead of spending

### 4. Banker / table captain checks trades
The table captain enforces prices, event effects, and validity.

### 5. Moderator checks if room is ready
When most tables are done, next roll begins.

## Passing GO

When a team passes or lands on **GO**, it receives a production payout based on its home good.

### Recommended base payouts
- Mango producer → **+10 mangoes**
- Water producer → **+5 water**
- Fish producer → **+4 fish**
- Cow producer → **+1 cow**
- Shelter producer → **+1 shelter**

These should reflect relative value, not equal unit counts.

## Why fixed payouts beat percentages
Use **fixed payouts**, not 10% of inventory.

Why:
- faster mental math
- easier for large rooms
- easier for table captains to enforce
- keeps production tied to role identity
- avoids runaway scaling from big hoards

## Board logic

Each board should use a **Monopoly-style 24-space perimeter**.
This gives the live room the feel of a real board game while still keeping moderator control.

See: `BOARD-LAYOUT-24SPACE.md`

## Best gameplay rule
Teams do **not** negotiate endlessly.

Instead, when they land on a space, they choose from a small number of allowed actions:
- accept posted trade
- decline
- exchange using current era money
- bank / save / convert if the space allows it

This keeps the room moving.

## Moderator role by era

### Barter
- moderator explains direct trade only
- everyone moves together
- players feel mismatch and friction

### Commodity money
- moderator introduces shells / commodity money
- same movement, easier settlements

### Gold
- moderator introduces harder savings, harder portability

### Medici / Ledgers
- moderator introduces bank slips and branch rules

### Fiat
- moderator introduces central bank, printing, freezes, policy power

### Bitcoin
- moderator introduces sats, custody, and non-debasable supply

## Event model

Events are announced from the stage.

### Best event structure
The moderator reveals:
1. who is affected
2. what changed
3. what the consequence is

Example:
- "Event: Drought"
- "Affected: all tables"
- "Consequence: remove 1 water from each team and double water price until next event"

Or targeted:
- "Event: Bank Freeze"
- "Affected: tables 2, 5, and 7"
- "Consequence: one chosen team per affected table cannot spend fiat until next round"

## Best staffing model for this format

### Moderator on stage
Owns:
- dice rolls
- event reveals
- era transitions
- debriefs

### AV / scorekeeper
Owns:
- projected die roll
- timer
- event slides
- readiness tracking

### Table captains / bankers
Owns:
- enforce local board actions
- issue payouts at GO
- validate trades
- apply event effects
- report confusion quickly

## Recommendation

For the live big-room version, this should become the **primary canonical format**.

Not free-roaming market chaos.
Not one giant shared board.

Instead:
- **one moderator rhythm**
- **many parallel boards**
- **fast synchronized turns**
- **stage-led event reveals**
